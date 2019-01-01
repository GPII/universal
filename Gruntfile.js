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
        lintAll: {
            sources: {
                md:    [ "./*.md","./documentation/*.md", "./examples/**/*.md"],
                js:    ["!./browserify/**/*.js", "./gpii/**/*.js", "./tests/**/*.js", "./examples/**/*.js", "*.js"],
                json:  ["./gpii/**/*.json", "./tests/**/*.json", "./testData/**/*.json", "./*.json"],
                json5: ["./gpii/**/*.json5", "./tests/**/*.json5", "./testData/**/*.json5", "./*.json5"],
                other: ["./.*"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
