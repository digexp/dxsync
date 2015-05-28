/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var request = require( "request" ),
	xml2js = require( "xml2js" ),
	Q = require( "q" ),
	utils = require( "./utils.js" ),
	util = require( "util" ),
	throat = require( "throat" );

var HTTP_NOT_FOUND = 404,
	logger = utils.getLogger(),
	nls = utils.loadNls(),
	prefixMatch = new RegExp( /(?!xmlns)^.*:/ );

function stripPrefix( str ) {
    return str.replace( prefixMatch, '' );
}

function limitConcurrency( promiseFactory, limit ) {
	var fn = throat( promiseFactory, limit );
	return function() {
		return Q( fn.apply( this, arguments ) );
	}
}

function isCollection( webDavObject ) {
	var propstat = webDavObject["propstat"];
	if ( util.isArray( propstat ) ) {
		for ( var i = 0; i < propstat.length; i++ ) {
			var props = propstat[i]["prop"];
			if ( props["resourcetype"] && typeof props["resourcetype"]["collection"] != "undefined" ) {
				return true;
			}
		};
	} else {
		var props = propstat["prop"];
		if ( props["resourcetype"] && typeof props["resourcetype"]["collection"] != "undefined" ) {
			return true;
		}
	}
	return false;
}

function getLastModified( webDavObject ) {
	var propstat = webDavObject["propstat"];
	if ( util.isArray( propstat ) ) {
		for ( var i = 0; i < propstat.length; i++ ) {
			var props = propstat[i]["prop"];
			if ( typeof props["getlastmodified"] != "undefined" ) {
				return Date.parse( props["getlastmodified"] );
			}
		};
	} else {
		var props = propstat["prop"];
		if ( typeof props["getlastmodified"] != "undefined" ) {
			return Date.parse( props["getlastmodified"] );
		}
	}
	return "";
}

