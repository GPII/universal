/*
 * GPII Flow Manager Development Test Definitions
 *
 * Copyright 2013 OCAD University
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
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

// These tests simply execute the login and logout cycle for a user with some basic
// dummy preference settings that will not attempt to configure any solutions. We
// observe that the expected responses are received to login and logout and that no
// errors are triggered

fluid.registerNamespace("gpii.tests.development");

gpii.tests.development.testLoginResponse = function (response, gpiiKey) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpiiKey + " was successfully logged in.", response);
};

gpii.tests.development.testLogoutResponse = function (response, gpiiKey) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpiiKey + " was successfully logged out.", response);
};

gpii.tests.development.commonTestSequence = [{
    func: "{loginRequest}.send"
}, {
    event: "{loginRequest}.events.onComplete",
    listener: "gpii.tests.development.testLoginResponse",
    args: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey"]
}, {
    func: "{logoutRequest}.send"
}, {
    event: "{logoutRequest}.events.onComplete",
    listener: "gpii.tests.development.testLogoutResponse",
    args: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey"]
}];


gpii.tests.development.testDefs = [{
    name: "Flow Manager test: Key in and key out with an existing GPII key",
    expect: 2,
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs"
    },
    gpiiKey: "testUser1",
    sequence: gpii.tests.development.commonTestSequence
}, {
    name: "Flow Manager test: Key in and key out with a nonexistent GPII key",
    expect: 2,
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs"
    },
    gpiiKey: "nonexistent_gpii_key",
    sequence: gpii.tests.development.commonTestSequence
}];
