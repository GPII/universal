/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.chrome");

gpii.tests.cloud.chrome.testDefs = require("./AcceptanceTests_chrome_testDefs.json");

// We would like to write something like this, but we lost Kettle's transformer chain when implementing
// the GPII's test drivers:
// module.exports = gpii.test.bootstrap({
//     testDefs:  "gpii.tests.cloud.chrome",
//     configName: "cloudBasedFlowManager.json",
//     configPath: "configs"
// }, ["gpii.test.cloudBased.testCaseHolder"],
//     module, require, __dirname);

module.exports = gpii.test.cloudBased.bootstrap(gpii.tests.cloud.chrome.testDefs, __dirname);
