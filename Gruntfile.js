module.exports = function( grunt )
{

    "use strict";

    var exec = require( "child_process" ).exec,
        fs = require( "fs" );

    grunt.initConfig( {
        compress: {
            main: {
                options: {
                    archive: "./build/DXSyncCLI.zip"
                },
                files: [
                    {
                        expand: true,
                        cwd: ".",
                        src: [ "index.js", "install.cmd", "install.sh", "install.txt", "package.json", "postinstall.js", "precompiled_modules.zip", "readme.md", "readme.txt", "LICENSE", "NOTICE" ],
                        dest: "/",
                        filter: "isFile"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: "bin/**",
                        dest: "/"
                    },
                    {
                        expand: true,
                        cwd: ".",
                        src: "lib/**",
                        dest: "/"
                    }
                ]
            }
        }
    } );

    grunt.loadNpmTasks( "grunt-contrib-compress" );

    grunt.registerTask( "default", [] );

    grunt.registerTask( "build", [ "compress:main", "_build" ] );

    /**
     * Builds the app
     */
    grunt.registerTask( "_build", function() {
    } );

};
