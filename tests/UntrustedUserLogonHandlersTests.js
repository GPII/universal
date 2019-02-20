/*
 * Untrusted User logon Handlers Tests
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
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

require("./shared/UserLogonHandlersTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonHandling");

gpii.tests.untrusted.userLogonHandling.testDefs =
    fluid.transform(gpii.tests.userLogonHandlers.testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.untrusted.userLogon.config",
                configPath: "%gpii-universal/tests/configs"
            },
            gradeNames: ["gpii.tests.userLogonHandlers.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
            gpiiKey: testDefIn.gpiiKey || gpii.tests.userLogonHandlers.gpiiKey
        }, testDefIn.untrustedExtras || {});

        return testDef;
    });

gpii.test.runCouchTestDefs(gpii.tests.untrusted.userLogonHandling.testDefs);
