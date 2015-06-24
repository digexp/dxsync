/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "graceful-fs" ),
	crypto = require( "crypto" ),
	utils = require( "./utils.js" );

//var hashMapsByLocalDir = {};

function generateHash( filename ) {
	var content = fs.readFileSync( filename );

	return crypto
		.createHash( "md5" )
		.update( content, "utf8" )
		.digest( "hex" );
}

function generateHashFromContent( content ) {
	if ( content == null ) return null;
	return crypto
		.createHash( "md5" )
		.update( content, "utf8" )
		.digest( "hex" );
}

function readHashMap( localDir ) {
	var hashMap = {};

	// check whether we have it in memory
	//if ( hashMapsByLocalDir[localDir] ) {
	//	hashMap = hashMapsByLocalDir[localDir];
	//} else {
		var logger = utils.getLogger();

		// otherwise read from disk
		var hashfile = localDir + "/.hashes";
		logger.finer( "Reading hash file from disk '%s'", hashfile );
		if ( fs.existsSync( hashfile ) ) {
			try {
				hashMap = JSON.parse( fs.readFileSync( hashfile ) );
			}
			catch ( err ) {
				logger.warn( "Unable to load '.hashes' file. Stopping process." );
				logger.error( err );
				process.exit( 1 );
			}
		}

	//}
	return hashMap;
}

function writeHashMap( localDir, hashMap, filterMap ) {
	if ( filterMap ) {

		// we filter out all that is not in the filterMap
		var _filterMap = {};

		// normalize map
		for ( var k in filterMap ) {
 			var newKey = ( k.charAt( 0 ) == "/" ) ? k : "/" + k;
			_filterMap[newKey] = filterMap[k];
		}
		var deleteArray = [];
		for ( var k in hashMap ) {
			if ( !_filterMap[k] ) {

				// mark for deletion
				deleteArray.push( k );
			}
		}
		for ( var i = 0; i < deleteArray.length; i++ ) {
			delete hashMap[deleteArray[i]];
		}
	}
	var logger = utils.getLogger();
	var hashfile = localDir + "/.hashes";
	logger.finer( "Writing hash file to disk '%s'", hashfile );
	fs.writeFileSync( hashfile, JSON.stringify( hashMap, null, 4 ) );
}

function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}

exports.generateHashFromFile = function( filename ) {
	return generateHash( filename );
}
exports.generateHashFromContent = function( content ) {
	return generateHashFromContent( content );
}

exports.initHashContext = function( localDir ) {
	return readHashMap( localDir );
}

exports.hasHashContext = function( localDir ) {
	var hashes = readHashMap( localDir );
	return !isEmptyObject( hashes );
}

exports.getHashFromContext = function( context, key ) {

	// normalize
	key = ( key.charAt( 0 ) == "/" ) ? key : "/" + key;
	return context[key];
}

exports.addHashToContext = function( context, filename, key ) {

	// normalize
	key = ( key.charAt( 0 ) == "/" ) ? key : "/" + key;
	context[key] = generateHash( filename );
}
exports.addHashToContextDirect = function( context, newhash, key ) {

	// normalize
	key = ( key.charAt( 0 ) == "/" ) ? key : "/" + key;
	context[key] = newhash;
}

var deleteAllHashesFromContext = function( context, key ) {

	// normalize
	key = ( key.charAt( 0 ) == "/" ) ? key : "/" + key;
	var deleteArray = [];
	for ( var k in context ) {
		if ( k.indexOf( key ) == 0 ) {

			// mark for deletion
			deleteArray.push( k );
		}
	}
	for ( var i = 0; i < deleteArray.length; i++ ) {
		delete context[deleteArray[i]];
	}
}
exports.deleteAllHashesFromContext = deleteAllHashesFromContext;

exports.deleteHashFromContext = function( context, key, isDir ) {

	// normalize
	key = ( key.charAt( 0 ) == "/" ) ? key : "/" + key;
	if ( isDir ) {
		deleteAllHashesFromContext( context, key );
	} else {
		delete context[key];
	}
}

exports.renameHashInContext = function( context, oldkey, newkey, isDir ) {

	// normalize
	oldkey = ( oldkey.charAt( 0 ) == "/" ) ? oldkey : "/" + oldkey;

	// normalize
	newkey = ( newkey.charAt( 0 ) == "/" ) ? newkey : "/" + newkey;
	if ( isDir ) {
		var processArray = [];
		for ( var k in context ) {
			if ( k.indexOf( oldkey ) == 0 ) {
				processArray.push( k );
			}
		}
		for ( var i = 0; i < processArray.length; i++ ) {
			var existingKey = processArray[i],
				existingHash = context[existingKey];
			if ( existingHash ) {
				context[existingKey.replace( oldkey, newkey )] = context[existingKey];
			}
			delete context[existingKey];
		}
	} else {
		if ( context[oldkey] ) {
			context[newkey] = context[oldkey];
		}
		delete context[oldkey];
	}
}

exports.writeHashContext = function( localDir, context, filterMap ) {
	writeHashMap( localDir, context, filterMap );
}
