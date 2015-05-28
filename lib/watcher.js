/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var Q = require( "q" ),
	hash = require( "./hash.js" ),
	utils = require( "./utils.js" ),
	fs = require( "graceful-fs" ),
	pathwatcher = null,
	logger = utils.getLogger(),
	nls = utils.loadNls();

// this shd be all in one common package, for now it is duplicated. Is also in sync.js and utils.js
var SUFFIX_RESOLVE = ".resolve",
	SUFFIX_DELETE = ".delete";
function isConflictFile( filename ) {
	return ( filename.indexOf( SUFFIX_RESOLVE, filename.length - SUFFIX_RESOLVE.length ) !== -1 ) ||
		   ( filename.indexOf( SUFFIX_DELETE, filename.length - SUFFIX_DELETE.length ) !== -1 );
}

function getProcessPlatform() {
	return process.platform;
}

function getProcessArch() {
	return process.arch;
}

function getPathWatcherThroughRequire() {
	return require( "pathwatcher" );
}

function initPathWatcher() {
	try {
		logger.finest( "Looking for pathwatcher through normal require" );
		pathwatcher = getPathWatcherThroughRequire();
		if ( pathwatcher ) {

			// we are done
			return true;
		}
	}
	catch ( e ) {
		logger.finest( e );
		logger.finer( "Unable to find pathwatcher as source dependency. Looking for precompiled version now." );
	}
	var preCompiledLookupPath = "../precompiled_modules/" + getProcessPlatform() + "/" + getProcessArch() + "/pathwatcher";
	try {
		logger.finest( "Looking for pathwatcher in '../precompiled_modules/" + getProcessPlatform() + "/" + getProcessArch() + "/pathwatcher'" );
		pathwatcher = require( preCompiledLookupPath );
		if ( pathwatcher ) {

			// we are done
			return true;
		}
	}
	catch ( e ) {
		logger.finest( e );
		logger.finer( "Unable to find pre-compiled pathwatcher in '" + preCompiledLookupPath + "'. Disabling watching capability." );
	}
	return false;
}
/*
function clearDelayedExecution( context ) {
	if ( context.timeoutHandle ) {
		logger.finest( "Clearing timeout handle for ", context.getFilename() );
		clearTimeout( context.timeoutHandle );
		delete context.timeoutHandle;
		delete context.timeoutCallback;
		delete context.callbackData;
	}
}
*/
function delayedExecution( context, data, callback ) {
	if ( context.timeoutHandle ) {

		// already set, so we are in a timeout, we delete the original one and create a new one
		clearTimeout( context.timeoutHandle );
	}

	// only if one of those has valid data, we proceed
	if ( context.callbackData || data ) {

		// IMPORTANT: if there is an existing event name we always discard the change event and take the other one
		// 1) This is a situation where on Windows a rename fires a
		// rename+change event happens and we need to honor the rename event instead of the change event.
		// 2) On Linux a rename fires change, update and delete and we need to dicard the change
		if ( data && context.callbackData && context.callbackData.event && context.callbackData.event == "change" ) {
			if ( data && data.event ) {
				logger.finest( "Dropping event 'change' in favor of " + data.event + " for " + context.getFilename() );
			}
			context.callbackData = data;
		} else {
			context.callbackData = context.callbackData || data;
		}

		// However, if data.skip is set we have to move this into the context.callbackData to skip event emitting
		if ( data && data.skip ) {
			context.callbackData.skip = data.skip;
		}

		// remember so we can re-issue that callback in the parent chain.
		context.timeoutCallback = callback || context.timeoutCallback;

		// wait 250ms for files and 500ms for directories, unless this is a rename event, then we prioritze it higher
		var waitTime = ( context.isDir() ) ? 500 : 250;
		if ( data && data.event == "rename" ) {
			waitTime = 250;
		}

		context.timeoutHandle = setTimeout( function() {
			var callback = context.timeoutCallback;
			var callbackData = context.callbackData;
			delete context.timeoutHandle;
			delete context.timeoutCallback;
			delete context.callbackData;
			if ( callback ) callback( callbackData );
		}, waitTime );

		// with change event
		if ( context.getParent() ) {
			delayedExecution( context.getParent() );
		}
	}
}

