/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "graceful-fs" ),
	crypto = require( "crypto" ),
	tracer = require( "tracer" ),
	Q = require( "q" ),
	clc = require( "colors" ),
	util = require( "util" ),
	algorithm = "aes-256-ctr",
	password = "U6Jv]H[tf;mxE}6t*PQz?j474A7T@Vx%gcVJA#2cr2GNh96ve+";

var globalLogger,
	loggerWriteStream,
	loggerConfig,
	nls = loadNlsFile(),
	userHome = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
	SUFFIX_CONFLICT = ".conflict";

// initialize
resetLogger();

// for testing purposes
function resetLogger( done ) {
	globalLogger = null;
	loggerConfig = {
		format: [

			//default format
			"{{file}}:{{line}} ({{method}}): {{message}}",
	 		{
				info: "{{message}}",
				warn: "{{message}}",

				// error format
				error: "{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}"
	 		}
		],
		methods: [ "finest", "finer", "info", "warn", "error" ],
		filters: {
			finest: function( str ) { return clc.magenta( str ); },
			finer: function( str ) { return clc.cyan( str ); },
			info: function( str ) { return clc.white.bgBlack( str ); },
			warn: function( str ) { return clc.yellow.bold( str ); },
			error: function( str ) { return clc.red.bold( str ); }
		},
		level: "info",
		stackIndex: 1
	};
	if ( loggerWriteStream ) {

		if ( done ) {
			loggerWriteStream.on( "finish", done );
		}
		loggerWriteStream.end();
		loggerWriteStream = null;
	} else {
		if ( done ) {
			done();
		}
	}
}
exports.resetLogger = resetLogger;

function encrypt( text ) {
	var cipher = crypto.createCipher( algorithm, password )
	var crypted = cipher.update( text, "utf8", "hex" )
	crypted += cipher.final( "hex" );
	return crypted;
}

function decrypt( text ) {
	var decipher = crypto.createDecipher( algorithm, password )
	var dec = decipher.update( text, "hex", "utf8" )
	dec += decipher.final( "utf8" );
	return dec;
}

function loadNlsFile() {
	var fallback = "en",
		json,
		locale = process.env.LANG || "en",
		idx = locale.indexOf( "." );
	if ( idx != -1 ) {
		locale = locale.substring( 0, idx );
	}
	if ( locale == "nb_NO" ) {

		// change Norwegian – Bokmal to no.json
		locale = "no";
	}

	function safeRead( locale ) {
		try {
			return require( "./nls/" + locale + ".json" );
		}
		catch ( e ) {
			return null;
		}
	}
	json = safeRead( locale );

 	// fallback 1
	if ( !json ) {
		idx = locale.indexOf( "_" );
		if ( idx != -1 ) {
			locale = locale.substring( 0, idx );
			json = safeRead( locale );
		}
	}

	// fallback 2 -  we know this works
	if ( !json ) {
		json = require( "./nls/en.json" );
	}
	return json;
};
exports.loadNls = loadNlsFile;

exports.getNlsStrings = function( prefix, nls ) {
	var c = 1,
		ret = [];
	while ( true ) {
		if ( nls[prefix + c] ) {
			ret.push( nls[prefix + c] );
		} else {
			break;
		}
		c++;
	}
	return ret;
}
exports.isHidden = function( filename, config ) {
	if ( config.filterRegex ) {
		if ( !config.filterRegexObject ) {
			config.filterRegexObject = new RegExp( config.filterRegex );
		}
		var result = config.filterRegexObject.test( filename );
		return result;
	} else return false;
}

function isConflict( filename ) {
	return filename.indexOf( SUFFIX_CONFLICT, filename.length - SUFFIX_CONFLICT.length ) !== -1;
}

