/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	path = require( "path" ),
	rimraf = require( "rimraf" ),
	should = require( "should" ),
	rewire = require ( "rewire" ),
	main = rewire( "../lib/main" ),
	sync = rewire( "../lib/sync" ),
	watcher = rewire( "../lib/watcher" ),
	syncUtils = require( "../lib/utils" );

main.__set__( "sync", sync );
sync.__set__( "watcher", watcher );

// replacing the backslashes with forward slashes is important for it to work on windows
var TEST_SYNC_POINT = path.normalize( __dirname + "/../build/test-sync-point" ).replace( /\\/g, "/" ),
	TEST_TEMP_DIR = path.normalize( __dirname + "/../build/temp" ).replace( /\\/g, "/" );

var originalUncaughtExceptionHandling = main.__get__( "uncaughtExceptionHandling" ),
	originalInterruptHandling = main.__get__( "interruptHandling" ),
	originalGetConfigFunction = main.__get__( "getConfig" ),
	cancelSyncFunction = main.__get__( "cancelSync" ),
	originalPlatformFunction,
	originalInitPathWatcher;

main.__set__( "uncaughtExceptionHandling", function() {

	// empty
} );

exports.getSyncModule = function() {
	return main;
}

exports.getUncaughtExceptionHandlingFunction = function() {
	return originalUncaughtExceptionHandling;
}

exports.getInterruptHandlingFunction = function() {
	return originalInterruptHandling;
}

exports.setBackgroundSyncTimeoutInMillis = function( ms ) {
	main.__set__( "getConfig", function( localDir ) {
		var ret = originalGetConfigFunction( localDir );
		ret.syncIntervalMillis = ms;
		return ret;
	} );
}

exports.resetBackgroundSyncTimeout = function( ) {
	main.__set__( "getConfig", originalGetConfigFunction );
}

exports.setPlatform = function( platform ) {
	originalInitPathWatcher = watcher.__get__( "initPathWatcher" );
	originalPlatformFunction = watcher.__get__( "getProcessPlatform" );
	watcher.__set__( "initPathWatcher", function() {
		var result = originalInitPathWatcher();
		watcher.__set__( "getProcessPlatform", function() {
			return platform;
		} );
		return result;
	} );
}

exports.resetPlatform = function() {
	watcher.__set__( "getProcessPlatform", originalPlatformFunction );
	watcher.__set__( "initPathWatcher", originalInitPathWatcher );
}

exports.resetLogger = function( done ) {
	syncUtils.resetLogger( done );
}

// this is needed for CLI commands
exports.cancelSync = function() {
	cancelSyncFunction();
}

exports.requestCancel = function( emitter, done ) {

	// we first need to wait for 2500ms because the idle timer is 2seconds and only then can we be sure that we can cancel out
	setTimeout( function() {

		// Request cancel, which means that we unwatch all files as well.
		// As we don't know how long it takes we have to assume that it is done after 500ms
		emitter.emit( "request_cancel" );
		setTimeout( function() {
			done();
		}, 500 );
	}, 2500 );
}

function createSyncPoint( callback ) {
	deleteFolderRecursive( TEST_SYNC_POINT, function() {
		mkdirRecursive( TEST_SYNC_POINT );
		callback();
	} );
	return TEST_SYNC_POINT;
}
exports.createSyncPoint = createSyncPoint;

function createSyncPointWithContent( content, callback ) {
	deleteFolderRecursive( TEST_SYNC_POINT, function() {
		mkdirRecursive( TEST_SYNC_POINT );
		copyFolderRecursive( __dirname + "/resources/" + content, TEST_SYNC_POINT );
		callback();
	} );
	return TEST_SYNC_POINT;
}
exports.createSyncPointWithContent = createSyncPointWithContent;

function cleanupSyncPoint( callback ) {
	deleteFolderRecursive( TEST_SYNC_POINT, callback );
}
exports.cleanupSyncPoint = cleanupSyncPoint;

function createTempDir( callback ) {
	deleteFolderRecursive( TEST_TEMP_DIR, function() {
		mkdirRecursive( TEST_TEMP_DIR );
		callback();
	} );
	return TEST_TEMP_DIR;
}
exports.createTempDir = createTempDir;

function createTempDirWithContent( content, callback ) {
	deleteFolderRecursive( TEST_TEMP_DIR, function() {
		mkdirRecursive( TEST_TEMP_DIR );
		copyFolderRecursive( __dirname + "/resources/" + content, TEST_TEMP_DIR );
		callback();
	} );
	return TEST_TEMP_DIR;
}
exports.createTempDirWithContent = createTempDirWithContent;

function cleanupTempDir( callback ) {

	deleteFolderRecursive( TEST_TEMP_DIR, callback );
}
exports.cleanupTempDir = cleanupTempDir;

exports.asyncCheck = function( done, f ) {
	try {
		f();
		done();
	} catch ( e ) {
		done( e );
	}
}

