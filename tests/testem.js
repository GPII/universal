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

require("../");

fluid.require("%gpii-testem");

fluid.registerNamespace("gpii.tests.universal.testem");

gpii.tests.universal.testem.getTestemOptions = function (that) {
    return that.options.testemOptions;
};

fluid.defaults("gpii.tests.universal.testem", {
    gradeNames: ["gpii.testem.coverage"],
    testPages:  ["tests/web/html/all-tests.html"],
    coverageDir: "coverage",
    reportsDir: "reports",
    sourceDirs: {
        gpii: "%universal/gpii"
    },
    contentDirs: {
        browserify:   "%universal/browserify",
        node_modules: "%universal/node_modules"
    },
    invokers: {
        "getTestemOptions": {
            funcName: "gpii.tests.universal.testem.getTestemOptions",
            args:     ["{that}"]
        }
    },
    testemOptions: {
        tap_quiet_logs: true,
        disable_watching: true,
        skip: "PhantomJS,Opera,Safari",
        "routes": {
            "/gpii": "instrumented/gpii"
        }
    }
});

module.exports = gpii.tests.universal.testem().getTestemOptions();
