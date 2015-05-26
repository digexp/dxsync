/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	events = require( "events" ),
	should = require( "should" ),
	helper = require( "./helper" ),
	server = require( "./server" ),
	sync = helper.getSyncModule(),
	syncUtils = require( "../lib/utils" );

// SETUP
// changed locally and remotely: read me.txt
// changed locally and remotely: profiles/profile_deferred.json
// deleted locally and changed remotely: contributions/schema/JSON Module Contribution Schema v1.8.json
// changed locally and deleted remotey: css/deeper/blue/blue.css.uncompressed.css

describe( "sync-conflict-watch", function() {
	this.timeout( 10000 );

	describe( "sync-conflict-watch", function() {
		var hook, webDavServer, syncPoint, serverDir, tempDir, emitter;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			syncPoint = helper.createSyncPointWithContent( "local-sync-watch", function() {
				tempDir = helper.createTempDirWithContent( "local-sync-watch-resources", function() {
					serverDir = server.startServerWithContent( "server-sync-watch", function( s ) {
						webDavServer = s;
						done();
					} );
					serverDir += "/themes/Theme One";
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.requestCancel( emitter, function() {
					helper.resetLogger( function() {
						helper.cleanupSyncPoint( function() {
							helper.cleanupTempDir( done );
						} );
					} );
				} );
			} );
		} );

		it( "Should recognize that no update is needed because file has been deleted remotely and locally", function( done ) {
			var watching = false,
				stop = false;
				syncCount = 0;

			sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				if ( watching ) {

					//console.log( name, param );
					if ( name == "filesync" && param == "complete" ) {
						syncCount++;
					}

					// test case can only be complete after the last file was processed
					if ( syncCount == 1 && !stop ) {

						// must not be called twice
						stop = true;
						setTimeout( function() {

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "Local and remote hashes are both null. This may happen if the file was deleted locally and remotely. (/css/deeper/default.css)" );
							} );
						}, 500 );

					}

				} else {
					if ( name == "sync" && param == "complete" ) {

						// next phase
						watching = true;

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( nextStep, function() {
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23, uploaded: 0, downloaded: 0, deletedLocale: 0, deletedRemote: 0, conflicts: 0, conflictsResolved: 0, noaction: 23, errors: 0
							} );
						} );

						function nextStep() {

							// this is the real test for watching

							// first delete file remotely (as if somebody else deleted it)
							helper.unlinkSyncNoExec( serverDir + "/css/deeper/default.css" );

							//second delete the file locally which the watcher should recognize
							helper.unlinkSyncNoExec( syncPoint + "/css/deeper/default.css" );

						}

					}

				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} );

		it( "Should recognize conflict resolution on rename", function( done ) {
			var watching = false,
				stop = false;
				syncCount = 0;

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				if ( watching ) {

					//console.log( name, param );
					if ( name == "conflict_recognized" ) {

						// now we continue with our test
						setTimeout( function() {

							helper.renameSyncNoExec( syncPoint + "/css/deeper/default.css", syncPoint + "/css/deeper/default.css.resolve" );

						}, 500 );
					} else if ( name == "conflict_resolve" && param && param.action == "complete" ) {

						// it is important that we give plenty of time because there is some unwatch/watch action going on
						// in the background and if we end the testcase too earlier follow on testcases may fail
						setTimeout( function() {

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "File upload complete: css/deeper/default.css" );
								hook.captured().should.match( /Merge conflict resolved for (.*)\/css\/deeper\/default\.css/ );
							} );
						}, 2000 );
					}
				} else {
					if ( name == "sync" && param == "complete" ) {

						// next phase
						watching = true;

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( nextStep, function() {
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23, uploaded: 0, downloaded: 0, deletedLocale: 0, deletedRemote: 0, conflicts: 0, conflictsResolved: 0, noaction: 23, errors: 0
							} );
						} );

						function nextStep() {

							// this is the real test for watching, continues a few lines up at event 'conflict_recognized'

							// first update the file remotely
							helper.updateFile( serverDir + "/css/deeper/default.css", "REMOTE UPDATE" );

							// second update the file locally, which should be recognized as conflict
							helper.updateFile( syncPoint + "/css/deeper/default.css", "LOCAL UPDATE" );

						}

					}

				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} );

		it( "Should recognize conflict resolution through event", function( done ) {
			var watching = false,
				stop = false;
				syncCount = 0;

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				if ( watching ) {

					//console.log( name, param );
					if ( name == "conflict_recognized" ) {

						// now we continue with our test
						setTimeout( function() {

							emitter.emit( "conflict_resolve", {
								"id": syncPoint + "/css/deeper/default.css",
								"resolveWith": syncPoint + "/css/deeper/default.css",
								"action": "invalid"
							} );

							emitter.emit( "conflict_resolve", {
								"id": syncPoint + "/css/deeper/default.css",
								"resolveWith": syncPoint + "/css/deeper/default.css",
								"action": "upload"
							} );

						}, 500 );
					} else if ( name == "conflict_resolve" && param && param.action == "complete" ) {

						// it is important that we give plenty of time because there is some unwatch/watch action going on
						// in the background and if we end the testcase too earlier follow on testcases may fail
						setTimeout( function() {

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "Unknown action Theme One" );
								hook.captured().should.containEql( "File upload complete: css/deeper/default.css" );
								hook.captured().should.match( /Merge conflict resolved for (.*)\/css\/deeper\/default\.css/ );
							} );
						}, 2000 );
					}
				} else {
					if ( name == "sync" && param == "complete" ) {

						// next phase
						watching = true;

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( nextStep, function() {
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23, uploaded: 0, downloaded: 0, deletedLocale: 0, deletedRemote: 0, conflicts: 0, conflictsResolved: 0, noaction: 23, errors: 0
							} );
						} );

						function nextStep() {

							// this is the real test for watching, continues a few lines up at event 'conflict_recognized'

							// first update the file remotely
							helper.updateFile( serverDir + "/css/deeper/default.css", "REMOTE UPDATE" );

							// second update the file locally, which should be recognized as conflict
							helper.updateFile( syncPoint + "/css/deeper/default.css", "LOCAL UPDATE" );

						}

					}

				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} );

		if ( process.platform == "linux" ) {
			console.log( "We have to skip these testcases as they don't work on Linux!" );
		} else {
			it( "Should recognize conflict on rename and skip renaming it remotely", function( done ) {
				var watching = false,
					stop = false;
					syncCount = 0;

				sync.setLoggerConfig( null, { debug: true, finest: true }, null );

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						//console.log( name, param );
						if ( name == "conflict_recognized" ) {

							// now we continue with our test
							setTimeout( function() {

								helper.renameSyncNoExec( syncPoint + "/css/deeper/default.css", syncPoint + "/css/deeper/default_new.css" );

								// there is no event for this, so we simply give it 2s before we validate the result
								// it is important that we give plenty of time because there is some unwatch/watch action going on
								// in the background and if we end the testcase too earlier follow on testcases may fail
								setTimeout( function() {

									// this indirection is need to call done in success and failure cases
									helper.asyncCheck( done, function() {
										hook.captured().should.containEql( "Skipping renaming local file due to an outstanding merge conflict: css/deeper/default.css" );
									} );
								}, 2000 );
							}, 500 );
						}
					} else {
						if ( name == "sync" && param == "complete" ) {

							// next phase
							watching = true;

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( nextStep, function() {
								hook.captured().should.containEql( "Synchronization complete." );
								helper.assertSyncReport( hook.captured(), {
									total: 23, uploaded: 0, downloaded: 0, deletedLocale: 0, deletedRemote: 0, conflicts: 0, conflictsResolved: 0, noaction: 23, errors: 0
								} );
							} );

							function nextStep() {

								// this is the real test for watching, continues a few lines up at event 'conflict_recognized'

								// first update the file remotely
								helper.updateFile( serverDir + "/css/deeper/default.css", "REMOTE UPDATE" );

								// second update the file locally, which should be recognized as conflict
								helper.updateFile( syncPoint + "/css/deeper/default.css", "LOCAL UPDATE" );

							}

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: false
				}, emitter );

			} );

		}

	} );

} );
