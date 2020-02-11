/*!
Copyright 2016 OCAD University
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// The creation of this script is to work around the issue of having to run a npm postinstall step
// only within the context of a GPII development environment.
// This script detects the existence of a resolvable browserify module which is ordinarily only pulled in as a devDependency.
// If the directory is present, this script browserifies some node js scripts that are used by some
// in-browser tests, e.g. all tests located at %gpii-universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/html/.
// Otherwise, skip the browserifying and exit quietly.

"use strict";

var fluid = require("infusion"),
    resolve = require("fluid-resolve"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    exec = require("child_process").exec;

var universalPath = fluid.module.resolvePath("%gpii-universal");

console.log("Browserifying dependent modules for web tests ...");
// Detect whether the devDependency module "browserify" exists
resolve("browserify", {basedir: universalPath}, function (err) {
    if (err) {
        console.log("GPII is not running in a development mode, skipped the step to browserify test dependent node js scripts.");
    } else {
        var browserifyDir = universalPath + "/build/tests/browserify";
        // Remove the browserify directory to start a fresh browserifying
        rimraf(browserifyDir, function () {
            // Create the browserify directory for holding browserfied files in the next steps
            mkdirp(browserifyDir, function () {
                var browserifyCommandTemplate = "node " + universalPath + "/node_modules/browserify/bin/cmd.js -s %module " + universalPath + "/node_modules/%moduleScript -o " + browserifyDir + "/%outputFile";

                var browserifyUtilCommand = fluid.stringTemplate(browserifyCommandTemplate, {
                    module: "util",
                    moduleScript: "util/util.js",
                    outputFile: "util.js"
                });

                // execute browserify commands
                exec(browserifyUtilCommand);
            });
        });
    }
});

console.log("Finished browserifying!");
