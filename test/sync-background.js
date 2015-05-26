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

describe( "sync-background", function() {
	this.timeout( 10000 );

	describe( "sync-background-disabled", function() {
		var hook, webDavServer, syncPoint, emitter;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			syncPoint = helper.createSyncPointWithContent( "local-disabledBackground", function() {
				server.startServerWithContent( "server-onetheme", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.requestCancel( emitter, function() {
					helper.cleanupSyncPoint( done );
				} );
			} );
		} );

		it( "Should recognize disabled background sync", function( done ) {

			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {
					setTimeout( function() {

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( done, function() {
							hook.captured().should.containEql( "Background synchronization disabled." );
						} );
					}, 500 );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: false,
				backgroundSync: true
			}, emitter );

		} )

	} )

	describe( "sync-background-simple", function() {
		var hook, webDavServer, syncPoint, emitter;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			syncPoint = helper.createSyncPointWithContent( "local-onetheme", function() {
				helper.setBackgroundSyncTimeoutInMillis( 1 * 1000 );
				server.startServerWithContent( "server-onetheme", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.resetBackgroundSyncTimeout();
				helper.requestCancel( emitter, function() {
					helper.cleanupSyncPoint( done );
				} );
			} );
		} );

		it( "Should recognize short background wait", function( done ) {
			var count = 0;
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "waiting_for_sync" ) {
					setTimeout( function() {

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( function() {

							// callback
							if ( count >= 5 ) {
								emitter.emit( "request_cancel" );
								setTimeout( function() {
									done();
								}, 500 );
							}
						}, function() {
							hook.captured().should.containEql( "Starting next synchronization in 5 minutes..." );
							count++;
						} );
					}, 100 );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: true
			}, emitter );

		} )

	} )

	describe( "sync-background-complex", function() {
		var hook, webDavServer, serverDir, syncPoint, tempDir, emitter;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			helper.setBackgroundSyncTimeoutInMillis( 1 * 1000 );
			syncPoint = helper.createSyncPointWithContent( "local-sync-watch", function() {
				tempDir = helper.createTempDirWithContent( "local-sync-watch-resources", function() {
					serverDir = server.startServerWithContent( "server-sync-watch", function( s ) {
						webDavServer = s;
						done();
					} );
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.resetBackgroundSyncTimeout();

				// special case where we cannot use the helper function as the background sync kicks in otherwise
				emitter.emit( "request_cancel" );
				setTimeout( function() {
					helper.resetLogger( function() {
						helper.cleanupSyncPoint( function() {
							helper.cleanupTempDir( done );
						} );
					} );
				}, 2000 );
			} );
		} );

		it( "Should delay background sync", function( done ) {
			this.timeout( 20000 );

			var phase = 0, /* 0 = initial sync, 1 = watching and processing file changes, 2 = idle state */
				stop1 = false;
				count = {
					"upload": 0,
					"rename": 0,
					"delete": 0
				},
				expected = {},
				waitForSync = 0,
				startTimestamp = 0;

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				if ( phase == 1 ) {

					if ( ( name == "upload" || name == "delete" || name == "rename" ) && param == "complete" ) {
						count[name]++;
					} else if ( name == "waiting_for_sync" ) {
						waitForSync++;
					}

					//console.log( count );
					//console.log( expected );
					// test case can only be complete after the last file was processed
					if ( count.upload == expected.upload &&
						 count.rename == expected.rename &&
						 count.delete == expected.delete && !stop1 ) {

						// must not be called twice
						stop1 = true;

						// there must not have been a wait for sync event
						waitForSync.should.be.equal( 0, "There must not be a synchronization happening while other stuff is going on." );

						// next phase
						phase++;

					}
				} else if ( phase == 2 ) {

					//console.log( "#2", name, param );
					if ( name == "idle" ) {
						var timeDiff = new Date().getTime() - startTimestamp;

						// 10 seconds
						timeDiff.should.be.above( 2 * 1000 );

						done();
					}

				} else {
					if ( name == "waiting_for_sync" ) {

						// next phase
						phase++;

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( nextStep, function() {
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23, uploaded: 0, downloaded: 0, deletedLocale: 0, deletedRemote: 0, conflicts: 0, conflictsResolved: 0, noaction: 23, errors: 0
							} );
						} );

						function nextStep() {

							// this is the real test for watching
							startTimestamp = new Date().getTime();

							// create files
							fs.writeFileSync( syncPoint + "/css/hello.css", "Test2" );
							helper.addExpectedCount( "create", expected );

							// create through rename
							helper.renameSyncNoExec( tempDir + "/preview.png", syncPoint + "/preview.png" );
							helper.addExpectedCount( "create", expected );

							// update files
							helper.updateFile( syncPoint + "/read me.txt", "LOCAL UPDATE\n" );
							helper.addExpectedCount( "update", expected );
							helper.updateFile( syncPoint + "/profiles/profile_deferred.json", "LOCAL UPDATE\n" );
							helper.addExpectedCount( "update", expected );

							// delete files
							helper.unlinkSyncNoExec( syncPoint + "/theme.html" );
							helper.addExpectedCount( "delete", expected );
							helper.unlinkSyncNoExec( syncPoint + "/css/deeper/default.css" );
							helper.addExpectedCount( "delete", expected );

							// delete through rename
							helper.renameSyncNoExec( syncPoint + "/profiles/profile_dojo_lightweight.json", tempDir + "/profile_dojo_lightweight.json" );
							helper.addExpectedCount( "delete", expected );

							// move files
							helper.renameSyncNoExec( syncPoint + "/Plain.html", syncPoint + "/css/Plain.html" );
							helper.addExpectedCount( "move", expected );
							helper.renameSyncNoExec( syncPoint + "/profiles/profile_dojo_deferred.json", syncPoint + "/profile_dojo_deferred.json" );
							helper.addExpectedCount( "move", expected );

							// rename files
							helper.renameSyncNoExec( syncPoint + "/images/favicon.ico", syncPoint + "/images/favicon2.ico" );
							helper.addExpectedCount( "rename", expected );
							helper.renameSyncNoExec( syncPoint + "/contributions/schema/JSON Module Contribution Schema v1.8.json", syncPoint + "/contributions/schema/JSON Module Contribution Schema v1.9.json" );
							helper.addExpectedCount( "rename", expected );

						}

					}

				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: true
			}, emitter );

		} )

	} )

} )
