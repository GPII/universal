/*

GPII Acceptance Testing

Copyright 2013 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("universal"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.acceptanceTesting.flowManager");

fluid.require("universal/tests/AcceptanceTests", require);

gpii.acceptanceTesting.flowManager.runTests = function (testDefs) {
    var gpiiConfig = {
        configName: "cloudBasedFlowManager",
        configPath: path.resolve(__dirname, "./configs")
    };
    fluid.each(testDefs, function (testDef) {
        testDef.config = gpiiConfig;
    });
    return gpii.acceptanceTesting.buildFlowManagerTests(testDefs);
};