/*
 * GPII-1880 Test Definitions
 *
 * Copyright 2017 Raising The Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.payloadSize");

gpii.tests.payloadSize.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with GPII key giant was successfully logged in.", data);
};

gpii.tests.payloadSize.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with GPII key giant was successfully logged out.", data);
};

gpii.tests.payloadSize.testDefs = [{
    name: "Payload size limit tests > 100kb",
    expect: 2,
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs/shared"
    },
    gradeNames: ["gpii.test.testCaseHolder"],
    gpiiKey: "giant",

    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.payloadSize.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.payloadSize.testLogoutResponse"
    }]
}];

gpii.test.runCouchTestDefs(gpii.tests.payloadSize.testDefs);
