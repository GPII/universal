/**
GPII PSP Integration Tests

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
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
require("./shared/PSPIntegrationTestDefs.js");

gpii.tests.pspIntegration.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            gradeNames: [
                "gpii.tests.pspIntegration.testCaseHolder.common.linux",
                "gpii.test.common.lifecycleManagerReceiver"
            ],
            config: {
                configName: "gpii.tests.acceptance.linux.builtIn.config",
                configPath: "%gpii-universal/tests/platform/linux/configs"
            }
        }, testDef);
    });
};
gpii.test.bootstrapServer(gpii.tests.pspIntegration.buildTestDefs(gpii.tests.pspIntegration.testDefs));
