/**
GPII PCP Integration Tests

Copyright 2017 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/
"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("%gpii-universal");
require("./shared/PCPIntegrationTestDefs.js");

kettle.test.bootstrapServer(gpii.tests.pcpIntegration.buildTestDefs(gpii.tests.pcpIntegration.testDefs));