exports.readDirSyncFilter = function( dir, config ) {
	if ( !config.filterRegexObject ) {
		config.filterRegexObject = new RegExp( config.filterRegex );
	}
	var ret = [],
		map = {},
		hiddenFiles = [],
		list = fs.readdirSync( dir );
	for ( var i = 0; i < list.length; i++ ) {
		map[list[i]] = {};
		var isHidden = config.filterRegexObject.test( list[i] );
		if ( !isHidden ) {
			ret.push( list[i] );
		} else {
			hiddenFiles.push( list[i] );
		}
	}

	// now we check the hidden files for the usecase where there is no "normal file" anymore (file without .conflict)
	// in this case the file itself would not be returned anymore and we will inject it into the ret list
	// even though it doesn't exist. This condition only happens for conflicts and can be handled by the calling code.
	for ( var i = 0; i < hiddenFiles.length; i++ ) {

		// this is a hidden file
		if ( isConflict( hiddenFiles[i] ) ) {
			var filename = hiddenFiles[i].substring( 0, hiddenFiles[i].length - SUFFIX_CONFLICT.length );

			// if the "normal file" wasn't already added to the ret list we add it now
			if ( !map[filename] ) {
				ret.push( filename );
			}
		}
	}
	return ret;
}

exports.getDefaults = function() {
	return {

		//password: "wpsadmin",
		"username": "wpsadmin",
		"port": {
			"http": 10039,
			"https": 10041
		},
		"secure": true,
		"contenthandlerPath": "/wps/mycontenthandler",
		"filePath": "/dav/fs-type1",
		"themesSubfolder": "/themes",
		"syncIntervalMin": "5",
		"threads": "10",
		"filterRegex": "^\\.|~$|.bak$|.resolve$|.delete$|.conflict$",
		"forceWatch": []
	};
}

exports.readConfig = function( localDir ) {
	var data = fs.readFileSync( localDir + "/.settings", "utf8" );
	var config = JSON.parse( data );
	if ( config.password ) {
		config.password = decrypt( config.password );
	}
	return config;
}

exports.writeConfig = function( localDir, config, callback ) {
	if ( config.password ) {
		config.password = encrypt( config.password );
	}

	// we have to delete the file first because if we write the file it might retain old data from the previous content
	if ( fs.existsSync( localDir + "/.settings" ) ) {
		fs.unlinkSync( localDir + "/.settings" );
	}
	fs.writeFile( localDir + "/.settings", JSON.stringify( config, null, 4 ), function( err ) {
		if ( callback ) callback( err );
	} );
}

function isDebugFinest() {
	return loggerConfig.level == "finest";
}
exports.isDebugFinest = isDebugFinest;

function isDebug() {
	return loggerConfig.level == "finest" || loggerConfig.level == "finer";
}
exports.isDebug = isDebug;

// we return a proxy
exports.getLogger = function() {
	var proxy = {};
	for ( var i = 0; i < loggerConfig.methods.length; i++ ) {
		( function( m ) {
			if ( m == "error" ) {
				proxy[m] = function() {
					if ( !globalLogger ) {
						globalLogger = tracer.console( loggerConfig );
					}
					globalLogger[m].apply( this, arguments );
					if ( isDebug() ) {
						for ( var ii = 0; ii < arguments.length; ii++ ) {
							if ( arguments[ii] && arguments[ii].stack ) globalLogger.error( arguments[ii].stack );
						};
					}
				}
			} else {
				proxy[m] = function() {
					if ( !globalLogger ) {
						globalLogger = tracer.console( loggerConfig );
					}
					globalLogger[m].apply( this, arguments );
				}
			}
		} )( loggerConfig.methods[i] );
	}
	return proxy;
}

var logfileLocation;
exports.writeLogFileLocation = function( logger ) {
	if ( logfileLocation ) {
		logger.info( nls.log_file_location2, logfileLocation );
	}
}

