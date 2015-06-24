/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var	webdav = require( "./webdav.js" ),
	sync = require( "./sync.js" ),
	hash = require( "./hash.js" ),
	prompt = require( "prompt" ),
	fs = require( "graceful-fs" ),
	utils = require( "./utils.js" ),
	events = require( "events" ),
	Q = require( "q" ),
	pjson = require( "../package.json" );

var defaults = utils.getDefaults(),
	logger = utils.getLogger(),
	nls = utils.loadNls(),
	uncaughtExceptionHandling = function( err ) {
		var logger = utils.getLogger();
		logger.error( nls.uncaught_exception );
		logger.error( err );
		utils.writeLogFileLocation( logger );
		process.exit();
	},
	interruptHandling = function() {
		var logger = utils.getLogger();
		logger.info( nls.sigint );
		utils.writeLogFileLocation( logger );
		process.exit();
	};

process.on( "uncaughtException", function( err ) {
	uncaughtExceptionHandling( err );
} );

process.on( "SIGINT", function() {
	interruptHandling();
} );

function header() {
	logger.info( nls.program_title, pjson.version );
	logger.info( "***************************************" );
	logger.info( " " );
}

function printHelp() {
	utils.getNlsStrings( "program_help_", nls ).map( function( v ) { logger.info( v ); } );
	logger.info( nls.log_file_location, utils.getUserHome() );
	/*
	logger.info("--debug-scope <string>");
	logger.info("    Sets the trace string defining which methods and files to trace.");
	logger.info("    The string has the format: <file>|<method>:... with 'method' being optional");
	logger.info("    Examples:");
	logger.info("    main.js:sync.js - Logs everything from main.js and sync.js");
	logger.info("    main.js|commandInit:sync.js|sync - Logs everything in function commandInit in main.js and sync in sync.js");
	*/
	logger.info( " " );

}

var listThemes = function( config ) {
	var deferred = new Q.defer();
	config.theme = "";

	// we want to list all themes
	var connection = webdav.createConnection( transformConfig( null, config ) );
	logger.info( nls.list_themes, connection.getBaseUrl() );
	connection.list().then( function( entries ) {
		var result = [];
		for ( var i = 0; i < entries.length; i++ ) {
			if ( entries[i].dir ) {
				result.push( entries[i].name );
			}
		}
		if ( result.length > 0 ) {
			deferred.resolve( result );
		} else {
			deferred.reject( nls.list_themes_none );
		}
	}, function( err ) {
		deferred.reject( err );
	} ).done();
	return deferred.promise;
}

function commandInit( localDir ) {
	utils.getNlsStrings( "setup_", nls ).map( function( v ) {
		if ( v.indexOf( "%s" ) != -1 ) logger.info( v, localDir );
		else logger.info( v );
	} );
	var existingConfig = {};
	try {
		existingConfig = utils.readConfig( localDir );
	}
	catch ( err ) {
	}

	var errorHandler = function( err ) {
		logger.info( " " );
		logger.error( nls.setup_abort );
		handleError( err );
	};

	// special handling - need to set prompt started to false so that it re-initializes itself
	prompt.started = false;
	prompt.start();

	// we make assumptions on the schema here - it could be more generic but this is easier :)
	prompt.get( {
		"properties": getPromptSchema( existingConfig ).basic[0]
	}, function( err, result ) {
		if ( !err ) {

			// save the config at this point already
			existingConfig.username = result.username;
			existingConfig.password = result.password;
			existingConfig.contenthandlerPath = result.contenthandlerPath;
			existingConfig.host = result.host;
			existingConfig.secure = result.secure;

			utils.writeConfig( localDir, existingConfig, function( err ) {
				try {
					existingConfig = utils.readConfig( localDir );
				}
				catch ( err ) {
				}

				// we make assumptions on the schema here - it could be more generic but this is easier :)
				prompt.get( {
					"properties": getPromptSchema( existingConfig ).basic[1]
				}, function( err, result ) {
					if ( !err ) {

						// save the config at this point already
						existingConfig.port = result.port;

						utils.writeConfig( localDir, existingConfig, function( err ) {
							try {
								existingConfig = utils.readConfig( localDir );
							}
							catch ( err ) {
							}

							var hasHash = hash.hasHashContext( localDir );
							if ( hasHash && existingConfig.theme ) {
								logger.info( " " );
								logger.warn( nls.setup_theme_exists );
							} else {
								logger.info( " " );
								logger.info( nls.setup_connecting );

								// we make assumptions on the schema here - it could be more generic but this is easier :)
								var themeSchema = getPromptSchema( existingConfig ).basic[2]["theme"];
								themeSchema.valuesFn( {
									username: existingConfig.username,
									password: existingConfig.password,
									port: existingConfig.port,
									secure: existingConfig.secure,
									contenthandlerPath: existingConfig.contenthandlerPath,
									host: existingConfig.host
								} ).then( function( filenames ) {
									logger.info( nls.setup_themes_found );
									for ( var i = 0; i < filenames.length; i++ ) {
										logger.info( ( i + 1 ) + ". " + filenames[i] );
									}
									var schema = {
										"properties": {
											"theme": {
												"description": utils.format( nls.setup_theme_desc, filenames.length ),
												"type": "number",
												"required": true,
												"conform": function( v ) {
													if ( v >= 1 && v <= filenames.length ) return true;
													return false;
												}
											}
										}
									};
									prompt.get( schema, function( err, result2 ) {
										if ( !err ) {

											//serverSettings.password = existingConfig.password;
											existingConfig.theme = filenames[result2.theme - 1];

											utils.writeConfig( localDir, existingConfig, function( err ) {
												logger.info( " " );
												if ( err ) {
													logger.error( nls.setup_abort, err );
												} else {
													logger.info( nls.setup_success1 );
													logger.info( nls.setup_success2 );
												}
											} );
										} else {
											errorHandler( err );
										}
									} );
								}, function( err ) {
									errorHandler( err );
								} ).catch( function( err ) {
									errorHandler( err );
								} ).done();
							}
						} );
					} else {
						errorHandler( err );
					}
				} );
			} );
		} else {
			errorHandler( err );
		}
	} );
}

