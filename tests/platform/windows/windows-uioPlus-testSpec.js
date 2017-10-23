/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya
Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");
require("../shared/uioPlusTestDefs.js");

gpii.loadTestingSupport();

var deviceReporterMock = {
    "gpii.deviceReporter.registryKeyExists": {
        "expectInstalled": []
    }
};

fluid.transform(gpii.tests.uioPlus.testDefs, function (testDef) {
    fluid.set(testDef, "deviceReporters", deviceReporterMock);
});

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.uioPlus.testDefs",
    configName: "gpii.tests.acceptance.windows.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows", "gpii.test.integration.deviceReporterAware.windows"],
    module, require, __dirname);
