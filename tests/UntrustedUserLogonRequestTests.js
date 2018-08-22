/*
 * Untrusted User Logon Request Tests
 *
 * Copyright 2018 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

require("./shared/UserLogonRequestTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonRequest");

gpii.tests.untrusted.userLogonRequest.testDefs =
    fluid.transform(gpii.tests.userLogonRequest.testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.untrusted.userLogon.config",
                configPath: "%gpii-universal/tests/configs"
            },
            gradeNames: ["gpii.tests.userLogonRequest.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
            gpiiKey: testDefIn.gpiiKey || gpii.tests.userLogonRequest.gpiiKey
        }, testDefIn.untrustedExtras || {});

        return testDef;
    });

gpii.test.bootstrapServer(gpii.tests.untrusted.userLogonRequest.testDefs);
