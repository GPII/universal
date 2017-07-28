/*
 * GPII Untrusted Flow Manager Development Tests
 *
 * Copyright 2015 OCAD University
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

fluid.require("%universal");

require("./shared/UserLogonStateChangeTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonHandling");

gpii.tests.untrusted.userLogonHandling.testDefs =
    fluid.transform(gpii.tests.userLogonHandling.testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.untrusted.development.config",
                configPath: "%universal/tests/configs"
            },
            gradeNames: ["gpii.tests.userLogonHandling.testCaseHolder", "gpii.test.integration.testCaseHolder.linux", "gpii.test.pouch.pouchTestCaseHolder"],
            userToken: gpii.tests.userLogonHandling.userToken
        });

        testDef.sequence = gpii.test.pouch.addConstructFixturesToSequence(testDef.sequence);
        return testDef;
    });

kettle.test.bootstrapServer(gpii.tests.untrusted.userLogonHandling.testDefs);