function start( processArguments ) {
	header();
	if ( processArguments.command == "init" ) {
		commandInit( processArguments.localDir );
	} else if ( processArguments.command == "run" ) {
		commandRun( processArguments.localDir );
	} else if ( processArguments.command == "pull" ) {
		commandPull( processArguments.localDir );
	} else if ( processArguments.command == "push" ) {
		commandPush( processArguments.localDir );
	} else {
		if ( processArguments.command ) {
			logger.warn( nls.unrecognized_command, processArguments.command );
			logger.info( " " );
		}
		printHelp();
	}
}

function transformConfig( localDir, serverConfig ) {
	var ret = serverConfig;

	// merge default and server
	for ( var key in defaults ) {
		if ( typeof serverConfig[key] == "undefined" ) {
			ret[key] = defaults[key];
		}
	}

	// calculate syncIntervalMillis
	ret.syncIntervalMillis = ret.syncIntervalMin * 60 * 1000;

	var contenthandlerPath = ret.contenthandlerPath;

	// if contenthandlerPath ends with / and filePath starts with / we need to slice one off
	if ( contenthandlerPath.slice( -1 ) == "/" && ret.filePath.indexOf( "/" ) == 0 ) {
		contenthandlerPath = contenthandlerPath.substring( 0, contenthandlerPath.length - 1 );
	}

	// add some pre-calculations
	var schema = ret.schema || ( ret.secure ? "https" : "http" );
	ret.baseUrl = schema + "://" + ret.host + ":" + ret.port + contenthandlerPath + ret.filePath;
	ret.basePath = ret.themesSubfolder + "/" + ret.theme;
	ret.localDir = localDir;
	ret.scope = ret.theme;

 	// scope is displayed in the logs and notifications
	// delete unnecessary ones
	delete ret["filePath"];
	delete ret["schema"];
	delete ret["host"];
	delete ret["port"];
	delete ret["theme"];

	return ret;
}

function printConfig( config ) {
	logger.info( nls.print_config );
	logger.info( "  URL: " + config["baseUrl"] + config["basePath"] );
	for ( var key in config ) {

		// not interesting
		if ( key == "baseUrl" ||
			 key == "basePath" ||
			 key == "localDir" ||
			 key == "themesSubfolder" ||
			 key == "scope" ||
			 key == "contenthandlerPath" ||
			 key == "syncIntervalMillis" ) continue;
		if ( key == "forceWatch" && config[key].length == 0 ) continue;

 		logger.info( "  " + key + ": " + ( key == "password" ? "********" : config[key] ) );
	}
	logger.info( " " );
}

function getConfig( localDir ) {
	try {
		var _config = transformConfig( localDir, utils.readConfig( localDir ) );
		printConfig( _config );
		return _config;
	}
	catch ( err ) {
		logger.error( nls.error_loading_config, err );
	}
	return null;
}

