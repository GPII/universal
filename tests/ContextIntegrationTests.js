/**
GPII Context Integration Tests

Copyright 2014 Raising the Floor - International

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
require("./shared/ContextIntegrationTestDefs.js");

gpii.tests.contextIntegration.baseTestDef = {
    gradeNames: [
        "gpii.tests.contextIntegration.testCaseHolder.common.linux",
        "gpii.test.common.lifecycleManagerReceiver"
    ],
    config: {
        configName: "gpii.tests.acceptance.linux.builtIn.config",
        configPath: "%gpii-universal/tests/platform/linux/configs"
    }
};

kettle.test.bootstrapServer(gpii.test.buildSegmentedFixtures(
        gpii.tests.contextIntegration.fixtures, gpii.tests.contextIntegration.baseTestDef));

