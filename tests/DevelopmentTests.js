/**
 * GPII Flow Manager Development Tests
 *
 * Copyright 2013 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("jqUnit"),
    path = require("path"),
    configPath = path.resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

// These tests simply execute the login and logout cycle for a user with some basic
// dummy preference settings that will not attempt to configure any solutions. We
// observe that the expected responses are received to login and logout and that no
// errors are triggered

fluid.registerNamespace("gpii.tests.development");

gpii.tests.development.userToken = "testUser1";

gpii.tests.development.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.userToken + " was successfully logged in.", data);
};

gpii.tests.development.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.userToken + " was successfully logged out.", data);
};

gpii.tests.development.testDefs = [{
    name: "Flow Manager development tests",
    expect: 2,
    config: {
        configName: "development.all.local",
        configPath: configPath
    },
    gradeNames: "gpii.test.common.testCaseHolder",
    userToken: gpii.tests.development.userToken,

    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.development.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.development.testLogoutResponse"
    }]
}];

kettle.test.bootstrapServer(gpii.tests.development.testDefs);
