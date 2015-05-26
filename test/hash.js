/*
Copyright 2015  IBM Corp.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fs = require( "fs" ),
	should = require( "should" ),
	helper = require( "./helper" ),
	server = require( "./server" ),
	syncHash = require( "../lib/hash" );

var HASH_FILE = "/.hashes";

describe( "sync-hash", function() {

	describe( "basic", function() {
		var syncPoint;
		beforeEach( function( done ) {
			syncPoint = helper.createSyncPoint( done );
		} );
		afterEach( function( done ) {
			helper.cleanupSyncPoint( done );
		} );

		it( "Should return an empty hash map", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			should( map ).be.empty;

		} )

		it( "Should write an empty hash map", function( ) {

			syncHash.writeHashContext( syncPoint, {}, null );

			fs.existsSync( syncPoint + HASH_FILE ).should.be.true;

			var map = JSON.parse( fs.readFileSync( syncPoint + HASH_FILE ) );

			should( map ).be.empty;

		} )

		it( "Should write a simple hash map", function( ) {

			syncHash.writeHashContext( syncPoint, {
				"testKey": "testValue",
				"test2Key": "test2Value"
			}, null );

			fs.existsSync( syncPoint + HASH_FILE ).should.be.true;

			var map = JSON.parse( fs.readFileSync( syncPoint + HASH_FILE ) );

			should( map ).have.properties( {
				"testKey": "testValue",
				"test2Key": "test2Value"
			} );

		} )

	} )

	describe( "with-predefined-content", function() {
		var syncPoint;
		beforeEach( function( done ) {
			syncPoint = helper.createSyncPointWithContent( "local-hash", done );
		} );
		afterEach( function( done ) {
			helper.cleanupSyncPoint( done );
		} );

		it( "Should have correct keys", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			should( map ).have.keys( [ "/Plain.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction.json",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

		} )

		it( "Should write back filtered map", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			syncHash.writeHashContext( syncPoint, map, {
				"/Plain.html": "x",
				"js/head.js": "x"
			} );

			fs.existsSync( syncPoint + HASH_FILE ).should.be.true;

			var map = JSON.parse( fs.readFileSync( syncPoint + HASH_FILE ) );

			should( map ).have.properties( {
				"/Plain.html": "c44566eb4d1bc71c40485a8901778d90",
				"/js/head.js": "833a8a98958dbedf2ea4dd8b98f439ec"
			} );

		} )

		it( "Should generate hash from file", function( ) {

			var hash = syncHash.generateHashFromFile( syncPoint + "/demo.js" );

			hash.should.be.equal( "2a0322707b9849833e446d6a0d2e36f7" );

		} )

		it( "Should generate hash from content", function( ) {

			var content = fs.readFileSync( syncPoint + "/demo.js" );

			var hash = syncHash.generateHashFromContent( content );

			hash.should.be.equal( "2a0322707b9849833e446d6a0d2e36f7" );

			var hash = syncHash.generateHashFromContent( null );

			should( hash ).be.null;

		} )

		it( "Should be able to get key from context", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			syncHash.getHashFromContext( map, "Plain.html" ).should.be.equal( "c44566eb4d1bc71c40485a8901778d90" );
			syncHash.getHashFromContext( map, "/Plain.html" ).should.be.equal( "c44566eb4d1bc71c40485a8901778d90" );

		} )

		it( "Should be able to set new hash to context", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			syncHash.getHashFromContext( map, "Plain.html" ).should.be.equal( "c44566eb4d1bc71c40485a8901778d90" );

			syncHash.addHashToContextDirect( map, "newHash", "/Plain.html" );
			syncHash.getHashFromContext( map, "Plain.html" ).should.be.equal( "newHash" );

			syncHash.addHashToContextDirect( map, "new2Hash", "Plain.html" );
			syncHash.getHashFromContext( map, "/Plain.html" ).should.be.equal( "new2Hash" );

			syncHash.addHashToContext( map, syncPoint + "/demo.js", "Plain.html" );
			syncHash.getHashFromContext( map, "/Plain.html" ).should.be.equal( "2a0322707b9849833e446d6a0d2e36f7" );

			syncHash.addHashToContext( map, syncPoint + "/demo.js", "/Plain2.html" );
			syncHash.getHashFromContext( map, "/Plain2.html" ).should.be.equal( "2a0322707b9849833e446d6a0d2e36f7" );
		} )

		it( "Should be able to delete hashes from context", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			should( map ).have.keys( [ "/Plain.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction.json",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

			syncHash.deleteHashFromContext( map, "Plain.html" );
			syncHash.deleteHashFromContext( map, "/menuDefinitions/pageAction.json" );

			should( map ).have.keys( [
				"/modules/readme.txt",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

			syncHash.deleteHashFromContext( map, "/js", true );

			should( map ).have.keys( [
				"/modules/readme.txt",
				"/nls/sidenav/theme_sidenav_zh.html" ] );
		} )

		it( "Should be able to delete hashes from context No2", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			should( map ).have.keys( [ "/Plain.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction.json",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

			syncHash.deleteHashFromContext( map, "js", true );
			syncHash.deleteAllHashesFromContext( map, "modules" );

			should( map ).have.keys( [ "/Plain.html",
				"/menuDefinitions/pageAction.json",
				"/nls/sidenav/theme_sidenav_zh.html" ] );
		} )

		it( "Should be able to rename hashes in context", function( ) {

			var map = syncHash.initHashContext( syncPoint );

			should( map ).have.keys( [ "/Plain.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction.json",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

			syncHash.renameHashInContext( map, "Plain.html", "Plain2.html" );
			syncHash.renameHashInContext( map, "/menuDefinitions/pageAction.json", "/menuDefinitions/pageAction2.json" );

			should( map ).have.keys( [ "/Plain2.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction2.json",
				"/js/head.js",
				"/js/highContrast.js.uncompressed.js",
				"/js/highContrast.js",
				"/js/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );

			syncHash.renameHashInContext( map, "/js", "/js2", true );

			should( map ).have.keys( [ "/Plain2.html",
				"/modules/readme.txt",
				"/menuDefinitions/pageAction2.json",
				"/js2/head.js",
				"/js2/highContrast.js.uncompressed.js",
				"/js2/highContrast.js",
				"/js2/highContrast.js.uncompressed.js.preCBT.js",
				"/nls/sidenav/theme_sidenav_zh.html" ] );
		} )

	} )

	describe( "error-scenario", function() {
		var hook, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-hash-invalid", done );
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.cleanupSyncPoint( done );
		} );

		it( "Should fail trying to load invalid hash file", function( done ) {
			var oldExit = process.exit;
			process.exit = function( code ) {
				hook.captured().should.containEql( "Unable to load '.hashes' file. Stopping process." );
				done();
			}
			syncHash.initHashContext( syncPoint );
			process.exit = oldExit;
		} )

	} )

} )
