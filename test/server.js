/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var jsDAVserver = require( "jsDAV/lib/DAV/server" ),
	jsDAV = require( "jsDAV/lib/jsdav" ),
	path = require( "path" ),
	helper = require( "./helper" ),
	BUILD_DIR = path.normalize( __dirname + "/../build" );

console.log( "jsDAV " + jsDAVserver.VERSION + " is installed." );

// setting debugMode to TRUE outputs a LOT of information to console
//jsDAV.debugMode = true;

function startServer( authEnabled, done ) {

	var jsDAVLocksBackendFS = require( "jsDAV/lib/DAV/plugins/locks/fs" ),
		jsDAVAuthBackendFile = require( "jsDAV/lib/DAV/plugins/auth/file" );

	helper.mkdirRecursive( BUILD_DIR + "/server/assets" );
	helper.mkdirRecursive( BUILD_DIR + "/server/data" );

	var options = {
		baseUri: "/dav/fs-type1",
		node: BUILD_DIR + "/server/assets",
	    locksBackend: jsDAVLocksBackendFS.new( BUILD_DIR + "/server/data" )
	};
	if ( authEnabled ) {
	    options.authBackend = jsDAVAuthBackendFile.new( __dirname + "/server-auth/auth.digests" );
	    options.realm = "portal";
	}
	var server = jsDAV.createServer( options, 10039 );
	setTimeout( function() {
		done( server );
	}, 100 );

}

exports.startServer = function( done ) {

	helper.deleteFolderRecursive( BUILD_DIR + "/server", function() {
		startServer( false, done );
	} );
	return BUILD_DIR + "/server/assets";
}

exports.startServerWithAuthentication = function( done ) {

	helper.deleteFolderRecursive( BUILD_DIR + "/server", function() {
		startServer( true, done );
	} );
	return BUILD_DIR + "/server/assets";
}

exports.startServerWithAuthenticationKeepFolder = function( done ) {

	startServer( true, done );

	return BUILD_DIR + "/server/assets";
}

exports.startServerWithContent = function( content, done ) {

	helper.deleteFolderRecursive( BUILD_DIR + "/server", function() {
		helper.copyFolderRecursive( __dirname + "/resources/" + content, BUILD_DIR + "/server/assets" );
		startServer( false, done );
	} );
	return BUILD_DIR + "/server/assets";
}

exports.closeServer = function( server, done ) {
	server.close( function() {
		console.log( "Server closed" );

		helper.deleteFolderRecursive( __dirname + "/../build/server", function() {
			done();
		} );
	} )
}
