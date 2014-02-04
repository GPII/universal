/*

GPII Acceptance Testing

Copyright 2013 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global __dirname, require, module*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.acceptanceTesting.flowmanager");

fluid.require("universal/tests/AcceptanceTests", require);

gpii.acceptanceTesting.flowmanager.runTests = function (testDefs) {
    var gpiiConfig = {
       nodeEnv: "cloudBasedFlowManager",
       configPath: path.resolve(__dirname, "./configs")
    };
    fluid.each(testDefs, function (testDef) {
        testDef.config = gpiiConfig;
    });
    testDefs = gpii.acceptanceTesting.buildFlowManagerTests(testDefs);
    module.exports = kettle.tests.bootstrap(testDefs);
};