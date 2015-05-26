/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	should = require( "should" ),
	mockstdin = require( "mock-stdin" ),
	helper = require( "./helper" ),
	server = require( "./server" ),
	sync = helper.getSyncModule(),
	syncUtils = require( "../lib/utils" );

describe( "sync-init", function() {

	describe( "init-noserver", function() {
		var hook, stdin, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			stdin = mockstdin.stdin();
			syncPoint = helper.createSyncPoint( done );
		} );
		afterEach( function( done ) {
			stdin.restore();
			hook.unhook();
			helper.cleanupSyncPoint( done );
		} );

		it( "Should fail when connecting to remote system", function( done ) {

			this.timeout( 5000 );

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - default
			stdin.send( "\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );
				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "Connection refused." );
					done();
				}, 3000 );
			}, 500 );

		} );

		it( "Should fail when connecting to remote system due to unknown host", function( done ) {

			// bigger timeout because the system tries to connect 3 times with a timeout of 500ms each
			this.timeout( 20000 );

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "999.999.999.999\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - default
			stdin.send( "\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );
				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "Cannot connect to host." );
					done();
				}, 15000 );
			}, 500 );

		} );
	} );

	describe( "init-with-authenticated-server", function() {
		var hook, stdin, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			stdin = mockstdin.stdin();
			syncPoint = helper.createSyncPoint( function() {
				server.startServerWithAuthentication( function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			stdin.restore();
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.cleanupSyncPoint( done );
			} )
		} );

		it( "Should fail due to authentication error", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );
				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "Unauthorized. Incorrect username or password." );
					done();
				}, 500 );
			}, 500 );

		} );
	} );

	describe( "init-with-empty-server", function() {
		var hook, stdin, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			stdin = mockstdin.stdin();
			syncPoint = helper.createSyncPoint( function() {
				server.startServer( function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			stdin.restore();
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.cleanupSyncPoint( done );
			} )
		} );

		it( "Should say no themes if none are available", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );
				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "Requested item not found." );
					done();
				}, 500 );
			}, 500 );

		} );
	} );

	describe( "init-with-server-nothemes", function() {
		var hook, stdin, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			stdin = mockstdin.stdin();
			syncPoint = helper.createSyncPoint( function() {
				server.startServerWithContent( "server-nothemes", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			stdin.restore();
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should say no themes if none are available", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );

				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "No themes found on the target server." );
					done();
				}, 500 );
			}, 500 );

		} );
	} );

	describe( "init-with-server-threethemes", function() {
		var hook, hookErr, stdin, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			hookErr = helper.captureStream( process.stderr );
			stdin = mockstdin.stdin();
			syncPoint = helper.createSyncPoint( function() {
				server.startServerWithContent( "server-threethemes", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			stdin.restore();
			server.closeServer( webDavServer, function() {
				hook.unhook();
				hookErr.unhook();
				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should list all themes", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );

				setTimeout( function() {
					hook.captured().should.containEql( "Connecting to the remote server..." );
					hook.captured().should.containEql( "Theme One" );
					hook.captured().should.containEql( "Theme Two" );
					hook.captured().should.containEql( "Theme Three" );
					done();
				}, 500 );
			}, 500 );

		} );

		it( "Should completely finish initialization", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );

				// need to give time to connect to the server
				setTimeout( function() {

					// first try an invalid selection
					stdin.send( "0\r" );

					var result = /(\d). Theme One/.exec( hook.captured() )[1];

					// Theme One
					stdin.send( result + "\r" );

					setTimeout( function() {
						hookErr.captured().should.containEql( "Invalid input for" );
						hook.captured().should.containEql( "Connecting to the remote server..." );
						hook.captured().should.containEql( "Successfully setup theme synchronization." );

						// now verify the file content of .settings
						var config = sync.loadConfig( syncPoint );
						should( config ).should.not.be.exactly( null );
						config.username.should.be.exactly( "wpsadmin" );
						config.password.should.be.exactly( "wpsadmin" );
						config.port.should.be.exactly( "10039" );
						config.contenthandlerPath.should.be.exactly( "/" );
						config.host.should.be.exactly( "127.0.0.1" );
						config.theme.should.be.exactly( "Theme One" );

						done();
					}, 500 );
				}, 500 );
			}, 500 );

		} )

		it( "Should fail due to invalid sync point", function( done ) {

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( syncPoint + "/notExists" );

			// hostname - local
			stdin.send( "127.0.0.1\r" );

			// username - default
			stdin.send( "\r" );

			// password - default
			stdin.send( "wpsadmin\r" );

			// contenthandler - /
			stdin.send( "/\r" );

			// secure - false
			stdin.send( "false\r" );

			setTimeout( function() {

				// port - default
				stdin.send( "\r" );

				// need to give time to connect to the server
				setTimeout( function() {

					var result = /(\d). Theme One/.exec( hook.captured() )[1];

					// Theme One
					stdin.send( result + "\r" );

					setTimeout( function() {
						hook.captured().should.containEql( "Aborting initialization." );
						hook.captured().should.containEql( syncPoint + "/notExists" );

						done();
					}, 500 );
				}, 500 );
			}, 500 );

		} );
	} );
} );