var Watcher = function( startDir, config, deferred ) {
	var iSkipWatching = 0,
		onCallbacks = {},
		rootHandler,

		// the following variables are purely for the pathwatcher bug https://github.com/atom/node-pathwatcher/issues/70
		watchCount = 0,
		reservedWatcherSpots = 0,
		allowedWatcherMap = null,
		watchActivation = function( handler, path ) {
			if ( !handler.watcher ) {
				if ( handler.isDir() ) {
					if ( handler.reservedWatcherSpot ) {
						reservedWatcherSpots--;
						handler.reservedWatcherSpot = false;
					}
					if ( getProcessPlatform() == "win32" ) {
						if ( ( allowedWatcherMap && !allowedWatcherMap[path] ) || watchCount >= 64 - 1 - reservedWatcherSpots ) {

							// if the map is defined we don't print out anything because we do it later
							// this is the initial watch setup
							if ( !allowedWatcherMap ) {
								logger.warn( nls.watcher_win_toomany_folders, path );
							}
							return null;
						}
					}
					watchCount++;
				} else {
					var parent = handler.getParent();
					if ( parent && !parent.isWatching() ) {
						logger.finest( "Skipping to watch '%s' due to the fact that the directory is already unwatched.", path );
						return;
					}
				}
				handler.watcher = pathwatcher.watch( path, handler.handle );
				logger.finest( "Watch '%s'", path );
			}
		},
		watchDeactivation = function( handler, reserveSpot ) {
			if ( handler.watcher ) {
				if ( handler.isDir() ) {
					if ( reserveSpot ) {
						handler.reservedWatcherSpot = true;
						reservedWatcherSpots++;
					}
					watchCount--;
				}
				handler.watcher.close();
				handler.watcher = null;
				logger.finest( "Unwatch '%s'", handler.getFilename() );
			}
		};

	var emit = function( skip, event, param1, param2, param3 ) {
		if ( skip == 0 ) {
			if ( onCallbacks[event] ) {
				onCallbacks[event]( param1, param2, param3 );
			}
		} else {
			logger.finest( "Skipping event emit as requested. Event: %s Data:%s;%s;%s", event, param1, param2, param3 );
		}
	}

	function handleRename( skip, path, watchedPath, that ) {
		if ( path.indexOf( startDir ) != 0 ) {

			// even though this was a rename, this file was moved out of the scope of the watcher
			// so we unwatch and issue delete event
			logger.finest( "Rename recognized as delete: %s", path );
			handleDelete( skip, watchedPath, that );
		} else if ( watchedPath.indexOf( startDir ) == 0 ) {

			// in edge cases this is the same, so we just skip it
			if ( watchedPath != path ) {
				emit( skip, "rename", watchedPath, path, that.isDir() );

				var oldDirHandler = rootHandler.getDirHandlerByPath( watchedPath );
				var newDirHandler = rootHandler.getDirHandlerByPath( path );
				if ( oldDirHandler && newDirHandler ) {
					oldDirHandler._deleteFileHandler( that );
					newDirHandler._addFileHandler( that );

					// update filename
					var filename,
						idx = path.lastIndexOf( "/" );
					if ( idx != -1 ) {
						filename = path.substring( idx + 1 );
					} else {
						filename = path;
					}
					that.setFilename( filename );

					// successfully renamed
					return true;
				} else {
					logger.error( nls.watcher_restart, watchedPath );
				}
			}
		} else {
			logger.error( nls.watcher_stateexception, path, watchedPath, startDir );
		}
		return false;
	}

	function handleDelete( skip, watchedPath, that, suppressEvent ) {
		if ( typeof suppressEvent == "undefined" ) {

			// we only emit an event if the file is not hidden
			if ( !utils.isHidden( watchedPath, config ) ) {
				emit( skip, "delete", watchedPath, that.isDir() );
			} else {
				logger.finest( nls.watcher_ignore_delete, watchedPath );
			}
		}
		that.getParent()._deleteFileHandler( that );
		that._deleteWatcher();
	}

	function isForceWatch( path ) {
		for ( var i = 0; i < config.forceWatch.length; i++ ) {
			if ( path.indexOf( config.forceWatch[i] ) != -1 ) {
				return true;
			}
		};
		return false;
	}

	function getFoldersSortedByDepthLast( path, nosort ) {
		var result = [];
		result.push( utils.convertPath( path ) );
		var list = utils.readDirSyncFilter( path, config );
		for ( var i = 0; i < list.length; i++ ) {
			var filename = path + "/" + list[i];
			if ( fs.existsSync( filename ) && fs.lstatSync( filename ).isDirectory() ) {
				result = result.concat( getFoldersSortedByDepthLast( filename, true ) );
			} else {

				// do nothing as we are only interested in directories due to the windows bug
			}
		}
		if ( !nosort ) {

			// this functions sorts by path depth first, second by filename
			// it also honors the forceWatch setting and put those up front
			result.sort( function( a, b ) {
				var lenA = ( isForceWatch( a ) ? -1 : a.split( "/" ).length ),
					lenB = ( isForceWatch( b ) ? -1 : b.split( "/" ).length ),
					result = lenA - lenB;
				if ( result == 0 ) {
					if ( a < b ) return -1;
					else if ( a > b ) return 1;
					else {
						return 0;
					}
    			} else {
					return result;
				}
			} );
		}
		return result;
	}

	function getSplitWatcherMap ( folderArray ) {
		var result = {
			allowed: {},
			disallowed: []
		};
		for ( var i = 0; i < folderArray.length; i++ ) {
			var path = folderArray[i];

			if ( i < 64 || getProcessPlatform() != "win32" ) {
				result.allowed[path] = true;
			} else {
				result.disallowed.push( path );
			}
		};

		return result;
	}

	// watchedDir is the full dir for the very first handler, that has no parent,
	// 		after that the watchedDir is a simple name, not the full path
	var DirHandler = function( watchedDir, parent ) {
		if ( watchedDir.slice( -1 ) == "/" ) {
			watchedDir = watchedDir.substring( 0, watchedDir.length - 1 );
		}
		this.watchedDir = watchedDir;
		this.watcher = null;
		this.parent = parent || null;

		// a list of filehandlers contained within this directory
		this.handlerList = [];

		var that = this;

		this.addHandler = function( pathAndFilename ) {
			var filename,
				idx = pathAndFilename.lastIndexOf( "/" );
			if ( idx != -1 ) {
				filename = pathAndFilename.substring( idx + 1 );
			} else {
				filename = pathAndFilename;
			}
			if ( fs.existsSync( pathAndFilename ) ) {
				if ( fs.lstatSync( pathAndFilename ).isDirectory() ) {
					var handler = new DirHandler( filename, that );
					handler.walk();
					that.handlerList.push( handler );
				} else {
					var handler = new FileHandler( filename, that );
					handler.walk();
					that.handlerList.push( handler );
				}
			}
		}

		this.walk = function() {
			var watchedPath = that.getFilename();
			that._createWatcher( watchedPath );
			var list = utils.readDirSyncFilter( watchedPath, config );
			for ( var i = 0; i < list.length; i++ ) {
				that.addHandler( watchedPath + "/" + list[i] );
			}
		};

		this.handle = function( event, path ) {

			path = utils.convertPath( path );
			var watchedPath = that.getFilename();
			logger.finest( "Immediate: Event: '%s' WatchedPath: '%s' Path: '%s' Skip: '%d'", event, watchedPath, path, iSkipWatching );
			delayedExecution( that, { "path":path, "event":event, "skip": iSkipWatching }, function( data ) {

				// WINDOWS - We have to unwatch it first, because open file handles block access
				that._deleteWatcher( true, true );
				logger.finest( "Delayed: Event: '%s' WatchedPath: '%s' Path: '%s' Skip: '%d'", data.event, watchedPath, data.path, data.skip );
				if ( data.event == "change" ) {

					// WINDOWS: It can happen that we can get a change event even though the directory was deleted.
					// In this case, we skip everything. We might look into deleting the directory in the future
					if ( fs.existsSync( watchedPath ) ) {
						var map = {},
							list = utils.readDirSyncFilter( watchedPath, config ),
							filename,
							deleteList = [];
						for ( var i = 0; i < list.length; i++ ) {
							filename = watchedPath + "/" + list[i];
							map[filename] = true;
						}
						for ( var i = 0; i < that.handlerList.length; i++ ) {
							filename = that.handlerList[i].getFilename();
							if ( map[filename] ) {

								// exists, do nothing
								delete map[filename];
							} else {

								// does not exist - SHOULD NEVER HAPPEN
								// ... except on WINDOWS it happens because folder watchers
								// don't get a delete notification, so we have to delete files/folders here
								//logger.error("Restart Theme Sync! (recognized file delete? "+filename+")");
								deleteList.push( that.handlerList[i] );
							}
						}

						// delete the ones from deleteList
						for ( var i = 0; i < deleteList.length; i++ ) {
							var node = deleteList[i];
							handleDelete( data.skip, node.getFilename(), node );
						}

						// the remaining must be adds
						for ( filename in map ) {
							try {
								var isDir = fs.lstatSync( filename ).isDirectory();
								emit( data.skip, "add", filename, isDir );
								that.addHandler( filename );
							} catch ( e ) {

								// this may happen if the filename doesn't exist. We just skip the handler in this
							}
						}

						// WINDOWS - Re-attach the watcher
						that._createWatcher( watchedPath, true );
					}
				} else if ( data.event == "delete" ) {
					handleDelete( data.skip, watchedPath, that );
				} else if ( data.event == "rename" ) {
					if ( handleRename( data.skip, data.path, watchedPath, that ) ) {

						// WINDOWS - Re-attach the watcher
						that._createWatcher( data.path );
					}
				}

			} );
		};

		this.isDir = function() {
			return true;
		};
		this.getFilename = function() {
			return ( that.parent ) ? that.parent.getFilename() + "/" + that.watchedDir : that.watchedDir;
		}
		this.setFilename = function( f ) {
			that.watchedDir = f;
		}
		this.getParent = function() {
			return that.parent;
		}
		this.setParent = function( p ) {
			that.parent = p;
		}
		this.isWatching = function() {

			// if reservedWatcherSpot is true it means that we only temporarily have given up the watching
			// but we intend to watch again right away
			return ( that.watcher != null || that.reservedWatcherSpot );
		}
		this.getDirHandlerByPath = function( path ) {
			var watchedPath = that.getFilename();
			var subpath = path.replace( watchedPath, "" );
			if ( subpath.indexOf( "/" ) == 0 ) {
				subpath = subpath.substring( 1 );
			}
			var split = subpath.split( "/" );
			if ( split.length == 1 ) {

				// this must be it, the final dir
				return that;
			} else {

				// we must go on
				var firstElementPath = watchedPath + "/" + split.shift();
				for ( var i = 0; i < that.handlerList.length; i++ ) {
					var handler = that.handlerList[i];
					if ( firstElementPath == handler.getFilename() ) {
						if ( handler.isDir() ) {
							return handler.getDirHandlerByPath( path );
						} else {

							// should never happen
							logger.error( nls.watcher_restart2, path );
							return null;
						}
					}
				}
				logger.error( nls.watcher_restart3, path );
			}
			return null;
		}
/*
		this._getFileHandlerByPath = function( path ) {
			for ( var i = 0; i < that.handlerList.length; i++ ) {
				if ( that.handlerList[i].getFilename() == path ) {
					return that.handlerList[i];
				}
			}
			return null;
		};
*/
		this._deleteFileHandler = function( handler ) {
			for ( var i = 0; i < that.handlerList.length; i++ ) {
				if ( that.handlerList[i] == handler ) {
					that.handlerList.splice( i, 1 );
					break;
				}
			}
		};
		this._createWatcher = function( watchedPath, releaseReservedSpot ) {
			watchActivation( that, watchedPath, releaseReservedSpot );
		};
		this._deleteWatcher = function( selfOnly, reserveSpot ) {
			watchDeactivation( that, reserveSpot );

			if ( !selfOnly ) {

				// also also remove all watchers from my children
				for ( var i = 0; i < that.handlerList.length; i++ ) {
					that.handlerList[i]._deleteWatcher();
				}
			}
		};
		this._addFileHandler = function( handler ) {
			that.handlerList.push( handler );
			handler.setParent( that );
		};

	};

	// watchedFile is only the filename
	var FileHandler = function( watchedFile, parent ) {
		this.watchedFile = watchedFile;
		this.watcher = null;
		this.parent = parent;

		var that = this;

		this.walk = function() {
			var watchedPath = that.getFilename();
			watchActivation( that, watchedPath );
		};

		this.handle = function( event, path ) {
			var watchedPath = that.getFilename();

			//if (iSkipWatching>0) {
				// skip
			//	logger.finest("Event: '%s' Path: '%s' ", event, watchedPath);
			//	logger.finer("Recognized file changes, but skipping as requested.");
			//	clearDelayedExecution(that);
				// In the resolve merge conflict case we are deleting files and we need to update
				// the registered pathwatchers in this case
				//if (event=="delete") {
				//	handleDelete(watchedPath, that, true); // true suppresses the event emit
				//}
			//}
			//else {
				path = utils.convertPath( path );
				logger.finest( "Immediate: Event: '%s' WatchedPath: '%s' Path: '%s' Skip: '%d'", event, watchedPath, path, iSkipWatching );
				delayedExecution( that, { "path":path, "event":event, "skip": iSkipWatching }, function( data ) {
					logger.finest( "Delayed: Event: '%s' WatchedPath: '%s' Path: '%s' Skip: '%d'", data.event, watchedPath, data.path, data.skip );
					if ( data.event == "change" ) {
						emit( data.skip, "change", watchedPath, that.isDir() );
					} else if ( data.event == "delete" ) {
						handleDelete( data.skip, watchedPath, that );
					} else if ( data.event == "rename" ) {
						handleRename( data.skip, data.path, watchedPath, that );
					}
				} );

			//}
		};

		this.isDir = function() {
			return false;
		};
		this.getFilename = function() {
			return that.parent.getFilename() + "/" + that.watchedFile;
		}
		this.setFilename = function( f ) {
			that.watchedFile = f;
		}
		this.getParent = function() {
			return that.parent;
		}
		this.setParent = function( p ) {
			that.parent = p;
		}
		this._deleteWatcher = function() {
			watchDeactivation( that );
		}
	};

	// This is only for the Windows bug in Pathwatcher, but we do it on every platform
	// to make sure the code works. The limit is only applied to windows in the end
	config.forceWatch = config.forceWatch || [];
	for ( var i = 0; i < config.forceWatch.length; i++ ) {
		config.forceWatch[i] = utils.convertPath( config.forceWatch[i] );
	};
	var folders = getFoldersSortedByDepthLast( startDir ),
		splitFolderMap = getSplitWatcherMap( folders ),
		disallowedFolders = splitFolderMap.disallowed;
	allowedWatcherMap = splitFolderMap.allowed;

	rootHandler = new DirHandler( startDir );
	rootHandler.walk();

	// enable normal watching mode again
	allowedWatcherMap = null;
	if ( disallowedFolders.length > 0 ) {
		logger.warn( nls.watcher_win_toomany_folders_start );
		for ( var i = 0; i < disallowedFolders.length; i++ ) {
			logger.info( disallowedFolders[i] );
		}
		logger.info( " " );
		logger.info( nls.watcher_forcewatch_info, config.localDir );
		logger.info( " " );
	}

	deferred.resolve( this );

	// Possible event names:
	// - rename with parameters: oldPath, newPath
	// - change with parameter : path
	// - delete with parameter : path
	// - add    with parameter : path
	this.on = function( event, callback ) {
		onCallbacks[event] = callback;
		return this;
	};

	this.startSkipWatching = function() {
		iSkipWatching++;
		logger.finest( "Starting to skip watching file changes. Count: %s", iSkipWatching );
	}

	this.endSkipWatching = function() {
		iSkipWatching--;
		logger.finest( "Stopping to skip watching file changes. Count: %s", iSkipWatching );
	}

	this.isSkipWatching = function() {
		return iSkipWatching > 0;
	}

	this.unwatch = function() {
		logger.finest( "Unwatching %s", startDir );
		rootHandler._deleteWatcher();
	}

};

function initWatcher( config ) {
	var deferred = Q.defer();

	if ( initPathWatcher() ) {
		new Watcher( config.localDir, config, deferred );
		if ( getProcessPlatform() == "win32" ) {
			logger.warn( nls.watcher_windows_1 );
			logger.info( nls.watcher_windows_2 );
		}
	} else {
		logger.warn( nls.watcher_unable_1 );
		logger.info( nls.watcher_unable_2 );
		logger.info( nls.watcher_unable_3, getProcessPlatform(), getProcessArch() );
		deferred.reject( null );
	}

	return deferred.promise;
}

exports.watch = function( config ) {
	return initWatcher( config );
}
