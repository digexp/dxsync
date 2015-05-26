/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	should = require( "should" ),
	rewire = require( "rewire" ),
	helper = require( "./helper" ),
	server = require( "./server" ),
	syncWebdav = rewire( "../lib/webdav" );

describe( "sync-webdav", function() {

	describe( "basic", function() {
		var syncPoint;
		beforeEach( function( done ) {
			syncPoint = helper.createSyncPoint( done );
		} );
		afterEach( function( done ) {
			helper.cleanupSyncPoint( done );
		} );

		it( "Should recognize a collection", function( ) {

			var isCollection = syncWebdav.__get__( "isCollection" ),
				webdavObject = {
					"propstat": [ {
						"prop": {
							"resourcetype": {
								"collection": false
							}
						}
					}, {
						"prop": {
							"resourcetype": {
								"collection": true
							}
						}
					} ]
				};

			isCollection( webdavObject ).should.be.true;

			var	webdavObject = {
					"propstat": [ {
						"prop": {
							"resourcetype": {
							}
						}
					} ]
				};

			isCollection( webdavObject ).should.be.false;
		} );

		it( "Should recognize last modified", function( ) {

			var getLastModified = syncWebdav.__get__( "getLastModified" ),
				date = new Date(),
				webdavObject = {
					"propstat": [ {
						"prop": {
							"getlastmodified": date.toISOString()
						}
					} ]
				};
			getLastModified( webdavObject ).should.be.exactly( date.getTime() );

			var webdavObject = {
				"propstat": {
					"prop": {
						"getlastmodified": date.toISOString()
					}
				}
			};
			getLastModified( webdavObject ).should.be.exactly( date.getTime() );

			var webdavObject = {
				"propstat": [ {
					"prop": {}
				} ]
			};
			getLastModified( webdavObject ).should.be.exactly( "" );

			var webdavObject = {
				"propstat": {
					"prop": {}
				}
			};
			getLastModified( webdavObject ).should.be.exactly( "" );

		} );

	} );

	describe( "webdav-connection", function() {
		var hook, webDavServer, serverDir, syncPoint,
			config = {
				"username": "",
				"password": "",
				"urlPath": "/dav/fs-type1",
				"baseUrl": "http://127.0.0.1:10039/dav/fs-type1",
				"basePath": "/themes/Theme One"
			};
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-watch", function() {
				serverDir = server.startServerWithContent( "server-sync-watch", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.resetLogger( function() {
					helper.cleanupSyncPoint( done );
				} );
			} );
		} );

		it( "Should fail due to incorrect config", function( done ) {
			try {
				var config = {
					"username": "",
					"password": "",
					"urlPath": "/dav/fs-type1",
					"baseUrl": "whatever",
					"basePath": "/themes/Theme One"
				};
				syncWebdav.createConnection( config );
			}
			catch ( e ) {
				( e + "" ).should.containEql( "Invalid URL" );
				done();
			}
		} );

		it( "Should recognize that file exists", function( done ) {
			var connection = syncWebdav.createConnection( config );
			connection.exists( "/theme.html" ).then( function( data ) {
				data.exists.should.be.true;
				done();
			} );

		} );

		it( "Should try to read a no existing file", function( done ) {
			var connection = syncWebdav.createConnection( config );
			connection.list().then( function( files ) {
				for ( var i = 0; i < files.length; i++ ) {
					var file = files[i];
					if ( file.name == "theme.html" ) {

						// Remove Server Content to run through the not found path
						helper.deleteFolderRecursive( serverDir, function() {
							file.read( 404 ).then( function( data ) {
								should( data ).be.null;
								done();
							} );
						} );
					}
				};
			} );

		} );

	} );

} );