var WebDavConnection = function( config ) {
	var baseUrl = config.baseUrl + config.basePath,
		canceled = false;
		that = this;

	function splitWebDavPath( path ) {
		path = path.replace( config.urlPath, "" );
		if ( path.slice( -1 ) == "/" ) {
			path = path.substring( 0, path.length - 1 );
		}
		var ret = {
			path: "",
			name: ""
		};
		var idx = path.lastIndexOf( "/" );
		if ( idx != -1 ) {
			ret.path = path.substring( 0, idx + 1 );
			ret.name = path.substring( idx + 1 );
		} else {
			ret.name = path;
		}
		return ret;
	}

	var WebDavDir = function( path, name, webDavObject ) {
		this.dir = true;
		this.path = path;
		this.name = name;
		this.lastModified = getLastModified( webDavObject );
		var fullPath = config.baseUrl + this.path + this.name;

		// dir is optional and point to the root if undefined or null
		this.list = function() {
			return webdavPropfind( fullPath, false, false );
		};

	};

	var WebDavFile = function( path, name, webDavObject ) {
		this.dir = false;
		this.path = path;
		this.name = name;
		this.lastModified = getLastModified( webDavObject );

		this.read = function( success_http_code ) {
			return webdavGet( config.baseUrl + this.path + this.name, success_http_code );
		};
		this.write = function( data ) {
			return webdavPut( config.baseUrl + this.path + this.name, data );
		};

	};

	var WebDavFileCreate = function( path ) {
		var n = splitWebDavPath( path );
		this.dir = false;
		this.path = n.path;
		this.name = n.name;
		this.lastModified = null;

		this.write = function( data ) {
			return webdavPut( config.baseUrl + this.path + this.name, data );
		};
	};

	// this is to return files that were not found remotely
	var WebDavFileEmpty = function( path ) {
		path = path.replace( config.baseUrl, "" );
		var n = splitWebDavPath( path );
		this.dir = false;
		this.path = n.path;
		this.name = n.name;
		this.lastModified = null;

		this.read = function( success_http_code ) {
			var deferred = Q.defer();
			deferred.resolve( null );
			return deferred.promise;
		};
		this.write = function( data ) {
			return webdavPut( config.baseUrl + this.path + this.name, data );
		};

	};

	var doRequest = function( url, method, headers, data ) {
		if ( that.isCanceled() ) {
			var deferred = Q.defer();
			deferred.reject( nls.webdav_request_canceled );
			return deferred.promise;
		}
		var h = headers || {};

		//h["Content-Type"] = "text/xml; charset=UTF-8";
		var options = {
			"url": encodeURI( url ),
			"method": method,
			"headers": h,
			"auth": {
				"user": config.username,
				"pass": config.password
			},
			"encoding": null
		};
		if ( method == "PUT" ) {
			options.body = data;

			// special code to avoid bug https://github.com/request/request/issues/920
			var length = 0
			if ( !Buffer.isBuffer( options.body ) ) {
			  if ( Array.isArray( options.body ) ) {
				for ( var i = 0; i < options.body.length; i++ ) {
				  length += options.body[i].length;
				}
			  } else {
				length = new Buffer( options.body ).length;
			  }
			} else {
			  length = options.body.length;
			}

			// this means content-length = 0
			if ( length == 0 ) {

				// skip the file
				logger.finest( "Skipping file %s because it has zero length. Avoiding hitting bug https://github.com/request/request/issues/920", url );
				var deferred = Q.defer();
				deferred.resolve();
				return deferred.promise;
			}

			// reset as it may have been overwritten
			options.body = data;
		}

		// just in case there is an error
		var stack;
		if ( utils.isDebug() ) {
			stack = new Error().stack;
		} else {
			stack = "Turn on debug mode to see a stack trace";
		}
		logger.finest( "Request %s %s %j", method, url, h );

		//logger.finest("Request %s %s %j\nStack: %s", method, url, h, stack);

		var deferred = Q.defer(),
			retry = 0,
			handleResponse = function( error, response, body ) {
				if ( that.isCanceled() ) {
					deferred.reject( nls.webdav_request_canceled );
					return;
				}
				if ( error && ( error.code == "EBADF" || error.code == "ECONNRESET" || error.code == "ENOTFOUND" || error.code == "ETIMEDOUT" ) && retry < 3 ) {

					// was unable to determine why this is failing so we simply try to upload it multiple times
					retry++;
					var stack2;
					if ( utils.isDebug() ) {
						stack2 = new Error().stack;
					} else {
						stack2 = "Turn on debug mode to see a stack trace";
					}
					logger.finer( "Recognized error '%s' for '%s'. Trying again (Retry: %s)", error.code, url, retry );
					logger.finest( {
						error: error,
						statusCode: ( response ) ? response.statusCode : 0,
						responseText: ( body ) ? body.toString( "utf-8" ) : null,
						requestOptions: utils.format( "%j", options ),
						responseHeaders: ( response ) ? utils.format( "%j", response.headers ) : "",
						stack1: stack2.split( "\n" ),
						stack2: stack.split( "\n" )
					} );
					setTimeout( function() {
						request( options, handleResponse );
					}, 500 );
					return;
				}
				if ( !error && response.statusCode >= 200 && response.statusCode < 300 ) {
					if ( retry != 0 ) {

						// this mean we tried it again and now it was successful. In this case we tell the user about it
						logger.info( nls.webdav_retry_success, url, retry );
					}
					deferred.resolve( body );
				} else {
					options.auth.pass = "********";
					if ( options.body ) {
						options.body = options.body.toString( "utf-8" );
					}
					var stack2;
					if ( utils.isDebug() ) {
						stack2 = new Error().stack;
					} else {
						stack2 = "Turn on debug mode to see a stack trace";
					}
					deferred.reject( {
						error: error,
						statusCode: ( response ) ? response.statusCode : 0,
						responseText: ( body ) ? body.toString( "utf-8" ) : null,
						requestOptions: utils.format( "%j", options ),
						responseHeaders: ( response ) ? utils.format( "%j", response.headers ) : "",
						stack1: stack2.split( "\n" ),
						stack2: stack.split( "\n" )
					} );
				}
			};
		request( options, handleResponse );
		return deferred.promise;
	};

	var webdavPropfind = function( url, singlefile, success_http_code ) {
		var deferred = Q.defer();
		doRequest( url, "PROPFIND", { Depth: "1" }, null ).then( function( xmlBody ) {
			xml2js.parseString( xmlBody, {
				explicitArray: false,
				ignoreAttrs: true,
				tagNameProcessors: [ stripPrefix ]
			}, function( err, result ) {
				if ( err ) {

					deferred.reject( err );
				} else {
					if ( singlefile ) {
						var response = result["multistatus"]["response"];
						var n = splitWebDavPath( decodeURIComponent( response["href"] ) );

						// here we accept hidden files
						deferred.resolve( new WebDavFile( n.path, n.name, response ) );
					} else {
						var resultArray = [];
						var responseArray = result["multistatus"]["response"];
						if ( util.isArray( responseArray ) ) {

							// skip the first as this is the self node
							for ( var i = 1; i < responseArray.length; i++ ) {

								var n = splitWebDavPath( decodeURIComponent( responseArray[i]["href"] ) );
								if ( !utils.isHidden( n.name, config ) ) {
									if ( isCollection( responseArray[i] ) ) {
										resultArray.push( new WebDavDir( n.path, n.name, responseArray[i] ) );
									} else {
										resultArray.push( new WebDavFile( n.path, n.name, responseArray[i] ) );
									}
								}
							};
						} else {

							// this is an empty directory
						}
						deferred.resolve( resultArray );
					}
				}

			} );
		}, function( err ) {
			if ( err.statusCode == success_http_code ) {
				logger.finest( "Handling error code %s as success case.", success_http_code );

				// in this case this is an allowed success condition, so resolve this promise
				if ( singlefile ) {
					deferred.resolve( new WebDavFileEmpty( url ) );
				} else {
					deferred.resolve( [ new WebDavFileEmpty( url ) ] );
				}
			} else {
				deferred.reject( err );
			}
		} ).done();
		return deferred.promise;
	};

	var webdavGet = function( url, success_http_code ) {
		var deferred = Q.defer();
		doRequest( url, "GET", null, null ).then( function( data ) {
			deferred.resolve( data );
		}, function( err ) {
			logger.finest( "Handling error code %s as success case.", success_http_code );
			if ( err.statusCode == success_http_code ) {

				// in this case this is an allowed success condition, so resolve this promise
				deferred.resolve( null );
			} else {
				deferred.reject( err );
			}
		} ).done();
		return deferred.promise;
	};

	var webdavPut = function( url, data ) {
		return doRequest( url, "PUT", null, data );
	};

	var webdavMove = function( url, destination ) {
		return doRequest( url, "MOVE", { "Destination": encodeURI( destination ) } );
	};

	var webdavMkcol = function( url ) {
		return doRequest( url, "MKCOL", null );
	};

	var webdavDelete = function( url ) {
		return doRequest( url, "DELETE", null );
	};

	// dir is optional and point to the root if undefined or null
	this.list = function() {
		return webdavPropfind( baseUrl, false );
	};

	this.getFile = function( filename, success_http_code ) {
		return webdavPropfind( baseUrl + "/" + filename, true, success_http_code );
	};

	this.exists = function( filename ) {
		var deferred = Q.defer();
		webdavPropfind( baseUrl + "/" + filename, true ).then( function() {
			deferred.resolve( { exists: true } );
		}, function( err ) {
			if ( err.statusCode == HTTP_NOT_FOUND ) {
				deferred.resolve( { exists: false } );
			} else {

				//something else went wrong
				deferred.reject( err );
			}
		} ).done();
		return deferred.promise;
	};

	this.createFile = function( filename ) {
		return new WebDavFileCreate( config.basePath + "/" + filename );
	};

	this.createDir = function( filename ) {
		return webdavMkcol( baseUrl + "/" + filename );
	};

	this.deleteFile = function( filename ) {
		var deferred = Q.defer();
		webdavDelete( baseUrl + "/" + filename ).then( function() {
			deferred.resolve();
		}, function( err ) {
			if ( err.statusCode == HTTP_NOT_FOUND ) {
				deferred.resolve();
			} else {

				//something else went wrong
				deferred.reject( err );
			}
		} ).done();
		return deferred.promise;
	};

	this.renameFile = function( oldFilename, newFilename ) {
		return webdavMove( baseUrl + "/" + oldFilename, baseUrl + "/" + newFilename );
	};

	this.cancelAll = function() {
		canceled = true;
	};

	this.isCanceled = function() {
		return canceled;
	};
	this.getBaseUrl = function() {
		return baseUrl;
	}

	// limit simultaneous requests
	// the second argument must be a number
	doRequest = limitConcurrency( doRequest, parseInt( config.threads ) );

};

exports.createConnection = function( config ) {
	var idx = config.baseUrl.indexOf( "://" );
	if ( idx == -1 ) {
		throw new Error( utils.format( nls.webdav_invalid_url, config.baseUrl ) );
	}

	// We turn off rejecting self signed cerificats for now
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	var urlPath = config.baseUrl.substring( config.baseUrl.indexOf( "/", idx + 3 ) );
	return new WebDavConnection( {
		"filterRegex": config.filterRegex,
		"username": config.username,
		"password": config.password,

		// e.g. /wps/mycontenthandler/dav/fs-type1
		"urlPath": urlPath,

		// e.g. http://host:port/wps/mycontenthandler/dav/fs-type1
		"baseUrl": config.baseUrl,

		// e.g. /themes/Portal8.5
		"basePath": config.basePath,
		"threads": config.threads || 10
	 } );
};
