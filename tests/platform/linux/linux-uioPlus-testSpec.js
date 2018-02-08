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

fluid.require("%gpii-universal");
require("../shared/uioPlusTestDefs.js");

gpii.loadTestingSupport();

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.uioPlus.testDefs",
    configName: "gpii.tests.acceptance.linux.uioPlus.config",
    configPath: "%gpii-universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);
