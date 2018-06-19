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
/* eslint-env node */
"use strict";
module.exports = function (grunt) {

    grunt.initConfig({
        eslint: {
            js: {
                src: ["gpii/**/*.js", "tests/**/*.js", "examples/**/*.js", "*.js"]
            },
            md: {
                options: {
                    configFile: ".eslintrc-md.json"
                },
                src: [ "./*.md","./documentation/*.md", "./examples/**/*.md"]
            }
        },
        jsonlint: {
            src: ["gpii/**/*.json", "tests/**/*.json", "testData/**/*.json", "*.json"]
        },
        json5lint: {
            options: {
                enableJSON5: true
            },
            src: ["gpii/**/*.json5", "tests/**/*.json5", "testData/**/*.json5", "*.json5"]
        },
        mdjsonlint: {
            src: ["./*.md", "./documentation/**/*.md", "./examples/**/*.md"]
        },
        markdownlint: {
            options: {
                config: {
                    // See https://github.com/DavidAnson/markdownlint#rules--aliases for rule names and meanings.
                    "no-duplicate-header": false, // We use duplicate nested headers, as in section 1 and 2 both have the same sub-section name.
                    "no-trailing-punctuation": false,  // This catches headings that are questions, which seems wrong.
                    "header-style": { style: "atx" }, // Although we use a mix, in discussion with various team members, we agreed to try this for now.
                    "no-inline-html": false, // Obviously we need HTML
                    "line-length": {
                        line_length: 120,
                        tables:      false,
                        code_blocks: false
                    },
                    "ol-prefix": {style: "ordered"} // 1. 2. 3. etc
                }
            },
            src: ["./*.md", "./documentation/**/*.md", "./examples/**/*.md"]
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("fluid-grunt-json5lint");
    grunt.loadNpmTasks("grunt-markdownlint");
    grunt.loadNpmTasks("gpii-grunt-mdjson-lint");

    grunt.registerTask("lint", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", ["eslint:js", "jsonlint", "json5lint", "markdownlint", "eslint:md", "mdjsonlint"]);
    //grunt.registerTask("lint", "Apply jshint, jsonlint and json5lint", ["eslint", "jsonlint", "json5lint"]);
};
