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

describe( "sync-watch-win-bug-workaround", function() {
	this.timeout( 20000 );

	if ( process.platform == "win32" ) {
		console.log( "We have to skip these testcases as they don't work on Windows!" );
	} else {
		describe( "sync-watch-win-bug-workaround-on-darwin", function() {
			var hook, webDavServer, serverDir, syncPoint, tempDir, emitter;
			beforeEach( function( done ) {
				hook = helper.captureStream( process.stdout );
				emitter = new events.EventEmitter();
				syncPoint = helper.createSyncPointWithContent( "local-sync-watch-64", function() {
					tempDir = helper.createTempDirWithContent( "local-sync-watch-resources", function() {
						serverDir = server.startServerWithContent( "server-sync-watch-64", function( s ) {
							webDavServer = s;
							done();
						} );
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

			it( "Should not recognize watch limit for windows bug as we are on darwin", function( done ) {

				//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

				emitter.on( "status", function( name, param ) {

					//console.log( name, param );

					if ( name == "watching_files" ) {

						helper.asyncCheck( done, function() {
							hook.captured().should.not.containEql( "Unable to watch the following directories due to an unresolved bug in a prereq component." );
							hook.captured().should.not.containEql( "/blue/deepestOfThemAll" );
						} );
					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: false
				}, emitter );

			} );

			it( "Should not recognize watch limit for windows bug even when creating or deleting directories as we are on darwin", function( done ) {
				var watching = false,
					stop = false,
					idleCount = 0;

				//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						if ( name == "idle" ) {
							idleCount++;
						}

						//console.log( name, param, idleCount );

						// test case can only be complete after the last file was processed
						if ( idleCount == 2 && !stop ) {

							// must not be called twice
							stop = true;

							// this indirection is need to call done in success and failure cases

							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "File upload complete: css/empty.txt" );
								hook.captured().should.containEql( "Directory deletion complete: images" );
								hook.captured().should.containEql( "File upload complete: css/deeper/blue/deepestOfThemAll/empty.txt" );
								hook.captured().should.containEql( "Directory creation complete: newFolder" );
								hook.captured().should.not.match( /Unable to watch directory '(.*)\/newFolder' due to an unresolved bug in a prereq component./ );
							} );

						}

					} else {
						if ( name == "watching_files" ) {

							// we are using the deepest folder that we know. This must never watched as we skip the ones
							// with the deepest folder structure
							var deepestFolderOfThemAll = "/css/deeper/blue/deepestOfThemAll";

							// next phase
							watching = true;

							// this is the real test for watching

							// create files
							fs.writeFileSync( syncPoint + deepestFolderOfThemAll + "/empty.txt", "Something" );
							fs.writeFileSync( syncPoint + "/css/empty.txt", "Something" );

							// delete folder
							helper.deleteFolderRecursive( syncPoint + "/images", function() {
								setTimeout( function() {

									// create folder
									fs.mkdirSync( syncPoint + "/newFolder" );
								}, 1000 );
							} );

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: false
				}, emitter );

			} );

		} );

	}

	describe( "sync-watch-win-bug-workaround", function() {
		var hook, webDavServer, serverDir, syncPoint, tempDir, emitter;
		beforeEach( function( done ) {
			helper.setPlatform( "win32" );
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			syncPoint = helper.createSyncPointWithContent( "local-sync-watch-64", function() {
				tempDir = helper.createTempDirWithContent( "local-sync-watch-resources", function() {
					serverDir = server.startServerWithContent( "server-sync-watch-64", function( s ) {
						webDavServer = s;
						done();
					} );
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.requestCancel( emitter, function() {
					helper.resetLogger( function() {
						helper.resetPlatform();
						helper.cleanupSyncPoint( function() {
							helper.cleanupTempDir( done );
						} );
					} );
				} );
			} );
		} );

		it( "Should recognize watch limit for windows bug", function( done ) {

			sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				//console.log( name, param );

				if ( name == "watching_files" ) {

					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Unable to watch the following directories due to an unresolved bug in a prereq component." );
						hook.captured().should.containEql( "/css/deeper/blue/deepestOfThemAll" );
						hook.captured().should.match( /Skipping to watch '(.*)\/css\/deeper\/blue\/deepestOfThemAll\/blue\.css' due to the fact that the directory is already unwatched./ );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} );

		it( "Should recognize keep watch limit for windows bug even when creating or deleting directories", function( done ) {
			var watching = false,
				stop = false,
				idleCount = 0;

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				if ( watching ) {

					if ( name == "idle" ) {
						idleCount++;
					}

					//console.log( name, param, idleCount );

					// test case can only be complete after the last file was processed
					if ( idleCount == 2 && !stop ) {

						// must not be called twice
						stop = true;

						// this indirection is need to call done in success and failure cases

						helper.asyncCheck( done, function() {
							hook.captured().should.containEql( "File upload complete: css/empty.txt" );

							// deleting directories doesn't work on Windows
							if ( process.platform != "win32" ) {
								hook.captured().should.containEql( "Directory deletion complete: images" );
							}
							hook.captured().should.not.containEql( "File upload complete: css/deeper/blue/deepestOfThemAll/empty.txt" );
							hook.captured().should.containEql( "Directory creation complete: newFolder" );
							hook.captured().should.match( /Unable to watch directory '(.*)\/newFolder' due to an unresolved bug in a prereq component./ );
						} );

					}

				} else {
					if ( name == "watching_files" ) {

						// we are using the deepest folder that we know. This must never watched as we skip the ones
						// with the deepest folder structure
						var deepestFolderOfThemAll = "/css/deeper/blue/deepestOfThemAll";

						// next phase
						watching = true;

						// this is the real test for watching

						// create files
						fs.writeFileSync( syncPoint + deepestFolderOfThemAll + "/empty.txt", "Something" );
						fs.writeFileSync( syncPoint + "/css/empty.txt", "Something" );

						// deleting directories doesn't work on Windows
						if ( process.platform != "win32" ) {

							// delete folder
							helper.deleteFolderRecursive( syncPoint + "/images", function() {
								setTimeout( function() {

									// create folder
									fs.mkdirSync( syncPoint + "/newFolder" );
								}, 1000 );
							} );
						} else {
							setTimeout( function() {

								// create folder
								fs.mkdirSync( syncPoint + "/newFolder" );
							}, 1000 );
						}
					}

				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} );

		it( "Should recognize watch limit for windows bug and honor forceWatch", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				//console.log( name, param );

				if ( name == "watching_files" ) {

					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Unable to watch the following directories due to an unresolved bug in a prereq component." );
						hook.captured().should.not.containEql( syncPoint + "/css/deeper/blue/deepestOfThemAll" );
					} );
				}

			} );
			var config = sync.loadConfig( syncPoint );
			config.forceWatch = [ "/css/deeper/blue/deepestOfThemAll" ];
			sync.saveConfig( syncPoint, config, function() {
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: false
				}, emitter );
			} );

		} );

	} );

} );
