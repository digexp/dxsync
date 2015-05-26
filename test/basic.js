/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	util = require( "util" ),
	should = require( "should" ),
	rewire = require ( "rewire" ),
	helper = require( "./helper" ),
	sync = helper.getSyncModule(),
	syncUtils = require( "../lib/utils" );

var LOG_FILE = syncUtils.getUserHome() + "/dxsync.log";

describe( "sync-basics", function() {

	describe( "logger-config-and-redirect", function() {
		var hook, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPoint( done );
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.resetLogger( function() {
				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should be debug, special log dir and additional redirect", function( done ) {
			sync.setLoggerConfig( syncPoint, { debug: true }, function( method, str ) {

				// this log will be catched in the hook
				console.log( "REDIRECTED", method, str );
			} );

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( "." );
			syncUtils.getLogger().error( "Test Error", new Error() );
			hook.captured().should.containEql( "REDIRECTED" );
			hook.captured().should.containEql( "IBM Digital Experience File Sync" );
			hook.captured().should.containEql( "<info> main.js:" );
			hook.captured().should.containEql( "Test Error" );
			hook.captured().should.containEql( "basic.js" );
			syncUtils.isDebug().should.be.true;
			syncUtils.isDebugFinest().should.be.false;
			fs.existsSync( syncPoint + "/dxsync.log" ).should.be.true;

			done();
		} )

		it( "Should be none-debug, special log dir and additional redirect", function( done ) {
			sync.setLoggerConfig( syncPoint, { debug: false }, function( method, str ) {

				// this log will be catched in the hook
				console.log( "REDIRECTED", method, str );
			} );

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( "." );
			hook.captured().should.containEql( "REDIRECTED" );
			hook.captured().should.containEql( "IBM Digital Experience File Sync" );
			syncUtils.isDebug().should.be.false;
			syncUtils.isDebugFinest().should.be.false;
			fs.existsSync( syncPoint + "/dxsync.log" ).should.be.false;

			done();
		} )

		it( "Should be redirected", function( done ) {
			sync.redirectConsole( function( method, str ) {

				// this log will be catched in the hook
				console.log( "REDIRECTED", method, str );
			} );

			process.argv = [ "dir", "shell", "init" ];
			sync.runCLI( "." );
			hook.captured().should.containEql( "REDIRECTED" );
			syncUtils.isDebug().should.be.false;
			syncUtils.isDebugFinest().should.be.false;
			fs.existsSync( syncPoint + "/dxsync.log" ).should.be.false;

			done();
		} )

	} )

	describe( "options", function() {
		var hook;
		beforeEach( function() {
			hook = helper.captureStream( process.stdout );
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.resetLogger( done );
		} );

		it( "Should fail due to invalid options", function( done ) {
			var oldExit = process.exit;
			process.exit = function( code ) {
				hook.captured().should.containEql( "Too many commands: invalid" );
				done();
			}
			process.argv = [ "dir", "shell", "invalid", "invalid" ];
			sync.runCLI( "." );
			process.exit = oldExit;
		} )

		it( "Should fail due to invalid --option", function( done ) {
			var oldExit = process.exit;
			process.exit = function( code ) {
				hook.captured().should.containEql( "Unrecognized option: --invalid" );
				done();
			}
			process.argv = [ "dir", "shell",  "--invalid" ];
			sync.runCLI( "." );
			process.exit = oldExit;
		} )

		it( "Should print help due to unknown option", function() {
			process.argv = [ "dir", "shell", "invalid" ];
			sync.runCLI( "." );
			hook.captured().should.containEql( "IBM Digital Experience File Sync" );
			hook.captured().should.containEql( "dxsync.sh <options> <command>" );
			hook.captured().should.containEql( "The log file will be written to" );
		} )

		it( "Should recognize debug", function() {
			process.argv = [ "dir", "shell", "--debug" ];
			sync.runCLI( "." );
			hook.captured().should.containEql( "<info> main.js:" );
			syncUtils.isDebug().should.be.true;
			syncUtils.isDebugFinest().should.be.false;
		} )

		it( "Should recognize debug finest", function() {
			process.argv = [ "dir", "shell", "--debug-finest" ];
			sync.runCLI( "." );
			hook.captured().should.containEql( "<info> main.js:" );
			syncUtils.isDebug().should.be.true;
			syncUtils.isDebugFinest().should.be.true;
		} )

		it( "Validate log file exists", function() {
			if ( fs.existsSync( LOG_FILE ) ) {
				fs.unlinkSync( LOG_FILE );
			}
			process.argv = [ "dir", "shell", "--debug" ];
			sync.runCLI( "." );
			fs.existsSync( LOG_FILE ).should.be.true;
			fs.unlinkSync( LOG_FILE );
		} )

		it( "Validate log file does not exists", function() {
			if ( fs.existsSync( LOG_FILE ) ) {
				fs.unlinkSync( LOG_FILE );
			}
			process.argv = [ "dir", "shell", "whatever" ];
			sync.runCLI( "." );
			fs.existsSync( LOG_FILE ).should.be.false;
		} )

	} )

	describe( "error-cases", function() {
		var hook, syncPoint;
		beforeEach( function() {
			hook = helper.captureStream( process.stdout );
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.resetLogger( done );
		} );

		it( "Should display uncaught exception", function( done ) {
			var fn = helper.getUncaughtExceptionHandlingFunction();
			var oldExit = process.exit;
			process.exit = function( code ) {
				process.exit = oldExit;
				hook.captured().should.containEql( "Uncaught Exception" );
				hook.captured().should.containEql( "test error" );
				done();
			}
			fn( "test error" );
			process.exit = oldExit;
		} )

		it( "Should display interrupt handling", function( done ) {
			var fn = helper.getInterruptHandlingFunction();
			var oldExit = process.exit;
			process.exit = function( code ) {
				process.exit = oldExit;
				hook.captured().should.containEql( "Interrupting process. Good bye." );
				done();
			}
			fn( );
			process.exit = oldExit;
		} )

		it( "Should fail command line and display error", function( done ) {
			syncPoint = helper.createSyncPoint( function() {
				var backup = sync.__get__( "parseCommandlineArguments" );
				sync.__set__( "parseCommandlineArguments", function() {
					throw new Error( "test error" );
				} );

				process.argv = [ "dir", "shell", "init" ];
				sync.runCLI( syncPoint );

				sync.__set__( "parseCommandlineArguments", backup );

				helper.cleanupSyncPoint( function() {
					hook.captured().should.containEql( "test error" );
					done();
				} );

			} );

		} )

		it( "Should fail to read config", function( done ) {
			syncPoint = helper.createSyncPoint( function() {
				process.argv = [ "dir", "shell", "run" ];
				sync.runCLI( syncPoint );

				helper.cleanupSyncPoint( function() {
					hook.captured().should.containEql( "Unable to load dxsync settings in this directory." );
					done();
				} );

			} );

		} )

		it( "Simply execute notification without verifying it", function( done ) {
			sync.notify( "testTitle", "testMessage" );
			done();
		} )

	} )

	describe( "config", function() {
		var hook, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			done();
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.resetLogger( done );
		} );

		it( "Should load the config successfully", function( done ) {
			syncPoint = helper.createSyncPointWithContent( "local-configonly", function() {
				var config = sync.loadConfig( syncPoint );

				should( config ).not.null;
				config.username.should.be.exactly( "whatever" );
				config.password.should.be.exactly( "wpsadmin" );
				config.port.should.be.exactly( "500" );
				config.contenthandlerPath.should.be.exactly( "/wps/special/contenthandler" );
				config.host.should.be.exactly( "somewhere.on.the.globe" );
				config.theme.should.be.exactly( "Test Theme" );

				helper.cleanupSyncPoint( function() {
					done();
				} );

			} );

		} )

		it( "Should return empty config", function( done ) {
			syncPoint = helper.createSyncPointWithContent( "local-noconfig", function() {
				var config = sync.loadConfig( syncPoint );

				should( config ).not.be.exactly( {} );

				helper.cleanupSyncPoint( function() {
					done();
				} );

			} );

		} )

		it( "Should write the config successfully", function( done ) {

			syncPoint = helper.createSyncPointWithContent( "local-noconfig", function() {
				var config = {
				    "username": "whatever",
				    "password": "whereever",
				    "port": "500",
				    "contenthandlerPath": "/wps/special/contenthandler",
				    "host": "somewhere.on.the.globe",
				    "theme": "Test Theme"
				};
				sync.saveConfig( syncPoint, config, function() {
					var config = sync.loadConfig( syncPoint );

					should( config ).not.null;
					config.username.should.be.exactly( "whatever" );
					config.password.should.be.exactly( "whereever" );
					config.port.should.be.exactly( "500" );
					config.contenthandlerPath.should.be.exactly( "/wps/special/contenthandler" );
					config.host.should.be.exactly( "somewhere.on.the.globe" );
					config.theme.should.be.exactly( "Test Theme" );

					// save it a second time
					sync.saveConfig( syncPoint, config, function() {
						var config = sync.loadConfig( syncPoint );

						should( config ).not.null;
						config.username.should.be.exactly( "whatever" );
						config.password.should.be.exactly( "whereever" );
						config.port.should.be.exactly( "500" );
						config.contenthandlerPath.should.be.exactly( "/wps/special/contenthandler" );
						config.host.should.be.exactly( "somewhere.on.the.globe" );
						config.theme.should.be.exactly( "Test Theme" );

						helper.cleanupSyncPoint( function() {
							done();
						} );

					} );

				} );

			} );

		} )

		it( "Should fail while writing the config", function( done ) {

			syncPoint = helper.createSyncPointWithContent( "local-noconfig", function() {
				sync.saveConfig( syncPoint + "/notexisting", {}, function( err ) {
					console.log( util.inspect( err, { showHidden: true, depth: null } ) );
					err.should.have.property( "stack" );

					helper.cleanupSyncPoint( function() {
						done();
					} );

				} );

			} );

		} )

	} )

	describe( "utils", function() {
		var hook, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			done();
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.resetLogger( done );
		} );

		it( "Should create multiple level of directories", function( done ) {

			syncPoint = helper.createSyncPointWithContent( "local-noconfig", function() {
				syncPoint += "/very/deep/folder";

				syncUtils.mkdirRecursive( syncPoint );

				var config = {
				    "test": "value",
				    "password": "password"
				};
				syncUtils.writeConfig( syncPoint, config, function() {
					var config = syncUtils.readConfig( syncPoint );

					should( config ).not.null;
					config.test.should.be.exactly( "value" );

					helper.cleanupSyncPoint( function() {
						done();
					} );

				} );
			} );

		} )

		it( "Should format the string correctly", function( ) {
			var result = syncUtils.format( { "direct":"object" } );
			console.log( result );
			result.should.be.exactly( "{ direct: 'object' }" );

			result = syncUtils.format( "JSON %j", { "direct":"object" } );
			console.log( result );
			result.should.be.exactly( "JSON {\"direct\":\"object\"}" );

			result = syncUtils.format( "Inspect Object %t", new Error() );
			console.log( result );
			result.should.be.exactly( "Inspect Object [Error]" );

			result = syncUtils.format( "Unknown %x", "Hello", new Error() );
			console.log( result );
			result.should.be.exactly( "Unknown %x Hello [Error]" );

		} );

		it( "Should load english nls file in all cases", function( ) {

			var rewiredSyncUtils = rewire( "../lib/utils" ),
				loadNlsFile = rewiredSyncUtils.__get__( "loadNlsFile" ),
				originalLanguage = process.env.LANG;

			process.env.LANG = "test";
			try {
				var nls = loadNlsFile();
				should( nls ).not.null;
				nls["error_refused"].should.be.exactly( "Connection refused." );

				process.env.LANG = null;
				var nls = loadNlsFile();
				should( nls ).not.null;
				nls["error_refused"].should.be.exactly( "Connection refused." );

			} catch ( e ) {
				console.log( e );
				should.fail();
			}
			process.env.LANG = originalLanguage;
		} )

		it( "Test getPathFromFilename", function( ) {

			syncUtils.getPathFromFilename( "test.txt" ).should.be.exactly( "test.txt" );
		} );

	} )

} )
