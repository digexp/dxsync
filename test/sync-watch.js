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

describe( "sync-watch", function() {
	this.timeout( 10000 );

	[ {
		trace: false,
		backgroundSync: false
	}, {
		trace: true,
		backgroundSync: true
	} ].forEach( function( data ) {
		describe( "sync-watch", function() {
			var hook, webDavServer, serverDir, syncPoint, tempDir, emitter;
			beforeEach( function( done ) {
				hook = helper.captureStream( process.stdout );
				emitter = new events.EventEmitter();
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
					helper.requestCancel( emitter, function() {
						helper.cleanupSyncPoint( function() {
							helper.cleanupTempDir( function() {
								helper.resetLogger( function() {
									done();
								} );
							} );
						} );
					} );
				} );
			} );

			it( "Should recognize updated/deleted/rename/new file due to watching [Trace: " + data.trace + "]", function( done ) {
				var watching = false,
					stop = false,
					count = {
						"upload": 0,
						"rename": 0,
						"delete": 0
					},
					expected = {};

				if ( data.trace ) {
					sync.setLoggerConfig( null, { debug: true, finest: true }, null );
				}

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						//console.log( name, param );
						if ( ( name == "upload" || name == "delete" || name == "rename" ) && param == "complete" ) {
							count[name]++;
						}

						// test case can only be complete after the last file was processed
						if ( count.upload == expected.upload &&
							 count.rename == expected.rename &&
							 count.delete == expected.delete && !stop ) {

							// must not be called twice
							stop = true;

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "File upload complete: read me.txt" );
								hook.captured().should.containEql( "File upload complete: profiles/profile_deferred.json" );
								hook.captured().should.containEql( "File deletion complete: theme.html" );
								hook.captured().should.containEql( "File deletion complete: css/deeper/default.css" );
								if ( process.platform == "darwin" ) {
									hook.captured().should.containEql( "Move complete: Plain.html => css/Plain.html" );
									hook.captured().should.containEql( "Move complete: profiles/profile_dojo_deferred.json => profile_dojo_deferred.json" );
								} else {
									hook.captured().should.containEql( "File upload complete: css/Plain.html" );
									hook.captured().should.containEql( "File deletion complete: Plain.html" );
									hook.captured().should.containEql( "File upload complete: profile_dojo_deferred.json" );
									hook.captured().should.containEql( "File deletion complete: profiles/profile_dojo_deferred.json" );
								}
								if ( process.platform == "linux" ) {
									hook.captured().should.containEql( "File upload complete: images/favicon2.ico" );
									hook.captured().should.containEql( "File deletion complete: images/favicon.ico" );
									hook.captured().should.containEql( "File upload complete: contributions/schema/JSON Module Contribution Schema v1.9.json" );
									hook.captured().should.containEql( "File deletion complete: contributions/schema/JSON Module Contribution Schema v1.8.json" );
								} else {
									hook.captured().should.containEql( "Rename complete: images/favicon.ico => images/favicon2.ico" );
									hook.captured().should.containEql( "Rename complete: contributions/schema/JSON Module Contribution Schema v1.8.json => contributions/schema/JSON Module Contribution Schema v1.9.json" );
								}

								//hook.captured().should.containEql( "File upload complete: newfile.txt" );
								hook.captured().should.containEql( "File upload complete: css/hello.css" );

							} );

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
					backgroundSync: data.backgroundSync
				}, emitter );

			} );

			it( "Should recognize errors due to watching [Trace: " + data.trace + "]", function( done ) {
				var watching = false,
					stop = false;

				if ( data.trace ) {
					sync.setLoggerConfig( null, { debug: true, finest: true }, null );
				}

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						// test case can only be complete after the last file was processed
						if ( name == "idle" && !stop ) {

							// must not be called twice
							stop = true;
							setTimeout( function() {

								// this indirection is need to call done in success and failure cases
								helper.asyncCheck( function( e ) {
									fs.renameSync( tempDir + "/server", serverDir );
									done( e );
								}, function() {
									hook.captured().should.containEql( "<error> sync.js:" );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/css/hello.css\"," );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/preview.png\"," );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/js\"," );

								} );

							}, 1000 );

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

								// Remove Server Content which causes plenty of errors
								// However, on Windows we can't have any open file handles and therefore we have to wait 1 sec to continue
								setTimeout( function() {
									fs.renameSync( serverDir, tempDir + "/server" );

									// create files
									fs.writeFileSync( syncPoint + "/css/hello.css", "Test2" );

									// create through rename
									helper.renameSyncNoExec( tempDir + "/preview.png", syncPoint + "/preview.png" );

									// move files
									helper.renameSyncNoExec( syncPoint + "/Plain.html", syncPoint + "/css/Plain.html" );
									helper.renameSyncNoExec( syncPoint + "/profiles/profile_dojo_deferred.json", syncPoint + "/profile_dojo_deferred.json" );

									// rename files
									helper.renameSyncNoExec( syncPoint + "/images/favicon.ico", syncPoint + "/images/favicon2.ico" );
									helper.renameSyncNoExec( syncPoint + "/contributions/schema/JSON Module Contribution Schema v1.8.json", syncPoint + "/contributions/schema/JSON Module Contribution Schema v1.9.json" );

									// create dir
									helper.renameSyncNoExec( tempDir + "/js", syncPoint + "/js" );

									// move dir
									helper.renameSyncNoExec( syncPoint + "/contributions", syncPoint + "/images/contributions" );

									// rename dir
									helper.renameSyncNoExec( syncPoint + "/images/taggingAndRating", syncPoint + "/images/taggingAndRating_new" );
								}, 1000 );
							}

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: data.backgroundSync
				}, emitter );

			} )

			it( "Should recognize errors due to watching (authentication) [Trace: " + data.trace + "]", function( done ) {
				var watching = false,
					stop = false;

				if ( data.trace ) {
					sync.setLoggerConfig( null, { debug: true, finest: true }, null );
				}

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						//console.log( name, param, uploadCount, renameCount, deleteCount, filesyncCount );

						// test case can only be complete after the last file was processed
						if ( name == "idle" && !stop ) {

							// must not be called twice
							stop = true;
							setTimeout( function() {

								// this indirection is need to call done in success and failure cases
								helper.asyncCheck( function( e ) {
									done( e );
								}, function() {
									hook.captured().should.containEql( "<error> sync.js:" );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/profiles/schema/JSON%20Profile%20schema%20v1.2.json\"," );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/profiles/schema/readme.txt\"," );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/read%20me.txt\"," );
									hook.captured().should.containEql( "{\"url\":\"http://127.0.0.1:10039/dav/fs-type1/themes/Theme%20One/profiles/schema\"," );
								} );

							}, 1000 );

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

								// Change Server to be one which rejects anything with 401
								server.closeServer( webDavServer, function() {
									server.startServerWithAuthenticationKeepFolder( function( s ) {
										webDavServer = s;

										// delete files
										helper.deleteFolderRecursive( syncPoint + "/profiles/schema", function() {

											// update files
											helper.updateFile( syncPoint + "/read me.txt", "LOCAL UPDATE\n" );
										} );

									} );

								} );

							}

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: data.backgroundSync
				}, emitter );

			} )

			it( "Should recognize deleted/rename/new dir due to watching [Trace: " + data.trace + "]", function( done ) {
				var watching = false,
					stop = false;

				if ( data.trace ) {
					sync.setLoggerConfig( null, { debug: true, finest: true }, null );
				}

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						// test case can only be complete after the last file was processed
						if ( name == "idle" && !stop ) {

							// must not be called twice
							stop = true;

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "Directory creation complete: js" );
								hook.captured().should.containEql( "Uploading file: js/head.jsx" );
								hook.captured().should.containEql( "Uploading file: js/highContrast.jsx" );
								hook.captured().should.containEql( "Uploading file: js/mobilenav.jsx" );
								hook.captured().should.containEql( "Uploading file: js/skinRegion.jsx" );
								hook.captured().should.containEql( "File upload complete: js/head.jsx" );
								hook.captured().should.containEql( "File upload complete: js/highContrast.jsx" );
								hook.captured().should.containEql( "File upload complete: js/mobilenav.jsx" );
								hook.captured().should.containEql( "File upload complete: js/skinRegion.jsx" );
								hook.captured().should.containEql( "Directory creation complete: js/deep" );
								hook.captured().should.containEql( "Uploading file: js/deep/head.jsx" );
								if ( process.platform != "win32" ) {
									if ( process.platform == "linux" ) {
										hook.captured().should.containEql( "Directory creation complete: images/contributions" );
										hook.captured().should.containEql( "Directory creation complete: images/contributions/schema" );
										hook.captured().should.containEql( "File upload complete: images/contributions/theme.json" );
										hook.captured().should.containEql( "File upload complete: images/contributions/theme_edit.json" );
										hook.captured().should.containEql( "File upload complete: images/contributions/readme.txt" );
										hook.captured().should.containEql( "File upload complete: images/contributions/schema/JSON Module Contribution Schema v1.8.json" );
										hook.captured().should.containEql( "File upload complete: images/contributions/schema/readme.txt" );
										hook.captured().should.containEql( "Directory deletion complete: contributions" );

										hook.captured().should.containEql( "Directory creation complete: images/taggingAndRating_new" );
										hook.captured().should.containEql( "File upload complete: images/taggingAndRating_new/iconRated.gif" );
										hook.captured().should.containEql( "File upload complete: images/taggingAndRating_new/iconTag.gif" );
										hook.captured().should.containEql( "Directory deletion complete: images/taggingAndRating" );
									} else {
										hook.captured().should.containEql( "Move complete: contributions => images/contributions" );
										hook.captured().should.containEql( "Rename complete: images/taggingAndRating => images/taggingAndRating_new" );
									}
									hook.captured().should.containEql( "File deletion complete: profiles/profile_deferred.json" );
									hook.captured().should.containEql( "File deletion complete: profiles/profile_dojo_basic_content.json" );
									hook.captured().should.containEql( "File deletion complete: profiles/profile_dojo_deferred.json" );
									hook.captured().should.containEql( "File deletion complete: profiles/profile_dojo_lightweight.json" );

									// sometimes the operating system deletes the files so quickly that we don't get all watch events
									// this is ok though as long as we get DIrectory deletion complete: profiles
									//hook.captured().should.containEql( "File deletion complete: profiles/schema/JSON Profile schema v1.2.json" );
									//hook.captured().should.containEql( "File deletion complete: profiles/schema/readme.txt" );
									hook.captured().should.containEql( "File deletion complete: profiles/readme.txt" );
									hook.captured().should.containEql( "Directory deletion complete: profiles" );
									hook.captured().should.containEql( "Directory deletion complete: css" );
								} else {
									hook.captured().should.containEql( "Directory creation complete: images/taggingAndRating_new" );
									hook.captured().should.containEql( "Uploading file: images/taggingAndRating_new/iconRated.gif" );
									hook.captured().should.containEql( "Uploading file: images/taggingAndRating_new/iconTag.gif" );
									hook.captured().should.containEql( "Directory deletion complete: images/taggingAndRating" );
									hook.captured().should.containEql( "Directory creation complete: js/deep" );
									hook.captured().should.containEql( "File upload complete: images/taggingAndRating_new/iconRated.gif" );
									hook.captured().should.containEql( "File upload complete: images/taggingAndRating_new/iconTag.gif" );
								}
							} );

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

								// create dir
								helper.renameSyncNoExec( tempDir + "/js", syncPoint + "/js" );

								if ( process.platform != "win32" ) {

									// delete dir through rename
									helper.renameSyncNoExec( syncPoint + "/css", tempDir + "/css" );

									// move dir
									helper.renameSyncNoExec( syncPoint + "/contributions", syncPoint + "/images/contributions" );

									// delete dir
									helper.deleteFolderRecursive( syncPoint + "/profiles", function() {
									} );

									// rename dir
									helper.renameSyncNoExec( syncPoint + "/images/taggingAndRating", syncPoint + "/images/taggingAndRating_new" );

								} else {

									// rename dir
									helper.renameSyncNoExec( syncPoint + "/images/taggingAndRating", syncPoint + "/images/taggingAndRating_new" );
								}

							}

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: data.backgroundSync
				}, emitter );

			} )

			it( "Should upload empty file [Trace: " + data.trace + "]", function( done ) {
				var watching = false,
					stop = false,
					uploadCount = 0;

				if ( data.trace ) {
					sync.setLoggerConfig( null, { debug: true, finest: true }, null );
				}

				emitter.on( "status", function( name, param ) {

					if ( watching ) {

						if ( name == "upload" && param == "complete" ) {
							uploadCount++;
						}

						console.log( name, param, uploadCount );

						// test case can only be complete after the last file was processed
						if ( uploadCount == 1 && !stop ) {

							// must not be called twice
							stop = true;

							// this indirection is need to call done in success and failure cases
							helper.asyncCheck( done, function() {
								hook.captured().should.containEql( "File upload complete: empty.txt" );
							} );

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

								// create empty file
								fs.writeFileSync( syncPoint + "/empty.txt", "" );

							}

						}

					}

				} );
				sync.runSync( syncPoint, {
					autoWatch: true,
					backgroundSync: data.backgroundSync
				}, emitter );

			} )

		} )

	} )

} )
