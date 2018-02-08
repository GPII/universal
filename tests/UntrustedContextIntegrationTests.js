/**
GPII Context Integration Tests for the Untrusted Flowmanager

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
require("./shared/ContextIntegrationTestDefs.js");

fluid.registerNamespace("gpii.tests.untrusted.contextIntegration");

gpii.tests.untrusted.contextIntegration.baseTestDef = gpii.test.buildSegmentedFixtures(
        gpii.tests.contextIntegration.fixtures);

gpii.tests.untrusted.contextIntegration.testDefs = fluid.transform(gpii.tests.untrusted.contextIntegration.baseTestDef, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        config: {
            configName: "gpii.tests.acceptance.linux.builtIn.untrusted.config",
            configPath: "%gpii-universal/tests/platform/linux/configs"
        },
        gradeNames: [
            "gpii.test.pouch.pouchTestCaseHolder",
            "gpii.tests.contextIntegration.testCaseHolder.common.linux",
            "gpii.test.common.untrusted.lifecycleManagerReceiver"
        ]
    });

    testDef.sequence = gpii.test.pouch.addConstructFixturesToSequence(testDef.sequence);
    return testDef;
});

kettle.test.bootstrapServer(gpii.tests.untrusted.contextIntegration.testDefs);