exports.setLoggerConfig = function( logDir, options, delegateFunction ) {
	if ( options.debug ) {

		// defaults to user home
		if ( !logDir ) {
 			logDir = userHome;
		}
		logfileLocation = logDir + "/dxsync.log";
		if ( options.finest ) loggerConfig.level = "finest";
		else loggerConfig.level = "finer";

		// update display format
		loggerConfig.format = [

			//default format
			"{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}",

 			{

				//\nCall Stack:\n{{stack}}" // error format
				error: "{{timestamp}} <{{title}}> {{file}}:{{line}} {{message}}"
			}
		];

		// wrap filter functions to additionally write out the logger to a file
		try {fs.unlinkSync( logfileLocation );} catch ( e ) {}
		loggerWriteStream = fs.createWriteStream( logfileLocation, {
			flags: "a",
			encoding: "utf8",
			mode: 0666
		} );
		for ( var i = 0; i < loggerConfig.methods.length; i++ ) {
			( function( m ) {
				var delegateFn = loggerConfig.filters[m];
				loggerConfig.filters[m] = function( str ) {
					loggerWriteStream.write( str + "\n" );
					if ( delegateFunction ) {
						return delegateFunction( m, str );
					} else {
						return delegateFn( str );
					}
				}
			} )( loggerConfig.methods[i] );
		}

		// create new logger
		globalLogger = tracer.console( loggerConfig );
	} else if ( delegateFunction ) {
		for ( var i = 0; i < loggerConfig.methods.length; i++ ) {
			( function( m ) {
				loggerConfig.filters[m] = function( str ) {
					return delegateFunction( m, str );
				}
			} )( loggerConfig.methods[i] );
		}
		globalLogger = tracer.console( loggerConfig );
	}
}

exports.getUserHome = function() {
	return userHome;
};

exports.copyFile = function( source, target ) {
	var deferred = new Q.defer(),
		resolved = false;

	var rd = fs.createReadStream( source );
	rd.on( "error", function( err ) {
		done( err );
	} );
	var wr = fs.createWriteStream( target );
	wr.on( "error", function( err ) {
		done( err );
	} );
	wr.on( "close", function( ex ) {
		done();
	} );
	rd.pipe( wr );

	function done( err ) {
		if ( !resolved ) {
			resolved = true;
			if ( err ) {
				deferred.reject( err );
			} else {
				deferred.resolve();
			}
		}
	}
	return deferred.promise;
}

exports.unlinkFile = function( file ) {
	var deferred = new Q.defer();
	if ( file != null && fs.existsSync( file ) ) {
		fs.unlink( file, function( err ) {
			if ( err ) {
				deferred.reject( err );
			} else {
				deferred.resolve();
			}
		} );
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

var convertPath = exports.convertPath = function( filename ) {

	// convert backlash to forward slash
	var ret = ( filename ) ? filename.replace( /\\/g, "/" ) : filename;
	return ret;
}

exports.getPathFromFilename = function( filename ) {

	// convert backlash to forward slash
	var ret = convertPath( filename ),
		idx = ret.lastIndexOf( "/" );
	if ( idx != -1 ) {
		ret = ret.substring( 0, idx );
	}
	return ret;
}

var mkdirRecursive = function( path ) {
	function mkdir( _path ) {
		var idx = _path.lastIndexOf( "/" );
		if ( idx != -1 ) {
			_path = _path.substring( 0, idx );
			if ( !fs.existsSync( _path ) ) {
				mkdir( _path );
				fs.mkdirSync( _path );
			}
		}
	}
	mkdir( path );
	if ( !fs.existsSync( path ) ) {
		fs.mkdirSync( path );
	}
}
exports.mkdirRecursive = mkdirRecursive;

var formatRegExp = /%[sdjt]/g;
exports.format = function( f ) {
	var inspectOpt = this.inspectOpt;
	var args = arguments;
	var i = 0;

	if ( typeof f !== "string" ) {
		var objects = [];
		for ( ; i < args.length; i++ ) {
			objects.push( util.inspect( args[i], inspectOpt ) );
		}
		return objects.join( " " );
	}

	i = 1;
	var str = String( f ).replace( formatRegExp, function( x ) {
		switch ( x ) {
		case "%s":
			return String( args[i++] );
		case "%d":
			return Number( args[i++] );
		case "%j":
			try {
				return JSON.stringify( args[i++] );
			} catch ( e ) {
				return "[Circular]";
			}
		case "%t":
			return util.inspect( args[i++], inspectOpt );
		default:
			return x;
		}
	} );
	for ( var len = args.length, x = args[i]; i < len; x = args[++i] ) {
		if ( x === null || typeof x !== "object" ) {
			str += " " + x;
		} else {
			str += " " + util.inspect( x, inspectOpt );
		}
	}
	return str;
}
