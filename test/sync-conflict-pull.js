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

describe( "sync-conflicts-pull", function() {
	this.timeout( 10000 );

	describe( "sync-conflict-pull", function() {
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

		it( "Should recognize new conflicts [PULL]", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {
						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "File download complete: read me.txt" );
						hook.captured().should.containEql( "File download complete: profiles/profile_deferred.json" );
						hook.captured().should.containEql( "File download complete: contributions/schema/JSON Module Contribution Schema v1.8.json" );
						hook.captured().should.containEql( "File deletion complete: css/deeper/blue/blue.css.uncompressed.css" );
						hook.captured().should.containEql( "Synchronization complete." );

						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 3,
							deletedLocale: 1,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 19,
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

	} )

	describe( "sync-conflict-recognized-pull", function() {
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

		it( "Should recognize existing conflicts [PULL]", function( done ) {

			//sync.setLoggerConfig( null, { debug: true, finest: true }, null );

			var emitter = new events.EventEmitter();
			emitter.on( "status", function( name, param ) {

				//console.log( name, param );
				if ( name == "sync" && param == "complete" ) {

					// this indirection is need to call done in success and failure cases
					helper.asyncCheck( done, function() {

						hook.captured().should.containEql( "Downloading updated files..." );
						hook.captured().should.containEql( "File download complete: read me.txt" );
						hook.captured().should.containEql( "File download complete: profiles/profile_deferred.json" );
						hook.captured().should.containEql( "File download complete: contributions/schema/JSON Module Contribution Schema v1.8.json" );
						hook.captured().should.containEql( "File deletion complete: css/deeper/blue/blue.css.uncompressed.css" );
						hook.captured().should.containEql( "Synchronization complete." );

						helper.assertSyncReport( hook.captured(), {
							total: 23,
							uploaded: 0,
							downloaded: 3,
							deletedLocale: 1,
							deletedRemote: 0,
							conflicts: 0,
							conflictsResolved: 0,
							noaction: 19,
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

	} )

} )
