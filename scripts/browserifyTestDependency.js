/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// The creation of this script is to work around the issue of having to run a npm postinstall step
// only within the context of a GPII development environment.
// This script uses fluid-resolve npm package (https://www.npmjs.com/package/fluid-resolve) to detect
// the existence of a resolvable browserify module which is ordinarily only pulled in as a devDependency.
// If the directory is present, this script browserifies some node js scripts that are used by some
// in-browser tests, e.g. all tests located at %universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/html/.
// Otherwise, skip the browserifying and exit quietly.

"use strict";

var fluid = require("infusion"),
    resolve = require("fluid-resolve"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    exec = require('child_process').exec;

var universalPath = fluid.module.resolvePath("%universal");

// Detect whether the devDependency module "browserify" exists
resolve("browserify", {basedir: universalPath}, function (err, res) {
    if (err) {
        console.log("GPII is not running in a development mode, skipped the step to browserify test dependent node js scripts.")
    } else {
        var browserifyDir = universalPath + "/browserify";
        // Remove the browserify directory to start a fresh browserifying
        rimraf(browserifyDir, function () {
            // Create the browserify directory for holding browserfied files in the next steps
            mkdirp(browserifyDir, function () {
                var browserifyCommandTemplate = "node " + universalPath + "/node_modules/browserify/bin/cmd.js -s %module " + universalPath + "/node_modules/%moduleScript -o " + universalPath + "/browserify/%outputFile";

                var browserifyHttpCommand = fluid.stringTemplate(browserifyCommandTemplate, {
                    module: "http",
                    moduleScript: "http-browserify/index.js",
                    outputFile: "http.js"
                });
                var browserifyHttpsCommand = fluid.stringTemplate(browserifyCommandTemplate, {
                    module: "https",
                    moduleScript: "https-browserify/index.js",
                    outputFile: "https.js"
                });
                var browserifyUrlModuleCommand = fluid.stringTemplate(browserifyCommandTemplate, {
                    module: "urlModule",
                    moduleScript: "url/url.js",
                    outputFile: "urlModule.js"
                });

                // execute browserify commands
                exec(browserifyHttpCommand);
                exec(browserifyHttpsCommand);
                exec(browserifyUrlModuleCommand);
            });
        });
    }
});
