/*
 * User Logon State Change Test Definitions
 *
 * Copyright 2013-2015 OCAD University
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

fluid.require("%universal");

require("./shared/UserLogonStateChangeTestDefs.js");
fluid.registerNamespace("gpii.tests.userLogonEvents");

gpii.tests.userLogonEvents.expectedEvent = function () {
    jqUnit.assertTrue("Expected event fired", true);
};

gpii.tests.userLogonEvents.testDefs = [{
    name: "Testing events related to login and logout",
    expect: 6,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{flowManager}.events.userLoginInitiated",
        listener: "gpii.tests.userLogonEvents.expectedEvent"
    }, {
        event: "{flowManager}.events.userLoginComplete",
        listener: "gpii.tests.userLogonEvents.expectedEvent"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLoginResponse"
    }, {
        // wait for debounce
        func: "setTimeout",
        args: [ "{tests}.events.timeoutComplete.fire", 6000 ]
    }, {
        event: "{tests}.events.timeoutComplete",
        listener: "fluid.identity"
    }, { // standard logout
        func: "{proximityTriggeredRequest2}.send"
    }, {
        event: "{flowManager}.events.userLogoutInitiated",
        listener: "gpii.tests.userLogonEvents.expectedEvent"
    }, {
        event: "{flowManager}.events.userLogoutComplete",
        listener: "gpii.tests.userLogonEvents.expectedEvent"
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }]
}];
