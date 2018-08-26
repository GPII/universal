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

gpii.tests.development.gpiiKey = "testUser1";

gpii.tests.development.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpii.tests.development.gpiiKey + " was successfully logged in.", data);
};

gpii.tests.development.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpii.tests.development.gpiiKey + " was successfully logged out.", data);
};

gpii.tests.development.testDefs = [{
    name: "Flow Manager development tests",
    expect: 2,
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs"
    },
    gradeNames: ["gpii.test.common.testCaseHolder"],
    gpiiKey: gpii.tests.development.gpiiKey,
    sequence: [{
        // TODO: Wait till the noUser keyin at the GPII start completes. This is to work around an issue with
        // running productionConfigTests.js when kettle onListen event, (which fires onServerReady event
        // (https://github.com/fluid-project/kettle/blob/master/lib/test/KettleTestUtils.js#L112), which then
        // starts test sequence), fires before the noUser keyin at the system start completes. The proper fix
        // is to have the test sequence start until noUser keyin completes. For example, the first test case
        // could be to listen to {flowManager}.events.noUserLoggedIn. This fix is not used because hitting the
        // error: Failed to resolve reference {flowManager}.
        func: "setTimeout",
        args: [ "{tests}.events.timeoutComplete.fire", 100 ]
    }, {
        event: "{tests}.events.timeoutComplete",
        listener: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.development.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.development.testLogoutResponse"
    }],
    events: {
        timeoutComplete: null
    }
}];
