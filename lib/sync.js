/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var webdav = require( "./webdav.js" ),
	hash = require( "./hash.js" ),
	utils = require( "./utils.js" ),
	watcher = require( "./watcher.js" ),
	Q = require( "q" ),
	fs = require( "graceful-fs" ),
	util = require( "util" ),
	events = require( "events" ),
	notifier = require( "node-notifier" ),
	nls = utils.loadNls(),
	notifyIcon = __dirname + "/images/notify.png",
	conflictIcon = __dirname + "/images/exclamation-yellow.png",
	errorIcon = __dirname + "/images/x-red.png";

var HTTP_NOT_FOUND = 404,
	MODE_TWOWAY = 0, MODE_PULL = 1, MODE_PUSH = 2,
	SUFFIX_CONFLICT = ".conflict",
	SUFFIX_RESOLVE = ".resolve",
	SUFFIX_DELETE = ".delete";

function hasConflict( filename ) {
	var conflictFile = filename + SUFFIX_CONFLICT;
	return fs.existsSync( conflictFile );
}

function takeResolveAction( filename ) {
	return hasResolved( filename ) || hasDeleted( filename );
}

function hasResolved( filename ) {
	var resolvedFile = filename + SUFFIX_RESOLVE;
	return fs.existsSync( resolvedFile );
}

function hasDeleted( filename ) {
	var deletedFile = filename + SUFFIX_DELETE;
	return fs.existsSync( deletedFile );
}

function deleteConflictFile( filename ) {
	var conflictFile = filename + SUFFIX_CONFLICT;
	return fs.unlinkSync( conflictFile );
}

