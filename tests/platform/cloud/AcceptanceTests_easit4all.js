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

fluid.registerNamespace("gpii.tests.cloud.easit4all");

gpii.tests.cloud.easit4all.testDefs = require("./AcceptanceTests_easit4all_testDefs.json");

module.exports = gpii.test.cloudBased.bootstrap(gpii.tests.cloud.easit4all.testDefs, __dirname);
