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

describe( "sync-conflicts", function() {
	this.timeout( 10000 );

	describe( "sync-conflict", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-conflict", function() {
				server.startServerWithContent( "server-sync-conflict", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should recognize new conflicts", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.containEql( "File download complete: read me.txt.conflict" );
						hook.captured().should.containEql( "File download complete: profiles/profile_deferred.json.conflict" );
						hook.captured().should.containEql( "File download complete: contributions/schema/JSON Module Contribution Schema v1.8.json.conflict" );
						hook.captured().should.containEql( "File download complete: css/deeper/blue/blue.css.uncompressed.css.conflict" );
						hook.captured().should.containEql( "The file was updated locally and on the remote server." );
						hook.captured().should.containEql( "The file was deleted locally and updated on the remote server. Unable to determine whether to download the updated remote file or delete it." );
						hook.captured().should.containEql( "The file was deleted remotely and updated locally. Unable to determine whether to upload the updated file or delete it." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 4,
							conflictsResolved: 0,
							noaction: 19,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

	} );

	describe( "sync-conflict-recognized", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-conflict-recognized", function() {
				server.startServerWithContent( "server-sync-conflict-recognized", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should recognize existing conflicts", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {

						//jscs:disable
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/read me\.txt/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/profiles\/profile_deferred\.json/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/contributions\/schema\/JSON Module Contribution Schema v1\.8\.json/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/css\/deeper\/blue\/blue\.css\.uncompressed\.css/ );
						hook.captured().should.containEql( "This can be achieved by renaming 'contributions/schema/JSON Module Contribution Schema v1.8.json' to 'contributions/schema/JSON Module Contribution Schema v1.8.json.delete'." );
						hook.captured().should.containEql( "This can be achieved by renaming 'css/deeper/blue/blue.css.uncompressed.css' to 'css/deeper/blue/blue.css.uncompressed.css.delete'." );
						hook.captured().should.containEql( "Synchronization complete." );

						//jscs:enable
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 4,
							conflictsResolved: 0,
							noaction: 19,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

	} );

	describe( "sync-conflict-recognized-ghostfile", function() {
		var hook, webDavServer, syncPoint, emitter;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			emitter = new events.EventEmitter();
			syncPoint = helper.createSyncPointWithContent( "local-sync-conflict-recognized-ghostfile", function() {
				server.startServerWithContent( "server-sync-conflict-recognized", function( s ) {
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

		// a ghost file is a file that doesn't exists anymore but there is a conflict file for it
		// in this case the readDirSyncFilter function injects this ghost file into the return
		// array and the calling code has to be ablt to handle it
		it( "Should recognize existing conflicts even though there is a ghostfile", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {

						//jscs:disable
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/read me\.txt/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/profiles\/profile_deferred\.json/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/contributions\/schema\/JSON Module Contribution Schema v1\.8\.json/ );
						hook.captured().should.match( /Outstanding merge conflict for (.*)\/css\/deeper\/blue\/blue\.css\.uncompressed\.css/ );
						hook.captured().should.containEql( "This can be achieved by renaming 'contributions/schema/JSON Module Contribution Schema v1.8.json' to 'contributions/schema/JSON Module Contribution Schema v1.8.json.delete'." );
						hook.captured().should.containEql( "This can be achieved by renaming 'css/deeper/blue/blue.css.uncompressed.css' to 'css/deeper/blue/blue.css.uncompressed.css.delete'." );
						hook.captured().should.containEql( "Synchronization complete." );

						//jscs:enable
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 4,
							conflictsResolved: 0,
							noaction: 19,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				autoWatch: true,
				backgroundSync: false
			}, emitter );

		} )

	} );

	[ {
		mode: "full"
	}, {
		mode: "push"
	}, {
		mode: "pull"
	} ].forEach( function( data ) {
		describe( "sync-conflict-resolve", function() {
			var hook, webDavServer, syncPoint, emitter;
			beforeEach( function( done ) {
				hook = helper.captureStream( process.stdout );
				emitter = new events.EventEmitter();
				syncPoint = helper.createSyncPointWithContent( "local-sync-conflict-resolve", function() {
					server.startServerWithContent( "server-sync-conflict-resolve", function( s ) {
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

			// in this testcase the file system already contains the resolutions to file conflicts
			// in this case the system will resolve the conflicts as requested regardless of push/pull and the answer
			// is the same regardless of the mode
			it( "Should resolve existing conflicts #1 [" + data.mode + "]", function( done ) {

				//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

				emitter.on( "status", function( name, param ) {

					//console.log( name, param );
					if ( name == "sync" && param == "complete" ) {

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( done, function() {
							hook.captured().should.containEql( "File upload complete: read me.txt" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/read me\.txt/ );
							hook.captured().should.containEql( "File upload complete: profiles/profile_deferred.json" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/profiles\/profile_deferred\.json/ );
							hook.captured().should.containEql( "File deletion complete: contributions/schema/JSON Module Contribution Schema v1.8.json" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/contributions\/schema\/JSON Module Contribution Schema v1\.8\.json/ );
							hook.captured().should.containEql( "File deletion complete: css/deeper/blue/blue.css.uncompressed.css" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/css\/deeper\/blue\/blue\.css\.uncompressed\.css/ );
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23,
								uploaded: 0,
								downloaded: 0,
								deletedLocale: 0,
								deletedRemote: 0,
								conflicts: 0,
								conflictsResolved: 4,
								noaction: 19,
								errors: 0
							} );
						} );
					}

				} );

				// we run this with watcher just so we improve the coverage
				sync.runSync( syncPoint, {
					mode: data.mode,
					autoWatch: true,
					backgroundSync: false
				}, emitter );

			} )

		} )

	} );

	[ {
		mode: "full"
	}, {
		mode: "push"
	}, {
		mode: "pull"
	} ].forEach( function( data ) {
		describe( "sync-conflict-resolve2", function() {
			var hook, webDavServer, syncPoint;
			beforeEach( function( done ) {
				hook = helper.captureStream( process.stdout );
				syncPoint = helper.createSyncPointWithContent( "local-sync-conflict-resolve2", function() {
					server.startServerWithContent( "server-sync-conflict-resolve2", function( s ) {
						webDavServer = s;
						done();
					} );
				} );
			} );
			afterEach( function( done ) {
				server.closeServer( webDavServer, function() {
					hook.unhook();
					helper.cleanupSyncPoint( done );
				} );
			} );

			it( "Should resolve existing conflicts #2 [" + data.mode + "]", function( done ) {

				//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

				var emitter = new events.EventEmitter();
				emitter.on( "status", function( name, param ) {

					//console.log( name, param );
					if ( name == "sync" && param == "complete" ) {

						// this indirection is need to call done in success and failure cases
						helper.asyncCheck( done, function() {
							hook.captured().should.containEql( "File upload complete: read me.txt" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/read me\.txt/ );
							hook.captured().should.containEql( "File upload complete: profiles/profile_deferred.json" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/profiles\/profile_deferred\.json/ );
							hook.captured().should.containEql( "File upload complete: contributions/schema/JSON Module Contribution Schema v1.8.json" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/contributions\/schema\/JSON Module Contribution Schema v1\.8\.json/ );
							hook.captured().should.containEql( "File upload complete: css/deeper/blue/blue.css.uncompressed.css" );
							hook.captured().should.match( /Merge conflict resolved for (.*)\/css\/deeper\/blue\/blue\.css\.uncompressed\.css/ );
							hook.captured().should.containEql( "Synchronization complete." );
							helper.assertSyncReport( hook.captured(), {
								total: 23,
								uploaded: 0,
								downloaded: 0,
								deletedLocale: 0,
								deletedRemote: 0,
								conflicts: 0,
								conflictsResolved: 4,
								noaction: 19,
								errors: 0
							} );
						} );
					}

				} );
				sync.runSync( syncPoint, {
					mode: data.mode,
					autoWatch: false,
					backgroundSync: false
				}, emitter );

			} )

		} );
	} );

} )
