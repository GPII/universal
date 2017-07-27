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
            src: ["gpii/**/*.js", "tests/**/*.js", "examples/**/*.js", "*.js"]
        },
        jsonlint: {
            src: ["gpii/**/*.json", "tests/**/*.json", "testData/**/*.json", "*.json"]
        },
        json5lint: {
            options: {
                enableJSON5: true
            },
            src: ["gpii/**/*.json5", "tests/**/*.json5", "testData/**/*.json5", "*.json5"]
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("fluid-grunt-json5lint");

    grunt.registerTask("lint", "Apply jshint, jsonlint and json5lint", ["eslint", "jsonlint", "json5lint"]);
};