var SyncProcess = function( _config, _eventEmitter ) {

	var logger = utils.getLogger(),
		that = this,
		connection = null,
		hashContext = null,
		globalWatcher = null,
		config = _config,
		eventEmitter = _eventEmitter || new events.EventEmitter(),
		cancelRequested = false;

	this.getEventEmitter = function() {
		return eventEmitter;
	}

	// "constructor"
	eventEmitter.on( "request_cancel", cancelSync );
	eventEmitter.on( "conflict_resolve", function( param ) {
		resolveConflict( param ).then( function() {
		}, function( err ) {
			logger.error( err );
		} );
	} );

	var backgroundSyncHandler = new function() {

		// if >0 then we skip background sync
		var iSkipBackgroundSync = 0,
			backgroundSyncHandle;

		this.backgroundSync = function( mode, ms ) {
			if ( config.syncIntervalMin > 0 ) {
				eventEmitter.emit( "status", "waiting_for_sync" );
				logger.info( nls.sync_background_start, config.syncIntervalMin );
				_backgroundSync( mode, ms );
			} else {
				logger.info( nls.sync_background_disabled );
				logger.info( " " );
			}
		};

		function _backgroundSync( mode, ms ) {
			backgroundSyncHandle = setTimeout( function() {
				backgroundSyncHandle = null;
				var skipWatching = ( globalWatcher ) ? globalWatcher.isSkipWatching() : false;

				// make sure we don't run this twice.
				if ( !skipWatching && !iSkipBackgroundSync ) {
					that.sync( mode, false, true ).then( function() {

						// all is well
					}, function( err ) {
						logger.error( err );
					} ).done();
				} else {

 					// otherwise restart timer and try in a second
					_backgroundSync( mode, 1000 );
				}
			}, ( ms ) ? ms : config.syncIntervalMillis );
		}

		this.cancel = function() {
			if ( backgroundSyncHandle ) {
				clearTimeout( backgroundSyncHandle );
			}
		};

		this.hold = function() {
			iSkipBackgroundSync++;
		};

		this.release = function( immediately ) {
			if ( immediately ) {
				iSkipBackgroundSync--;
				if ( iSkipBackgroundSync == 0 ) {
					eventEmitter.emit( "status", "idle" );
					logger.info( " " );
					logger.info( nls.sync_idle );
				}
			} else {

				// we release with a ten second delay so avoid race conditions
				setTimeout( function() {
					iSkipBackgroundSync--;
					if ( iSkipBackgroundSync == 0 ) {
						eventEmitter.emit( "status", "idle" );
						logger.info( " " );
						logger.info( nls.sync_idle );
					}
				}, 2000 );
			}
		};
	};

	function cancelSync() {
		cancelRequested = true;
		if ( connection ) {
			connection.cancelAll();
		}
		if ( globalWatcher ) {
			globalWatcher.unwatch();
		}
		backgroundSyncHandler.cancel();
	}

	function isCanceled() {
		return cancelRequested;
	}

	// mode 			= one of the MODE_* variables
	// autowatch 		= if true, the system tries to watch files in the background
	// bBackgroundSync 	= if true, we restart the sync method again after the configured interval
	this.sync = function( mode, autowatch, bBackgroundSync ) {
		var deferred = Q.defer(),
			remoteFileMap = {},
			childenCountMap = {};

		if ( ( mode != MODE_TWOWAY ) && ( mode != MODE_PULL ) && ( mode != MODE_PUSH ) ) {
			deferred.reject( nls.sync_invalid_mode );
			return deferred.promise;
		}

		hashContext = hash.initHashContext( config.localDir );
		var reportContext = {

			// total number of files synchronized
			total: 0,

			// number of files uploaded
			upload: 0,

			// number of files downloaded
			download: 0,

			// number of files deleted locally
			deleteLocal: 0,

			// number of files deleted remotely
			deleteRemote: 0,

			// number of conflicts
			conflict: 0,

			// number of resolved conflicts
			conflictResolved: 0,

			// number of files without action
			noop: 0,

			// number of errors
			errors: 0

		};

		// in case a watcher is already created we make sure it doesn't record any events for the sync process
		if ( globalWatcher ) globalWatcher.startSkipWatching();
		backgroundSyncHandler.hold();

		var recurse = function( parentEntry, entries ) {
			var promiseArray = [],
				parentFilename;
			if ( parentEntry ) {
				parentFilename = config.localDir + parentEntry.path.replace( config.basePath, "" ) + parentEntry.name;
				childenCountMap[parentFilename] = entries.length;
			}
			for ( var i = 0; i < entries.length; i++ ) {
				if ( isCanceled() ) {
					break;
				}
				var entry = entries[i],
					filename = config.localDir + entry.path.replace( config.basePath, "" ) + entry.name,
					baseFilename = filename.replace( config.localDir + "/", "" );
				logger.finest( "Found remote entry: '%s' (Dir: %s)", baseFilename, entry.dir );
				remoteFileMap[baseFilename] = entry;
				if ( entry.dir ) {

					// need to remember the entry, otherwise it is overwritten through the loop
					( function( entry ) {
 						var filename = config.localDir + entry.path.replace( config.basePath, "" ) + entry.name;
						promiseArray.push( entry.list().then( function( entries ) {
							return recurse( entry, entries );
						} ).then( function( data ) {

							// if the local file does not exist, we delete the folder if there is no file/dir in it
							if ( !fs.existsSync( filename ) ) {
								return entry.list().then( function( entries ) {
									if ( entries.length == 0 ) {
										return deleteFileRemote( filename, true, hashContext, false );
									}
								} );
							} else {
								var lastModified = new Date( entry.lastModified );
								logger.finest( "Setting last modified of '%s' to '%s'", filename, lastModified );
								fs.utimesSync( filename, lastModified, lastModified );
							}
						} ) );
					} )( entry );
				} else {

					// need to remember the entry, otherwise it is overwritten through the loop
					( function( entry ) {

 						// update report context
						reportContext.total++;
 						var d = Q.defer();
						handleFileSync( entry, hashContext, mode, false, reportContext ).then( function() {
							d.resolve();
						}, function( err ) {
							logger.error( err );

							// update report
							reportContext.errors++;

							// we log the error but continue with the overall process
							d.resolve();
 						} ).catch( function( err ) {
							d.reject( err );
						} ).done();
						promiseArray.push( d.promise );
					} )( entry );
				}
			};
			return Q.allSettled( promiseArray );
		};

		var recurseLocale = function( filename ) {
			var deferred = Q.defer(),
				promiseArray = [],
				list = utils.readDirSyncFilter( filename, config );
			for ( var i = 0; i < list.length; i++ ) {
				if ( isCanceled() ) {
					break;
				}
				var path = filename + "/" + list[i],
					baseFilename = path.replace( config.localDir + "/", "" )
				if ( fs.existsSync( path ) && fs.lstatSync( path ).isDirectory() ) {
					logger.finest( "Processing local directory: '%s'", baseFilename );

					// need to remember the entry, otherwise it is overwritten through the loop
					( function( path ) {

 						// we only check if the remote directory does not exist when
						// we did not come across this directory already on the download
						if ( !remoteFileMap[baseFilename] ) {
							logger.finest( "Was not yet processed as part of the remote sync (Phase 1)" );
							var basePath = path.replace( config.localDir + "/", "" );

							// now we check if that directory exists remotely
							promiseArray.push( connection.exists( basePath ).then( function( data ) {
								if ( data.exists ) {

									//logger.finest("Directory did exist locally. We continue down the tree to see if there are more missed files locally. ('%s')", baseFilename);
									// yes, it exists, so continue normally
									return recurseLocale( path );
								} else {
									logger.finer( "Directory does not exist locally. Creating directory. ('%s')", baseFilename );

									// no it does not exist, so create dir first, then continue
									return connection.createDir( basePath ).then( function() {
										return recurseLocale( path ).then( function( ) {

											// however, after creating the folder we also have to clean it up
											// so we delete the folder if there is no file/dir in it
											var list = fs.readdirSync( path );
											if ( list.length == 0 ) {
												fs.rmdirSync( path );
												logger.info( nls.sync_delete_dir_complete, basePath );
											}
										} );

									}, function( err ) {
										logger.error( err );
									} );
								}
							}, function( err ) {
								logger.error( err );
							} ) );
						} else {

							//logger.finest("Was already processed as part of the remote sync (Phase 1)");
							//logger.finest("We continue down the tree to see if there are more missed files locally");
							promiseArray.push( recurseLocale( path ) );
						}
					} )( path );
				} else {
					if ( remoteFileMap[baseFilename] ) {

						// we already handled this file
						continue;
 					}
					logger.finest( "Processing local file: '%s'", baseFilename );
					remoteFileMap[baseFilename] = true;

					// need to remember the entry, otherwise it is overwritten through the loop
					( function( path ) {

						// update report context
						reportContext.total++;
 						var d = Q.defer();
						handleFileSyncFromDisk( path, hashContext, mode, false, reportContext ).then( function() {
							d.resolve();
						}, function( err ) {
							logger.error( err );

							// we log the error but continue with the overall process
							d.resolve();
 						} ).catch( function( err ) {
							d.reject( err );
						} ).done();
						promiseArray.push( d.promise );
					} )( path );
				}
			}
			Q.allSettled( promiseArray ).then( function() {
				deferred.resolve();
			}, function( err ) {
				deferred.reject( err );
			} );
			return deferred.promise;
		}

		eventEmitter.emit( "status", "sync", "start" );
		var text;
		if ( mode == MODE_TWOWAY ) {
			logger.info( nls.sync_2way_phase_1 );
			text = nls.sync_2way_notification;
		} else if ( mode == MODE_PULL ) {
			logger.info( nls.sync_pull_phase_1 );
			text = nls.sync_pull_notification;
		} else {
			logger.info( nls.sync_push_phase_1 );
			text = nls.sync_push_notification;
		}
		notifier.notify( {
			title: text + " [" + config.scope + "]",
			message: nls.sync_notification_subtitle,
			icon: notifyIcon
		}, function( err, response ) {

			// response is response from notification
		} );

		config.localDir = utils.convertPath( config.localDir );
		if ( !fs.existsSync( config.localDir ) ) fs.mkdirSync( config.localDir );
		connection = webdav.createConnection( config );
		connection.list().then( function( entries ) {
			return recurse( null, entries );
		} ).then( function() {
			logger.info( nls.sync_phase2 );
			recurseLocale( config.localDir ).then( function() {
				hash.writeHashContext( config.localDir, hashContext, remoteFileMap );

				if ( globalWatcher ) globalWatcher.endSkipWatching();

				if ( isCanceled() ) {
					deferred.reject( nls.sync_phase2 );
					return;
				}
				logger.info( nls.sync_complete );
				logger.info( " " );
				printReport( reportContext );

				var deferred2 = Q.defer();
				var description = nls.sync_complete_subtitle;
				if ( autowatch ) {
					watch().then( function() {
						eventEmitter.emit( "status", "watching_files" );
						description += nls.sync_complete_subtitle2;
						deferred2.resolve();
					}, function( err ) {
						logger.finest( err );

						// we continue in either case
						deferred2.resolve();
					} ).done();
				} else {
					deferred2.resolve();
				}
				deferred2.promise.then( function() {
					backgroundSyncHandler.release( true );
					eventEmitter.emit( "status", "sync", "complete" );
					notifier.notify( {
						title: utils.format( nls.sync_notification_sync_complete, config.scope ),
						message: description,
						icon: notifyIcon
					}, function( err, response ) {

						// response is response from notification
					} );

					if ( bBackgroundSync ) {

						// start background sync
						backgroundSyncHandler.backgroundSync( mode );
					}

					deferred.resolve();
				}, errorHandler ).catch( errorHandler );
			}, errorHandler ).catch( errorHandler );
		}, errorHandler ).catch( errorHandler );

		function errorHandler( err ) {
			eventEmitter.emit( "status", "sync", "error" );
			if ( globalWatcher ) globalWatcher.endSkipWatching();
			backgroundSyncHandler.release( true );
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function printReport( r ) {
		logger.info( nls.sync_report,
			r.total, r.upload, r.download, r.deleteLocal, r.deleteRemote, r.conflict, r.conflictResolved, r.noop, r.errors );
		if ( r.errors ) {
			logger.warn( nls.sync_error_happened );
		}
	}

	function uploadDirFromDisk( filename, hashContext, notify ) {
		var deferred = Q.defer(),
			baseFilename = filename.replace( config.localDir + "/", "" ),
			displayPath = ( baseFilename.charAt( 0 ) == "/" ) ? baseFilename.substring( 1 ) : baseFilename;

		uploadDir( filename, hashContext ).then( function() {
			if ( notify ) {
				notifier.notify( {
					title: utils.format( nls.sync_notification_upload_complete, config.scope ),
					message: displayPath,
					icon: notifyIcon
				}, function( err, response ) {

					// response is response from notification
				} );
			}
			deferred.resolve();
		}, errorHandler ).catch( errorHandler ).done();
		function errorHandler( err ) {
			if ( notify ) {
				notifier.notify( {
					title: utils.format( nls.sync_notification_upload_error, ( ( err && err.statusCode ) ? "(" + err.statusCode + ") " : "" ), config.scope ),
					message: baseFilename,
					icon: errorIcon
				}, function( err, response ) {

					// response is response from notification
				} );
			}
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function uploadDir( filename, hashContext ) {
		var baseFilename = filename.replace( config.localDir + "/", "" );
		logger.finer( "Creating directory: " + baseFilename );

		return connection.createDir( baseFilename ).then( function() {
			logger.info( nls.sync_dir_created, baseFilename );
			var promiseArray = [];
			var list = utils.readDirSyncFilter( filename, config );
			for ( var i = 0; i < list.length; i++ ) {
				var path = filename + "/" + list[i];
				if ( fs.lstatSync( path ).isDirectory() ) {
					promiseArray.push( uploadDir( path, hashContext ) );
				} else {
					promiseArray.push( uploadFileFromDisk( path, hashContext, false ) );
				}
			}
			return Q.allSettled( promiseArray );
		} );
	}

	function uploadFileFromDisk( filename, hashContext, notify, forceUpload ) {
		var baseFilename = filename.replace( config.localDir + "/", "" ),
			localContent = fs.readFileSync( filename );
			localHash = hash.generateHashFromContent( localContent ),
			entry = connection.createFile( baseFilename );
		return uploadFile( entry, filename, baseFilename, localContent, localHash, hashContext, notify, forceUpload );
	}

	function uploadFile( entry, filename, baseFilename, localContent, localHash, hashContext, notify, forceUpload ) {
		var deferred = Q.defer(),
			displayPath = ( baseFilename.charAt( 0 ) == "/" ) ? baseFilename.substring( 1 ) : baseFilename,
			_hasConflict = hasConflict( filename );
		if ( _hasConflict && !forceUpload ) {
			logger.info( nls.sync_upload_skip, displayPath );
			deferred.resolve();
		} else {
			if ( _hasConflict ) {

				// delete file at this point
				deleteConflictFile( filename );
			}
			eventEmitter.emit( "status", "upload", "start" );

			// this is the only double info we give because upload may take longer
			logger.info( nls.sync_upload_start, displayPath );

 			entry.write( localContent ).then( function() {
				logger.info( nls.sync_upload_complete, displayPath );

				// add hash for later usage
				hash.addHashToContextDirect( hashContext, localHash, baseFilename );
 				if ( notify ) {
					notifier.notify( {
						title: utils.format( nls.sync_notification_upload_complete, config.scope ),
						message: displayPath,
						icon: notifyIcon
					}, function( err, response ) {

						// response is response from notification
					} );
				}
				eventEmitter.emit( "status", "upload", "complete" );
				deferred.resolve();
			}, errorHandler ).catch( errorHandler ).done();
		}
		function errorHandler( err ) {
			eventEmitter.emit( "status", "upload", "error" );
			if ( notify ) {
				notifier.notify( {
					title: utils.format( nls.sync_notification_upload_error, ( ( err && err.statusCode ) ? "(" + err.statusCode + ") " : "" ), config.scope ),
					message: displayPath,
					icon: notifyIcon
				}, function( err, response ) {

					// response is response from notification
				} );
			}
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function deleteFileRemote( filename, isDir, hashContext, notify, forceDelete ) {
		var deferred = Q.defer();
		var baseFilename = filename.replace( config.localDir + "/", "" );

		if ( hasConflict( filename ) && !forceDelete ) {
			logger.info( ( isDir ? nls.sync_delete_dir_skip : nls.sync_delete_file_skip ), baseFilename );
			deferred.resolve();
		} else {
			eventEmitter.emit( "status", "delete", "start" );
			logger.finer( "Deleting remote " + ( isDir ? "directory" : "file" ) + ": " + baseFilename );

			connection.deleteFile( baseFilename ).then( function() {
				logger.info( ( isDir ? nls.sync_delete_dir_complete : nls.sync_delete_file_complete ), baseFilename );

				hash.deleteHashFromContext( hashContext, baseFilename, isDir );
				if ( notify ) {
					notifier.notify( {
						title: utils.format( nls.sync_notification_delete_complete, config.scope ),
						message: baseFilename,
						icon: notifyIcon
					}, function( err, response ) {

						// response is response from notification
					} );
				}
				eventEmitter.emit( "status", "delete", "complete" );
				deferred.resolve();
			}, errorHandler ).catch( errorHandler ).done();
		}
		function errorHandler( err ) {
			eventEmitter.emit( "status", "delete", "error" );
			deferred.reject( err );
		}
		return deferred.promise;
	};

	function deleteFileLocal( filename, hashContext, notify, forceDelete ) {
		var deferred = Q.defer();
		var baseFilename = filename.replace( config.localDir + "/", "" );

		if ( !fs.existsSync( filename ) ) {
			logger.finest( "Skipping file deletion as it doesn't exist: " + baseFilename );
			deferred.resolve();
		} else if ( isCanceled() ) {
			deferred.reject( nls.sync_delete_localfile_cancel );
		} else if ( hasConflict( filename ) && !forceDelete ) {
			logger.info( nls.sync_delete_localfile_skip, baseFilename );
			deferred.resolve();
		} else {
			eventEmitter.emit( "status", "delete", "start" );
			logger.finer( "Deleting local file: " + baseFilename );

			fs.unlink( filename, function( err ) {
				if ( err ) {
					deferred.reject( err );
				} else {
					logger.info( nls.sync_delete_file_complete, baseFilename );
					hash.deleteHashFromContext( hashContext, baseFilename );

					if ( notify ) {
						notifier.notify( {
							title: utils.format( nls.sync_notification_deletelocal_complete, config.scope ),
							message: baseFilename,
							icon: notifyIcon
						}, function( err, response ) {

							// response is response from notification
						} );
					}
					eventEmitter.emit( "status", "delete", "complete" );
					deferred.resolve();
				}
			} );
		}
		return deferred.promise;
	};

	function writeFile( filename, content, lastModified, hashContext, newhash, notify ) {
		var deferred = Q.defer(),
			baseFilename = filename.replace( config.localDir + "/", "" );

		if ( isCanceled() ) {
			deferred.reject( nls.sync_write_cancel );
		} else {
			eventEmitter.emit( "status", "download", "start" );
			logger.finer( "Writing downloaded file to disk: " + baseFilename );
			var path = utils.getPathFromFilename( filename );
			if ( !fs.existsSync( path ) ) {
				logger.finer( "Creating local directory: '%s'", path );
				utils.mkdirRecursive( path );
			}
			fs.writeFile( filename, content, function( err ) {
				if ( err ) {
					eventEmitter.emit( "status", "download", "error" );
					deferred.reject( err );
				} else {
					logger.info( nls.sync_download_complete, baseFilename );
					if ( lastModified ) {
						var dLastModified = new Date( lastModified );
						fs.utimesSync( filename, dLastModified, dLastModified );
					}

					if ( newhash && hashContext ) {

						// add hash for later usage
						hash.addHashToContextDirect( hashContext, newhash, baseFilename );
 					}

					if ( notify ) {
						notifier.notify( {
							title: utils.format( nls.sync_notification_download_complete, config.scope ),
							message: baseFilename,
							icon: notifyIcon
						}, function( err, response ) {

							// response is response from notification
						} );
					}
					eventEmitter.emit( "status", "download", "complete" );
					deferred.resolve();
				}
			} );
		}
		return deferred.promise;
	}

	/**
		jsonData:
		- id          - file to resolve
		- resolveWith - file to resolve it with
		- action      - (upload|delete)
	*/
	function resolveConflict( jsonData, hashContext ) {
		var deferred = Q.defer();
		if ( isCanceled() ) {
			deferred.reject( nls.sync_resolve_cancel );
		} else {
			if ( jsonData.action != "upload" && jsonData.action != "delete" ) {
				logger.warn( nls.sync_resolve_unknown_action, jsonData.action );
				eventEmitter.emit( "status", "conflict_resolve", { "action": "error" } );
				deferred.reject( utils.format( nls.sync_resolve_unknown_action, config.scope ) );
				return deferred.promise;
			}
			logger.finest( "Resolving conflict: Data %j", jsonData );
			if ( globalWatcher ) globalWatcher.startSkipWatching();
			eventEmitter.emit( "status", "conflict_resolve", { "action": "start" } );
			if ( !hashContext ) {
				hashContext = hash.initHashContext( config.localDir );
			}
			var promise = null;

			// if they are different we have to copy the contents
			if ( jsonData.id != jsonData.resolveWith && jsonData.resolveWith != null ) {
				logger.finest( "Copying file from %s to %s", jsonData.resolveWith, jsonData.id );
				promise = utils.copyFile( jsonData.resolveWith, jsonData.id );
			} else {
				promise = Q.fcall( function() { return true; } );
			}
			promise
			.then( function() {
				return utils.unlinkFile( jsonData.id + SUFFIX_RESOLVE )
			} )
			.then( function() {
				return utils.unlinkFile( jsonData.id + SUFFIX_DELETE )
			} )
			.then( function() {
				return utils.unlinkFile( jsonData.id + SUFFIX_CONFLICT )
			} )
			.then( function() {
				if ( jsonData.action == "upload" ) {
					return uploadFileFromDisk( jsonData.id, hashContext, false, true )
					.then( function() {
						logger.info( nls.sync_resolve_complete, jsonData.id );
						var displayFilename = jsonData.id.replace( config.localDir + "/", "" );
						notifier.notify( {
							title: utils.format( nls.sync_notification_merge_complete, config.scope ),
							message: displayFilename,
							icon: notifyIcon
						}, function( err, response ) {

							// response is response from notification
						} );
						hash.writeHashContext( config.localDir, hashContext );
						eventEmitter.emit( "status", "conflict_resolve", { "action": "complete",  "id": jsonData.id } );
						if ( globalWatcher ) globalWatcher.endSkipWatching();
						deferred.resolve();
					} );
				} else if ( jsonData.action == "delete" ) {
					return deleteFileLocal( jsonData.id, hashContext, false )
					.then( function() {
						return deleteFileRemote( jsonData.id, false, hashContext, false );
					} )
					.then( function() {
						logger.info( nls.sync_resolve_complete, jsonData.id );
						var displayFilename = jsonData.id.replace( config.localDir + "/", "" );
						notifier.notify( {
							title: utils.format( nls.sync_notification_merge_complete, config.scope ),
							message: displayFilename,
							icon: notifyIcon
						}, function( err, response ) {

							// response is response from notification
						} );
						hash.writeHashContext( config.localDir, hashContext );
						eventEmitter.emit( "status", "conflict_resolve", { "action": "complete",  "id": jsonData.id } );
						if ( globalWatcher ) globalWatcher.endSkipWatching();
						deferred.resolve();
					} );
				}
			} )
			.catch( function( err ) {
				eventEmitter.emit( "status", "conflict_resolve", { "action": "error" } );
				if ( globalWatcher ) globalWatcher.endSkipWatching();
				deferred.reject( err );
			} ).done();
		}
		return deferred.promise;
	}
	function resolveMergeConflictFromDisk( replaceFile, hashContext ) {

		var resolveFile = replaceFile + SUFFIX_RESOLVE,
			deleteFile = replaceFile + SUFFIX_DELETE;
		if ( hasResolved( replaceFile ) ) {
			return resolveConflict( {
				id: replaceFile,
				resolveWith: resolveFile,
				action: "upload"
			}, hashContext );
		} else {

 			// this is the delete case
			return resolveConflict( {
				id: replaceFile,
				resolveWith: null,
				action: "delete"
			}, hashContext );
		}
	}

	function handleFileSyncFromDisk( filename, hashContext, mode, forceNotification, reportContext ) {
		var deferred = Q.defer(),
			baseFilename = filename.replace( config.localDir + "/", "" );
		eventEmitter.emit( "status", "filesync", "start" );
		connection.getFile( baseFilename, HTTP_NOT_FOUND ).then( function( entry ) {

			//return handleFileSync( entry, hashContext, mode, forceNotification, reportContext );
			return _handleFileSync( entry, hashContext, mode, forceNotification, reportContext );
		} ).then( function() {
			eventEmitter.emit( "status", "filesync", "complete" );
			deferred.resolve();
		}, errorHandler ).catch( errorHandler ).done();
		function errorHandler( err ) {
			eventEmitter.emit( "status", "filesync", "error" );
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function handleFileSync( entry, hashContext, mode, forceNotification, reportContext ) {
		var deferred = Q.defer();
		eventEmitter.emit( "status", "filesync", "start" );
		_handleFileSync( entry, hashContext, mode, forceNotification, reportContext ).then( function() {
			eventEmitter.emit( "status", "filesync", "complete" );
			deferred.resolve();
		}, errorHandler ).catch( errorHandler ).done();
		function errorHandler( err ) {
			eventEmitter.emit( "status", "filesync", "error" );
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function _handleFileSync( entry, hashContext, mode, forceNotification, reportContext ) {
		reportContext = reportContext || {};
		var deferred = Q.defer();
		entry.read( HTTP_NOT_FOUND ).then( function( content ) {

			// content maybe null since we said that HTTP_NOT_FOUND is also a success condition

			var baseFilename = entry.path.replace( config.basePath, "" ) + entry.name,
				displayPath = ( baseFilename.charAt( 0 ) == "/" ) ? baseFilename.substring( 1 ) : baseFilename,
				filename = config.localDir + baseFilename,
				remoteHash = hash.generateHashFromContent( content ),
				localContent, localHash, localSize,
				bFileExists = fs.existsSync( filename ),
				originalRemoteHash = hash.getHashFromContext( hashContext, baseFilename ),
				hasRecognizedConflict = hasConflict( filename ),
				errorHandler = function( err ) {

					// update report
					reportContext.errors++;
					deferred.reject( err );
				};

			// if hasRecognizedConflict is true we want the code to go directly to the else case because this is the
			// conflict resolution

			logger.finer( "Syncing file %s with mode %s", baseFilename, mode );
			if ( bFileExists ) {
				localContent = fs.readFileSync( filename );
				localHash = hash.generateHashFromContent( localContent );
				localSize = fs.statSync( filename )["size"];
			}

			if ( !hasRecognizedConflict && localHash == null && remoteHash == null ) {
				logger.finest( "Local and remote hashes are both null. This may happen if the file was deleted locally and remotely. (" + baseFilename + ")" );
				deferred.resolve();
				return deferred.promise;
			}

			logger.finest( "Handling file sync. Testing all 3 hashes:\nLocal      : %s\nOrig Remote: %s\nRemote     : %s", localHash, originalRemoteHash, remoteHash );
			if ( !hasRecognizedConflict && ( ( remoteHash == originalRemoteHash && localHash == remoteHash ) || ( remoteHash == localHash && remoteHash != originalRemoteHash ) ) ) {

				// the current remote file, the original remote file and the local file are the same
				// ==> no need to take any action
				// or the current remote file and the local file are the same, but the originally downloaded remote file is not
				// ==> for some reason they are now the same again, so we can re-sync the file by updating the hash
				logger.finer( "the current remote file, the original remote file and the local file are the same or the current remote file and the local file are the same, but the originally downloaded remote file is not" );

				/* Avoid too many notifications
				if (forceNotification) {
					notifier.notify({
						title: utils.format(nls.sync_notification_no_update, config.scope),
						message: displayPath,
						icon: notifyIcon
					}, function (err, response) {
						// response is response from notification
					});
				}
				*/

				// add hash for later usage
				hash.addHashToContextDirect( hashContext, localHash, baseFilename );

				// update report
 				reportContext.noop++;
				deferred.resolve();
			} else if ( !hasRecognizedConflict && remoteHash == originalRemoteHash ) {

				// the current remote hash and the file we downloaded originally are the same
				// ==> it means there was no file change remotely and a file change must have happened locally

				logger.finer( "the current remote hash and the file we downloaded originally are the same; it means there was no file change remotely and a file change must have happened locally" );
				if ( localHash == null ) {
					if ( mode == MODE_PULL ) {
						logger.info( "Skipping deleting remote file for " + filename );

						// update report
						reportContext.noop++;
						deferred.resolve();
					} else {

						// the file was deleted locally, so we delete it remotely now
						logger.finer( "the file was deleted locally, so we delete it remotely now" );
						deleteFileRemote( filename, false, hashContext, forceNotification ).then( function() {

							// update report
							reportContext.deleteRemote++;
 							deferred.resolve();
						}, errorHandler ).catch( errorHandler ).done();
					}
				} else {
					if ( mode == MODE_PULL ) {
						logger.info( nls.sync_sync_upload_skip, filename );

						// update report
						reportContext.noop++;
						deferred.resolve();
					} else {

						// the current remote file and local file are NOT the same
						// ==> this means the local file changed and we need to upload it
						logger.finer( "the current remote file and local file are NOT the same; this means the local file changed and we need to upload it" );
						uploadFile( entry, filename, baseFilename, localContent, localHash, hashContext, forceNotification ).then( function() {

							// update report
							reportContext.upload++;
							deferred.resolve();
						}, errorHandler ).catch( errorHandler ).done();
					}
				}
			} else if ( !hasRecognizedConflict && localHash == originalRemoteHash ) {

				// the local hash and the file we downloaded originally are the same
				// ==> it means there was no file change locally and a file change must have happened remotely

				logger.finer( "the local hash and the file we downloaded originally are the same; it means there was no file change locally and a file change must have happened remotely" );
				if ( remoteHash == null ) {
					if ( mode == MODE_PUSH ) {
						logger.info( nls.sync_sync_delete_skip, filename );

						// update report
						reportContext.noop++;
						deferred.resolve();
					} else {

						// the file was deleted remotely, so we delete it locally now
						logger.finer( "the file was deleted remotely, so we delete it locally now" );
						deleteFileLocal( filename, hashContext, forceNotification ).then( function() {

							// update report
							reportContext.deleteLocal++;
							deferred.resolve();
						}, errorHandler ).catch( errorHandler ).done();
					}
				} else {

					// the current remote file and local file are NOT the same
					// ==> this means the remote file changed and we need to download it

					if ( mode == MODE_PUSH ) {
						logger.info( nls.sync_sync_download_skip, filename );

						// update report
						reportContext.noop++;
						deferred.resolve();
					} else {
						logger.finer( "the current remote file and local file are NOT the same; this means the remote file changed and we need to download it" );

						// as we already downloaded it we just need to write it to the HD
						writeFile( filename, content, entry.lastModified, hashContext, remoteHash, forceNotification ).then( function() {

							// update report
							reportContext.download++;
							deferred.resolve();
						}, errorHandler ).catch( errorHandler ).done();
					}
				}
			} else {

				// all hashes are different

				function printMergeHelp( filename ) {
					var baseFilename = filename.replace( config.localDir + "/", "" );
					logger.warn( nls.sync_merge_help_1, baseFilename, baseFilename + SUFFIX_RESOLVE );
					logger.warn( nls.sync_merge_help_2 );
				}
				function printMergeHelpDeletedRemotely( filename ) {
					var baseFilename = filename.replace( config.localDir + "/", "" );
					logger.warn( nls.sync_merge_help_deleted_remotely_1 );
					logger.warn( nls.sync_merge_help_deleted_remotely_2 );
					logger.warn( nls.sync_merge_help_deleted_remotely_3, baseFilename, baseFilename + SUFFIX_DELETE );
					logger.warn( nls.sync_merge_help_deleted_remotely_4 );
					logger.warn( nls.sync_merge_help_deleted_remotely_5, baseFilename, baseFilename + SUFFIX_RESOLVE );
					logger.warn( nls.sync_merge_help_deleted_remotely_6 );
				}
				function printMergeHelpDeletedLocally( filename ) {
					var baseFilename = filename.replace( config.localDir + "/", "" );
					logger.warn( nls.sync_merge_help_deleted_locally_1 );
					logger.warn( nls.sync_merge_help_deleted_locally_2 );
					logger.warn( nls.sync_merge_help_deleted_locally_3, baseFilename, baseFilename + SUFFIX_DELETE );
					logger.warn( nls.sync_merge_help_deleted_locally_4 );
					logger.warn( nls.sync_merge_help_deleted_locally_5, baseFilename, baseFilename + SUFFIX_RESOLVE );
					logger.warn( nls.sync_merge_help_deleted_locally_6 );
				}

				if ( takeResolveAction( filename ) ) {

					// there is a resolve or delete file so lets try to fix it
					resolveMergeConflictFromDisk( filename, hashContext ).then( function() {

						// update report
						reportContext.conflictResolved++;
						deferred.resolve();
					}, errorHandler ).catch( errorHandler ).done();

				} else {

					// otherwise we need to check how to proceed

					// if size = 0 and conflict file it means that the file was deleted
					if ( localHash == null || ( localSize === 0 && hasRecognizedConflict ) ) {

						// the local file was deleted AND
						// the originally downloaded remote file and the current remote file have a different hash
						// ==> at this point we really can't tell either way
						// ==> so there are two modes:
						logger.finer( "the local file was deleted and the originally downloaded remote file and the current remote file have a different hash" );
						if ( mode == MODE_PUSH ) {
							logger.finer( "since we are in push mode we delete the remote file" );

							// favoring the local changes means here that we assume the file was deleted locally
							// on purpose and therefore we can delete it remotely
							deleteFileRemote( filename, false, hashContext, forceNotification, true ).then( function() {

								// update report
								reportContext.deleteRemote++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else if ( mode == MODE_PULL ) {
							logger.finer( "since we are in pull mode we download the file" );

							// favoring the remote changes means here that we assume the file was changed remotely
							// on purpose and therefore we download it

							// as we already downloaded it we just need to write it to the HD
							writeFile( filename, content, entry.lastModified, hashContext, remoteHash, forceNotification ).then( function() {

								// update report
								reportContext.download++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else {

							// the current remote file and local file are NOT the same
							// ==> We need to merge
							if ( !hasRecognizedConflict ) {
								var conflictFile = filename + SUFFIX_CONFLICT;
								var resolvedFile = filename + SUFFIX_RESOLVE;
								logger.warn( nls.sync_conflict_local_deleted_1, filename );
								logger.warn( nls.sync_conflict_local_deleted_2 );
								logger.warn( nls.sync_conflict_local_deleted_3, conflictFile );
								printMergeHelpDeletedLocally( filename );

								// as we already downloaded it we just need to write it to the HD
								writeFile( conflictFile, content, entry.lastModified, null, null, false )
								.then( function() {
									return writeFile( filename, "", null, null, null, false )
								} )
								.then( function() {
									eventEmitter.emit( "status", "conflict_recognized", {
										"id": filename,
										"local": null,
										"remote": conflictFile
									} );
									if ( forceNotification ) {
										notifier.notify( {
											title: utils.format( nls.sync_notification_merge_conflict, config.scope ),
											message: displayPath,
											icon: conflictIcon
										}, function( err, response ) {

											// response is response from notification
										} );
									}

									// update report
									reportContext.conflict++;
									deferred.resolve();
								} ).catch( errorHandler ).done();

							} else {

								// conflict file exists, so we skip this
								var conflictFile = filename + SUFFIX_CONFLICT;
								eventEmitter.emit( "status", "conflict_recognized", {
									"id": filename,
									"local": null,
									"remote": conflictFile
								} );
								logger.warn( nls.sync_conflict_outstanding, filename );
								printMergeHelpDeletedLocally( filename );

								// update report
								reportContext.conflict++;
								deferred.resolve();
							}
						}
					} else if ( remoteHash == null ) {

						// the remote file was deleted AND
						// the originally downloaded remote file and the local file have a different hash
						// ==> at this point we really can't tell either way
						// ==> so there are two modes:
						logger.finer( "the remote file was deleted and the originally downloaded remote file and the local file have a different hash" );
						if ( mode == MODE_PUSH ) {
							logger.finer( "since we are in push mode we upload the file" );

							// favoring the local changes means here that we assume the file was changed locally
							// on purpose and therefore we upload it
							uploadFileFromDisk( filename, hashContext, forceNotification, true ).then( function() {

								// update report
								reportContext.upload++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else if ( mode == MODE_PULL ) {
							logger.finer( "since we are in pull mode we delete the local file" );

							// favoring the remote changes means here that we assume the file was deleted remotely
							// on purpose and therefore we delete it locally
							deleteFileLocal( filename, hashContext, forceNotification, true ).then( function() {

								// update report
								reportContext.deleteLocal++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else {

							// the current remote file and local file are NOT the same
							// ==> We need to merge
							if ( !hasRecognizedConflict ) {
								var conflictFile = filename + SUFFIX_CONFLICT;
								var resolvedFile = filename + SUFFIX_RESOLVE;
								logger.warn( nls.sync_conflict_remote_deleted_1, filename );
								logger.warn( nls.sync_conflict_remote_deleted_2 );
								printMergeHelpDeletedRemotely( filename );
								writeFile( conflictFile, "", null, null, null, false )
								.then( function() {
									eventEmitter.emit( "status", "conflict_recognized", {
										"id": filename,
										"local": filename,
										"remote": null
									} );
									if ( forceNotification ) {
										notifier.notify( {
											title: utils.format( nls.sync_notification_merge_conflict, config.scope ),
											message: displayPath,
											icon: conflictIcon
										}, function( err, response ) {

											// response is response from notification
										} );
									}

									// update report
									reportContext.conflict++;
									deferred.resolve();
								} ).catch( errorHandler ).done();

							} else {

								// conflict file exists, so we skip this
								var conflictFile = filename + SUFFIX_CONFLICT;
								eventEmitter.emit( "status", "conflict_recognized", {
									"id": filename,
									"local": filename,
									"remote": null
								} );
								logger.warn( nls.sync_conflict_outstanding, filename );
								printMergeHelpDeletedRemotely( filename );

								// update report
								reportContext.conflict++;
								deferred.resolve();
							}
						}
					} else {

						// the current remote file and local file are NOT the same
						// ==> We need to merge
						if ( mode == MODE_PUSH ) {
							logger.finer( "the current remote file and local file are NOT the same; since we are in push mode we upload the file" );

							// favoring the local changes means here that we assume the file was changed locally
							// on purpose and therefore we upload it
							uploadFileFromDisk( filename, hashContext, forceNotification, true ).then( function() {

								// update report
								reportContext.upload++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else if ( mode == MODE_PULL ) {
							logger.finer( "the current remote file and local file are NOT the same; since we are in pull mode we download the file" );

							// favoring the remote changes means here that we assume the file was changed remotely
							// on purpose and therefore we download it

							// as we already downloaded it we just need to write it to the HD
							writeFile( filename, content, entry.lastModified, hashContext, remoteHash, forceNotification ).then( function() {

								// update report
								reportContext.download++;
								deferred.resolve();
							}, errorHandler ).catch( errorHandler ).done();

						} else {
							logger.finer( "the current remote file and local file are NOT the same; we need to merge" );
							if ( !hasRecognizedConflict ) {
								var conflictFile = filename + SUFFIX_CONFLICT;
								var resolvedFile = filename + SUFFIX_RESOLVE;
								logger.warn( nls.sync_conflict_both_1, filename );
								logger.warn( nls.sync_conflict_both_2 );
								logger.warn( nls.sync_conflict_both_3, conflictFile );
								printMergeHelp( filename );

								//logger.info(localHash+" (local)");
								//logger.info(remoteHash+" (remote)");
								//logger.info(originalRemoteHash+" (originalRemoteHash)");

								// as we already downloaded it we just need to write it to the HD
								writeFile( conflictFile, content, entry.lastModified, null, null, false ).then( function() {

									eventEmitter.emit( "status", "conflict_recognized", {
										"id": filename,
										"local": filename,
										"remote": conflictFile
									} );
									if ( forceNotification ) {
										notifier.notify( {
											title: utils.format( nls.sync_notification_merge_conflict, config.scope ),
											message: displayPath,
											icon: conflictIcon
										}, function( err, response ) {

											// response is response from notification
										} );
									}

									// update report
									reportContext.conflict++;
									deferred.resolve();
								}, errorHandler ).catch( errorHandler ).done();

							} else {

								// conflict file exists, so we skip this
								var conflictFile = filename + SUFFIX_CONFLICT;
								eventEmitter.emit( "status", "conflict_recognized", {
									"id": filename,
									"local": filename,
									"remote": conflictFile
								} );
								logger.warn( nls.sync_conflict_outstanding, filename );
								printMergeHelp( filename );

								// update report
								reportContext.conflict++;
								deferred.resolve();
							}
						}
					}
				}
			}

		}, syncErrorHandler ).catch( syncErrorHandler ).done();
		function syncErrorHandler( err ) {
			deferred.reject( err );
		}
		return deferred.promise;
	}

	function errorHandling( err, command ) {
		var error = err.error;
		if ( util.isArray( error ) ) {
			var codes = "";
			for ( var i = 0; i < error.length; i++ ) {
				logger.error( error[i] );
				if ( i > 0 ) {
					codes += ",";
				}
				codes += error[i].statusCode + ",";
			};

			notifier.notify( {
				title: utils.format( nls.sync_notification_generic_error, "(" + codes + ")", command, config.scope ),
				message: err.filename,
				icon: errorIcon
			}, function( err, response ) {

				// response is response from notification
			} );
		} else {
			logger.error( err );
			notifier.notify( {
				title: utils.format( nls.sync_notification_generic_error, ( ( err && err.statusCode ) ? "(" + err.statusCode + ") " : "" ), command, config.scope ),
				message: err.filename,
				icon: errorIcon
			}, function( err, response ) {

				// response is response from notification
			} );
		}
	}

	function watch() {
		var	deferredDeleteQueue = [],
			deleteFromQueue = function( d ) {
				for ( var i = 0; i < deferredDeleteQueue.length; i++ ) {
					if ( deferredDeleteQueue[i] === d ) {
						deferredDeleteQueue.splice( i, 1 );
						break;
					}
				};
			};

		var handleAdd = function( path, isDir ) {
			var deferred = Q.defer();
			logger.info( ( isDir ? nls.sync_event_add_dir : nls.sync_event_add_file ), path );
			var baseFilename = path.replace( config.localDir + "/", "" );
			if ( !isDir ) {
				handleFileSyncFromDisk( path, hashContext, MODE_TWOWAY, true ).then( function() {
					deferred.resolve();
				}, errorHandlerDir ).catch( errorHandlerDir ).done();
				function errorHandlerDir( err ) {
					deferred.reject( {
						filename: path,
						error: err
					} );
				}
			} else {
				uploadDirFromDisk( path, hashContext, true ).then( function() {
					deferred.resolve();
				}, errorHandlerFile ).catch( errorHandlerFile ).done();
				function errorHandlerFile( err ) {
					deferred.reject( {
						filename: baseFilename,
						error: err
					} );
				}
			}
			return deferred.promise;
		};
		var handleDelete = function( path, isDir ) {
			var deferred = Q.defer(),
				baseFilename = path.replace( config.localDir + "/", "" );
			logger.info( ( isDir ? nls.sync_event_delete_dir : nls.sync_event_delete_file ), path );
			if ( !isDir ) {

				// we need to remember that deferred to make sure we don't delete the directory before all files are finished
				deferredDeleteQueue.push( deferred.promise );

				handleFileSyncFromDisk( path, hashContext, MODE_TWOWAY, true ).then( function() {
					deferred.resolve();
					deleteFromQueue( deferred.promise );
				}, errorHandlerDir ).catch( errorHandlerDir ).done();
				function errorHandlerDir( err ) {
					deferred.reject( {
						filename: path,
						error: err
					} );
					deleteFromQueue( deferred.promise );
				}
			} else {

				// we assume that all files in this directory were already received as event and there isn't one coming in afterwards
				Q.allSettled( deferredDeleteQueue ).then( function( result ) {

					deleteFileRemote( path, isDir, hashContext, true ).then( function() {
						deferred.resolve();
					}, errorHanderFile ).catch( errorHanderFile ).done();

				}, errorHanderFile ).catch( errorHanderFile ).done();
				function errorHanderFile( err ) {
					deferred.reject( {
						filename: baseFilename,
						error: err
					} );
				}
			}
			return deferred.promise;
		};
		var handleRename = function( oldpath, newpath, isDir ) {
			var deferred = Q.defer(),
				split = function( path ) {
					var ret = {},
						idx = path.lastIndexOf( "/" );
					if ( idx != -1 ) {
						ret.path = path.substring( 0, idx + 1 );
						ret.name = path.substring( idx + 1 );
					} else {
						ret.name = path;
					}
					return ret;
				};
			var displayOldPath = oldpath.replace( config.localDir + "/", "" ),
				displayNewPath = newpath.replace( config.localDir + "/", "" );
			logger.info( ( isDir ? nls.sync_event_rename_dir : nls.sync_event_rename_file ), displayOldPath + " => " + displayNewPath );
			if ( hasConflict( oldpath ) ) {
				if ( takeResolveAction( oldpath ) ) {
					resolveMergeConflictFromDisk( oldpath, hashContext ).then( function() {
						deferred.resolve();
					}, errorHandlerConflict ).catch( errorHandlerConflict ).done();
					function errorHandlerConflict( err ) {
						deferred.reject( {
							filename: displayOldPath + " => " + displayNewPath,
							error: err
						} );
					}
				} else {
					logger.info( nls.sync_rename_skip, displayOldPath );
					deferred.resolve();
				}
			} else {
				if ( utils.isHidden( newpath, config ) ) {
					logger.info( nls.sync_ignore_rename, newpath );
					deferred.resolve();
				} else {
					eventEmitter.emit( "status", "rename", "start" );
					connection.renameFile( displayOldPath, displayNewPath ).then( function() {
						var oldName = split( displayOldPath ).name,
							newName = split( displayNewPath ).name,
							text = nls.sync_notification_rename_complete,
							text2 = nls.sync_notification_rename_data_complete;
						if ( oldName == newName ) {
							text = nls.sync_notification_move_complete;
							text2 = nls.sync_notification_move_data_complete;
						}
						hash.renameHashInContext( hashContext, displayOldPath, displayNewPath, isDir );

						logger.info( text2, displayOldPath, displayNewPath );

						notifier.notify( {
							title: text + " [" + config.scope + "]",
							message: displayOldPath + " => " + displayNewPath,
							icon: notifyIcon
						}, function( err, response ) {

							// response is response from notification
						} );
						eventEmitter.emit( "status", "rename", "complete" );
						deferred.resolve();
					}, errorHandlerRename ).catch( errorHandlerRename ).done();
					function errorHandlerRename( err ) {
						eventEmitter.emit( "status", "rename", "error" );
						deferred.reject( {
							filename: displayOldPath + " => " + displayNewPath,
							error: err
						} );
					}
				}
			}
			return deferred.promise;
		};
		var handleChange = function( path, isDir ) {
			var deferred = Q.defer();
			if ( !isDir ) {
				logger.info( nls.sync_event_change_file, path );
				handleFileSyncFromDisk( path, hashContext, MODE_TWOWAY, true ).then( function() {
					deferred.resolve();
				}, errorHandler ).catch( errorHandler ).done();
				function errorHandler( err ) {
					deferred.reject( {
						filename: path,
						error: err
					} );
				}
			} else {

				// SHOULD NEVER HAPPEN
				logger.warn( "Don't know how to handle 'changed' directories!" );
				deferred.resolve();
			}
			return deferred.promise;
		};

		var watchDeferred = Q.defer();
		hashContext = hash.initHashContext( config.localDir );
		watcher.watch( config ).then( function( _watcher ) {
			logger.info( nls.sync_start_watching, config.localDir );

			globalWatcher = _watcher;

			_watcher
			  .on( "add", function( path, isDir ) {
				backgroundSyncHandler.hold();
				handleAdd( path, isDir ).then( function() {
					backgroundSyncHandler.release();
					hash.writeHashContext( config.localDir, hashContext );
				}, function( err ) {
					backgroundSyncHandler.release();
					errorHandling( err, nls.sync_error_command_create );
				} );
			  } )
			  .on( "delete", function( path, isDir ) {
				backgroundSyncHandler.hold();
				handleDelete( path, isDir ).then( function() {
					backgroundSyncHandler.release();
					hash.writeHashContext( config.localDir, hashContext );
				}, function( err ) {
					backgroundSyncHandler.release();
					errorHandling( err, nls.sync_error_command_delete );
				} );
			  } )
			  .on( "change", function( path, isDir ) {
				backgroundSyncHandler.hold();
				handleChange( path, isDir ).then( function() {
					backgroundSyncHandler.release();
					hash.writeHashContext( config.localDir, hashContext );
				}, function( err ) {
					backgroundSyncHandler.release();
					errorHandling( err, nls.sync_error_command_update );
				} );
			  } )
			  .on( "rename", function( oldpath, newpath, isDir ) {
				backgroundSyncHandler.hold();
				handleRename( oldpath, newpath, isDir ).then( function() {
					backgroundSyncHandler.release();
					hash.writeHashContext( config.localDir, hashContext );
				}, function( err ) {
					backgroundSyncHandler.release();
					errorHandling( err, nls.sync_error_command_move );
				} );
			  } )
			  .on( "error",  function( error ) {
				logger.error( "Error happened", error );
			  } );

			watchDeferred.resolve( _watcher );
		}, function( err ) {
			watchDeferred.reject( err );
		} ).done();

		return watchDeferred.promise;
	}
};

var lastSyncProcess = null;

exports.startTwoWaySync = function( config, autowatch, bBackgroundSync, eventEmitter ) {
	var s = lastSyncProcess = new SyncProcess( config, eventEmitter );
	return s.sync( MODE_TWOWAY, autowatch, bBackgroundSync );
}

exports.startPullSync = function( config, autowatch, bBackgroundSync, eventEmitter ) {
	var s = lastSyncProcess = new SyncProcess( config, eventEmitter );
	return s.sync( MODE_PULL, autowatch, bBackgroundSync );
}

exports.startPushSync = function( config, autowatch, bBackgroundSync, eventEmitter ) {
	var s = lastSyncProcess = new SyncProcess( config, eventEmitter );
	return s.sync( MODE_PUSH, autowatch, bBackgroundSync );
}

// purely for testing, tries to cancel the last sync process
exports.cancelSync = function() {
	console.log( "TESTING PURPOSE ONLY - Cancels last SyncProcess..." );
	lastSyncProcess.getEventEmitter().emit( "request_cancel" );
}
