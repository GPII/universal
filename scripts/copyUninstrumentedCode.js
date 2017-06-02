/*

    When running our tests with an eye towards preparing code coverage reports, we instrument our unique code,
    but do not instrument libraries (like jQuery) or non-code content.

    This script copies the remaining content in uninstrumented form to the target directory, so that all required
    content is available when running the tests.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var copy  = require("recursive-copy");
var path  = require("path");

fluid.registerNamespace("gpii.test.testem.copier");
gpii.test.testem.copier.copyDirs = function (srcRoot, targetRoot, dirsToCopy) {
    var promises = [];

    var resolvedSrcRoot = fluid.module.resolvePath(srcRoot);
    var resolvedTargetRoot = fluid.module.resolvePath(targetRoot);
    fluid.each(dirsToCopy, function (dirToCopy) {
        promises.push(function () {
            var wrappedPromise = fluid.promise();
            var src  = path.resolve(resolvedSrcRoot, dirToCopy);
            var dest = path.resolve(resolvedTargetRoot, dirToCopy);
            var rawPromise = copy(src, dest);
            rawPromise.then(wrappedPromise.resolve).catch(wrappedPromise.reject);
        });
    });

    var sequence = fluid.promise.sequence(promises);

    sequence.then(
        function () {
            fluid.log("Copied non-instrumented code succesfully...");
        },
        function (error) {
            fluid.log("Error copying non-instrumented code:\n", error);
        }
    );
    return sequence;
};

fluid.defaults("gpii.test.testem.copier", {
    gradeNames: ["fluid.component"],
    srcRoot:    "%universal/gpii",
    targetRoot: "%universal/instrumented/universal/gpii",
    dirsToCopy: [
        "node_modules/gpii-oauth2/gpii-oauth2-authz-server/public/lib",
        "node_modules/gpii-oauth2/gpii-oauth2-authz-server/webTests/lib",
        "node_modules/testing"
    ],
    listeners: {
        "onCreate.copyDirs": {
            funcName: "gpii.test.testem.copier.copyDirs",
            args:     ["{that}.options.srcRoot", "{that}.options.targetRoot", "{that}.options.dirsToCopy"]
        }
    }
});
gpii.test.testem.copier();
