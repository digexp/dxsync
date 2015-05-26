var fs = require( "fs" ),
	unzip = require( "unzip" );
fs.createReadStream( "./precompiled_modules.zip" ).pipe( unzip.Extract( { path: "." } ) );