/*
	Total      : 17
	Uploaded   : 8
	Downloaded : 9
	Deleted    : 0 / 0 (Local/Remote)
	Conflicts  : 0 / 0 (Resolved)
	No Action  : 0
	Errors     : 0
*/
exports.assertSyncReport = function( /*string*/ actual, /*object*/expected ) {
	if ( typeof expected.total != "undefined" ) {
		actual.should.containEql( "Total      : " + expected.total );
	}
	if ( typeof expected.uploaded != "undefined" ) {
		actual.should.containEql( "Uploaded   : " + expected.uploaded );
	}
	if ( typeof expected.downloaded != "undefined" ) {
		actual.should.containEql( "Downloaded : " + expected.downloaded );
	}
	if ( typeof expected.deletedLocale != "undefined" ) {
		actual.should.containEql( "Deleted    : " + expected.deletedLocale + " / " + expected.deletedRemote );
	}
	if ( typeof expected.conflicts != "undefined" ) {
		actual.should.containEql( "Conflicts  : " + expected.conflicts + " / " + expected.conflictsResolved );
	}
	if ( typeof expected.noaction != "undefined" ) {
		actual.should.containEql( "No Action  : " + expected.noaction );
	}
	if ( typeof expected.errors != "undefined" ) {
		actual.should.containEql( "Errors     : " + expected.errors );
	}
}

exports.addExpectedCount = function( operation, expected ) {
	if ( !expected.upload ) {
		expected.upload = 0;
	}
	if ( !expected.rename ) {
		expected.rename = 0;
	}
	if ( !expected.delete ) {
		expected.delete = 0;
	}

	if ( operation == "create" || operation == "update" ) {
		expected.upload++;
	} else if ( operation == "delete" ) {
		expected.delete++;
	} else if ( operation == "rename" ) {

		// on linux the rename operation is recognized as delete and create
		if ( process.platform == "linux" ) {
			expected.upload++;
			expected.delete++;
		} else {
			expected.rename++;
		}
	} else if ( operation == "move" ) {

		// on windows and linux the move operation is recognized as delete in one folder and create in another folder
		if ( process.platform == "win32" || process.platform == "linux" ) {
			expected.upload++;
			expected.delete++;
		} else {
			expected.rename++;
		}
	}
}

function captureStream( stream ) {
	var oldWrite = stream.write;
	var buf = "";
	stream.write = function( chunk, encoding, callback ) {
		buf += chunk.toString();

		// chunk is a String or Buffer
		oldWrite.apply( stream, arguments );
	}

	return {
		unhook: function unhook() {
			stream.write = oldWrite;
		},
		captured: function() {
			return buf;
		}
	};
}
exports.captureStream = captureStream;

var mkdirRecursive = function( path ) {
	path = ( path ) ? path.replace( /\\/g, "/" ) : path;

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

var renameSyncNoExec = function( oldPath, newPath ) {
	try {
		fs.renameSync( oldPath, newPath );
	} catch ( e ) {
	}
}

exports.renameSyncNoExec = renameSyncNoExec;

var unlinkSyncNoExec = function( filename ) {
	try {
		fs.unlinkSync( filename );
	} catch ( e ) {
	}
}

exports.unlinkSyncNoExec = unlinkSyncNoExec;

var deleteFolderRecursive = function( path, callback ) {
	rimraf( path, callback );
	/*
	if ( fs.existsSync( path ) ) {
		fs.readdirSync( path ).forEach( function( file, index ) {
			var curPath = path + "/" + file;

			// recurse
			if ( fs.lstatSync( curPath ).isDirectory() ) {
				deleteFolderRecursive( curPath );
			} else {

				// delete file
				fs.unlinkSync( curPath );
			}
		} );
		fs.rmdirSync( path );
	}
	*/
};

exports.deleteFolderRecursive = deleteFolderRecursive;

var copyFolderRecursive = function( fromDir, toDir ) {
	if ( !fs.existsSync( toDir ) ) {
		mkdirRecursive( toDir );
	}
	fs.readdirSync( fromDir ).forEach( function( file, index ) {
		var curPathFrom = fromDir + "/" + file;
		var curPathTo = toDir + "/" + file;

		// recurse
		if ( fs.lstatSync( curPathFrom ).isDirectory() ) {
			copyFolderRecursive( curPathFrom, curPathTo );
		} else {

			// copy file
			fs.writeFileSync( curPathTo, fs.readFileSync( curPathFrom ) );

			// this is asynch
			//fs.createReadStream( curPathFrom ).pipe( fs.createWriteStream( curPathTo ) );
		}
	} );
};

exports.copyFolderRecursive = copyFolderRecursive;

exports.updateFile = function( filename, prefixString ) {
	var text = fs.readFileSync( filename );
	text = prefixString + text;
	fs.writeFileSync( filename, text );

}
