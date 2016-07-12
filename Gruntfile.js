/*!
GPII Universal project Gruntfile

Copyright 2014 RTF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        eslint: {
            src: ["gpii/**/*.js", "tests/**/*.js", "examples/**/*.js", "*.js"],
        },
        jsonlint: {
            src: ["gpii/**/*.json", "tests/**/*.json", "testData/**/*.json", "*.json"]
        },
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true,
                execOptions: {
                    maxBuffer: Infinity
                }
            },
            runBrowserTests: {
                command: "vagrant ssh -c 'cd /home/vagrant/sync/node_modules/universal; DISPLAY=:0 testem ci --file tests/web/testem_qi.json'"
            },
            runNodeTests: {
                command: "vagrant ssh -c 'cd /home/vagrant/sync/node_modules/universal; npm test'"
            },
            runNodeProductionTests: {
                command: "vagrant ssh -c 'cd /home/vagrant/sync/node_modules/universal; node tests/ProductionConfigTests.js'"
            }
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-shell");

    grunt.registerTask("browser-tests", "Run browser tests in a VM", function () {
        grunt.task.run("shell:runBrowserTests");
    });

    grunt.registerTask("node-tests", "Run Node tests in a VM", function () {
        grunt.task.run("shell:runNodeTests");
    });

    grunt.registerTask("node-production-tests", "Run Node production tests in a VM", function () {
        grunt.task.run("shell:runNodeProductionTests");
    });

    grunt.registerTask("tests", "Run browser and node tests in a VM", function () {
        grunt.task.run("shell:runBrowserTests");
        grunt.task.run("shell:runNodeTests");
    });

    grunt.registerTask("lint", "Apply jshint and jsonlint", ["eslint", "jsonlint"]);
};
