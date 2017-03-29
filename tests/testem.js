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
    gradeNames: ["gpii.testem.coverageDataOnly"],
    testPages:  "tests/web/html/all-tests.html",
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
        "browser_args": {
            // In larger projects, we seem to encounter "browser disconnect" errors, which these arguments are meant to
            // address.
            //
            // We use these arguments to tell Chrome that it's under moderate "pressure" memory-wise if it has 2Mb
            // free, and that it's under critical pressure if it has 1Mb free.  The limits are set incredibly low, which
            // in effect disables memory pressure management,  There is also a flag to disable memory pressure
            // management, but this appears not to address the underlying problem.
            //
            // See: http://peter.sh/experiments/chromium-command-line-switches/ for a list of Chrome command line switches
            //"Chrome": ["--memory-pressure-off"],
            "Chrome": ["--memory-pressure-threshholds 1 "],
            // "Chrome": ["--memory-pressure-thresholds-mb 2,1"],
            "Firefox": ["-safe-mode"]
        },
        "framework": "qunit",
        "parallel":  1
    }
});

module.exports = gpii.tests.universal.testem().getTestemOptions();