function handleError( err ) {
	if ( err ) {
		if ( err.error && err.error.code == "ENOTFOUND" ) {
			logger.warn( nls.error_host );
			logger.finest( err );
		} else if ( err.error && err.error.code == "ECONNREFUSED" ) {
			logger.warn( nls.error_refused );
			logger.finest( err );
		} else if ( err.statusCode == 401 ) {
			logger.warn( nls.error_unauthorized );
			logger.finest( err );
		} else if ( err.statusCode == 404 ) {
			logger.warn( nls.error_not_found );
			logger.finest( err );
		} else if ( err.error && err.error.code == "EPROTO" ) {
			logger.warn( nls.error_wrong_protocol );
			logger.finest( err );
		} else if ( err.error && err.error.code == "ECONNRESET" ) {
			logger.warn( nls.error_connection_reset );
			logger.finest( err );
		} else if ( err.error == null && err.statusCode == 400 && err.responseHeaders ) {
			try {
				var responseHeaders = JSON.parse( err.responseHeaders );
				if ( responseHeaders["content-type"] && responseHeaders["content-type"].indexOf( "text/html" ) == 0 ) {
					logger.warn( nls.error_probably_no_tai );
					logger.finest( err );
				} else {
					logger.error( err );
				}
			}
			catch ( e ) {
				logger.error( err );
			}
		} else {
			logger.error( err );
		}
	}
}

function commandRun( localDir ) {
	var config = getConfig( localDir );
	if ( config ) {

		// auto watch = true, bBackgroundSync = true
		sync.startTwoWaySync( config, true, true ).then( function() {

		}, function( err ) {
			handleError( err );
		} );
	}
}

function commandPull( localDir ) {
	var config = getConfig( localDir );
	if ( config ) {

		// watch = false, bBackgroundSync = false
		sync.startPullSync( config, false, false ).then( function() {

		}, function( err ) {
			handleError( err );
		} );
	}
}

function commandPush( localDir ) {
	var config = getConfig( localDir );
	if ( config ) {

		// watch = false, bBackgroundSync = false
		sync.startPushSync( config, false, false ).then( function() {

		}, function( err ) {
			handleError( err );
		} );
	}
}

function parseCommandlineArguments( _localDir ) {
	var a = process.argv,
		localDir = _localDir,
		command = null,
		options = {},
		index = 2;

 // next element
	while ( index < a.length ) {

 // as long as it starts with -- it must be an option
		if ( a[index].indexOf( "--" ) == 0 ) {
			if ( a[index] == "--debug" ) {
				options.debug = true;
			} else if ( a[index] == "--debug-finest" ) {
				options.debug = true;

 // automatically turns on debugging
				options.finest = true;
			}
			/*
			else if (a[index]=="--debug-scope") {
				options.debug = true; // automatically turns on debugging
				index++;
				if (index<a.length) {
					options.traceString = a[index];
				}
				else {
					console.log("Incorrect option --debug-scope.");
					process.exit(1);
				}
			}
			*/
			else {
				console.log( utils.format( nls.unrecognized_option, a[index] ) );
				process.exit( 1 );
			}
		} else {
			if ( command == null ) {
				command = a[index];
			} else {
				console.log( utils.format( nls.too_many_commands, a[index] ) );
				process.exit( 1 );
			}
		}
		index++;
	}
	return {
		localDir: localDir,
		options: options,
		command: command
	};
}

exports.runCLI = function( basedir ) {
	try {

		// re-enable the logger
		logger = utils.getLogger();

		var processArguments = parseCommandlineArguments( basedir );
		utils.setLoggerConfig( processArguments.logDir, processArguments.options );

		start( processArguments );
	}
	catch ( err ) {
		handleError( err );
	}
}

exports.redirectConsole = function( delegateFunction ) {
	utils.setLoggerConfig( null, {}, delegateFunction );
}

exports.setLoggerConfig = function( logDir, options, delegateFunction ) {
	utils.setLoggerConfig( logDir, options, delegateFunction );
}

