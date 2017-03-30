/*

    A Testem configuration file that extends gpii.testem.  This is specific to this package, to work around limitations
    in dealing with `node_modules` subdirectories with Istanbul, we have to:

    1. Use our own (pretest) steps to instrument all required code.
    2. Handcraft our testemOptions.routes
    3. Avoid using the normal "generated options merging" from gpii.testem.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var os = require("os");
require("../");

fluid.require("%gpii-testem");

var universalRoot = fluid.module.resolvePath("%universal");

fluid.registerNamespace("gpii.tests.universal.testem");

gpii.tests.universal.testem.getTestemOptions = function (that) {
    return that.options.testemOptions;
};

// We need a separate chrome data dir.  We put this under our testemDir so that it'll be cleaned up after our run.
gpii.tests.universal.testem.getOneOffChromeDir = function (that) {
    return path.resolve(that.options.testemDir, "chrome-disk-cache-" + that.id + "-" + Math.random() * 100000);
};

fluid.defaults("gpii.tests.universal.testem", {
    gradeNames: ["gpii.testem.commonTestDefs", "gpii.testem.coverageDataOnly"],
    testDefFile: "%universal/testDefs.json",
    sourceDirs: [],
    coverageDir: "coverage",
    chromeSubdir: "chrome-data-dir",
    generateCoverageReport: false,
    instrumentSource: false,
    serveDirs:  ["node_modules", "browserify"],
    invokers: {
        "getTestemOptions": {
            funcName: "gpii.tests.universal.testem.getTestemOptions",
            args:     ["{that}"]
        }
    },
    testemOptions: {
        "cwd": universalRoot,
        "routes": {
            "/gpii": "instrumented/universal/gpii"
        },
        "framework": "qunit",
        "parallel":  1
    }
});

module.exports = gpii.tests.universal.testem().getTestemOptions();
