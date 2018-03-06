/*
 * GPII Untrusted PCP Integration Tests
 *
 * Copyright 2017 Raising the floor - international
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("%gpii-universal");
require("./shared/PCPIntegrationTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.pcpIntegration");

gpii.tests.untrusted.pcpIntegration.testDefs =
    fluid.transform(gpii.tests.pcpIntegration.testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.linux.builtIn.untrusted.config",
                configPath: "%gpii-universal/tests/platform/linux/configs"
            },
            gradeNames: [
                "gpii.tests.pcpIntegration.testCaseHolder.common.linux",
                "gpii.test.common.lifecycleManagerReceiver",
                "gpii.test.pouch.pouchTestCaseHolder"
            ]
        });

        testDef.sequence = gpii.test.pouch.addConstructFixturesToSequence(testDef.sequence);
        return testDef;
    });

kettle.test.bootstrapServer(gpii.tests.untrusted.pcpIntegration.testDefs);
