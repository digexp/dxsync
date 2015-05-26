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

describe( "sync-regular", function() {
	this.timeout( 10000 );

	describe( "sync-dl-up", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-dl-up", function() {
				server.startServerWithContent( "server-sync-dl-up", function( s ) {
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

		it( "Should download and upload without hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 9,
							downloaded: 10,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 4,
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

		it( "Should download only without hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 10,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 13,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "pull",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

		it( "Should upload only without hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Uploading updated files..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 9,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 14,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "push",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

	} )

	describe( "sync-dl-up-hash", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-dl-up-hash", function() {
				server.startServerWithContent( "server-sync-dl-up-hash", function( s ) {
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

		it( "Should download and upload based on hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 3,
							downloaded: 2,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 18,
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

		it( "Should download only based on hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 2,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 21,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "pull",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

		it( "Should upload only based on hash", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Uploading updated files..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 3,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 20,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "push",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

	} )

	describe( "sync-del", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-del", function() {
				server.startServerWithContent( "server-sync-del", function( s ) {
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

		it( "Should delete local and remote", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 18,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 2,
							deletedRemote: 4,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 12,
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

		it( "Should delete locally only", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "Skipping deleting remote file" );
						hook.captured().should.containEql( "File deletion complete" );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 18,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 2,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 16,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "pull",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

		it( "Should delete remotely only", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Uploading updated files..." );
						hook.captured().should.containEql( "File deletion complete" );
						hook.captured().should.containEql( "Directory deletion complete" );
						hook.captured().should.containEql( "Skipping deleting of file" );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 18,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 4,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 14,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "push",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

	} )

	describe( "sync-del-2", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );

			// SETUP
			// contributions folder was deleted locally
			// profiles folder was deleted remotely
			syncPoint = helper.createSyncPointWithContent( "local-sync-del-2", function() {
				server.startServerWithContent( "server-sync-del-2", function( s ) {
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

		it( "Should delete local and remote directories", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Started 2-way synchronization..." );
						hook.captured().should.containEql( "Directory deletion complete: contributions/schema" );
						hook.captured().should.containEql( "Directory deletion complete: contributions" );
						hook.captured().should.containEql( "Directory deletion complete: profiles" );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 14,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 5,
							deletedRemote: 5,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 4,
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
/*
		it( "Should delete directories locally only", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "Skipping deleting remote file" );
						hook.captured().should.containEql( "File deletion complete" );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 18,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 2,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 16,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "pull",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )

		it( "Should delete directories remotely only", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Uploading updated files..." );
						hook.captured().should.containEql( "File deletion complete" );
						hook.captured().should.containEql( "Directory deletion complete" );
						hook.captured().should.containEql( "Skipping deleting of file" );
						hook.captured().should.containEql( "Synchronization complete." );
						helper.assertSyncReport( hook.captured(), {
							total: 18,
							uploaded: 0,
							downloaded: 0,
							deletedLocale: 0,
							deletedRemote: 4,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 14,
							errors: 0
						} );
					} );
				}

			} );
			sync.runSync( syncPoint, {
				mode: "push",
				autoWatch: false,
				backgroundSync: false
			}, emitter );

		} )
*/
	} )

} )