/*
	Events sent by DXSyncCLI
	* status - status update on what is happening
	*	- sync
	*     substatus:
	*     - start
	*     - complete
	*     - error
	*	- watching_files
	*	- waiting_for_sync
	*	- idle
	*	- filesync
	*     substatus:
	*     - start
	*     - complete
	*     - error
	*	- upload
	*     substatus:
	*     - start
	*     - complete
	*     - error
	* 	- download
	*     substatus:
	*     - start
	*     - complete
	*     - error
	* 	- delete
	*     substatus:
	*     - start
	*     - complete
	*     - error
	* 	- rename
	*     substatus:
	*     - start
	*     - complete
	*     - error
	*	- conflict_recognized                	A conflict was recognized. Manual interaction required.
	*     substatus:
	*     - JSON object with
	*         id     - id of the file (normally the filename)
	*         local  - local filename, may be null
	*         remote - remote filename, may be null
	*	- conflict_resolve
	*     - JSON object with
	*         action - start/complete/error
	*         id     - the resolved file

	Events received by DXSyncClI
	* - request_cancel
	* - conflict_resolve
	*   parameter is a json object with:
	*     id:          filename to be resolved (e.g. Plain.html)
	*     resolveWith: filename used to resolve (e.g. Plain.html.conflict)
	*     action:      upload|download|deleteLocal|deleteRemote

*/
/*
	Options are:
		mode = 'FULL'|'PULL'|'PUSH' (Default: FULL)
		autoWatch = true|false (Default: true)
		backgroundSync = true|false (Default: true)
*/
exports.runSync = function( localDir, options, eventEmitter ) {
	var config = getConfig( localDir );
	if ( config ) {
		var errorHandler = function( err ) {
			if ( eventEmitter ) eventEmitter.emit( "status", "error", err );
			handleError( err );
		};
		options = options || {};
		options.autoWatch = ( typeof options.autoWatch != "undefined" ) ? options.autoWatch : true;
		options.backgroundSync = ( typeof options.backgroundSync != "undefined" ) ? options.backgroundSync : true;
		options.mode = ( typeof options.mode != "undefined" ) ? options.mode : "FULL";
		options.mode = options.mode.toUpperCase();
		try {
			if ( options.mode == "FULL" ) {
				sync.startTwoWaySync( config, options.autoWatch, options.backgroundSync, eventEmitter ).then( function() {

					// done
				}, errorHandler );
			} else if ( options.mode == "PUSH" ) {
				sync.startPushSync( config, options.autoWatch, options.backgroundSync, eventEmitter ).then( function() {

					// done
				}, errorHandler );
			} else if ( options.mode == "PULL" ) {
				sync.startPullSync( config, options.autoWatch, options.backgroundSync, eventEmitter ).then( function() {

					// done
				}, errorHandler );
			} else {
				 errorHandler( nls.sync_invalid_mode );
			}
		}
		catch ( err ) {
			errorHandler( err );
		}
	}
}

// for test execution
function cancelSync() {
	sync.cancelSync();
}

exports.loadConfig = function( localDir ) {
	try {
		return utils.readConfig( localDir );
	}
	catch ( err ) {

	}
	return {};
}

exports.saveConfig = function( localDir, config, callback ) {
	try {
		return utils.writeConfig( localDir, config, callback );
	}
	catch ( err ) {
		if ( callback ) {
			callback( err );
		}
	}
	return {};
}

exports.notify = function( title, message ) {
	var notifier = require( "node-notifier" );
	notifier.notify( {
		title: title,
		message: message,
		icon: __dirname + "/images/notify.png"
	}, function( err, response ) {

		// response is response from notification
	} );
}

var ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
var ValidHostnameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

var getPromptSchema = exports.getPromptSchema = function( existingConfig ) {
	existingConfig = existingConfig || {};
	return {
		"titles": {
			"basic": nls.config_section_basic,
			"advanced": nls.config_section_advanced
		},
		"basic": [ {
			"host": {
				"description": nls.config_host_desc,
				"required": true,
				"default": existingConfig["host"] || "",
				"conform": function( value ) {
					return ValidIpAddressRegex.test( value ) || ValidHostnameRegex.test( value );
				}
			},
			"username": {
				"description": nls.config_user_desc,
				"required": true,
				"default": existingConfig["username"] || defaults["username"]
			},
			"password": {
				"description": nls.config_pass_desc,
				"required": true,
				"hidden": true,
				"default": existingConfig["password"] || defaults["password"]
			},
			"contenthandlerPath": {
				"description": nls.config_contenthandler_desc,
				"required": true,
				"default": existingConfig["contenthandlerPath"] || defaults["contenthandlerPath"]
			},
			"secure": {
				"description": nls.config_secure_desc,
				"type": "boolean",
				"required": true,
				"default": ( typeof existingConfig["secure"] != "undefined" ? existingConfig["secure"] : defaults["secure"] )
			}
		}, {
			"port": {
				"description": nls.config_port_desc,
				"required": true,
				"default": existingConfig["port"] || ( existingConfig["secure"] ? defaults["port"].https : defaults["port"].http )
			}
		}, {
			"theme": {
				"description": nls.config_theme_desc,
				"required": true,
				"default": existingConfig["theme"] || "",
				"valuesFn": listThemes
			}
		} ],
		"advanced": {
			"syncIntervalMin": {
				"description": nls.config_syncinterval_desc,
				"required": true,
				"default": existingConfig["syncIntervalMin"] || defaults["syncIntervalMin"]
			},
			"threads": {
				"description": nls.config_connections_desc,
				"required": true,
				"default": existingConfig["threads"] || defaults["threads"]
			},
			"filterRegex": {
				"description": nls.config_filter_desc,
				"required": true,
				"default": existingConfig["filterRegex"] || defaults["filterRegex"]
			}
		}
	}
}
