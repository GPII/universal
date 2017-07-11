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
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");


fluid.require("%universal");

require("./shared/UserLogonStateChangeTestDefs.js");
fluid.registerNamespace("gpii.tests.userLogonEvents");

gpii.tests.userLogonEvents.modelChangeChecker = function (type, inProgress, userToken) {
    return function (changePayload) {
        jqUnit.assertEquals("Checking type of model change", type, changePayload.type);
        jqUnit.assertEquals("Checking inProgress of model change", inProgress, changePayload.inProgress);
        jqUnit.assertEquals("Checking userToken of model change", userToken, changePayload.userToken);
    };
};

gpii.tests.userLogonEvents.testDefs = [{
    name: "Testing events related to login and logout via proximityTriggered endpoint",
    expect: 14,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listenerMaker: "gpii.tests.userLogonEvents.modelChangeChecker",
        makerArgs: [ "login", true, "testUser1" ]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listenerMaker: "gpii.tests.userLogonEvents.modelChangeChecker",
        makerArgs: [ "login", false, "testUser1" ]
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
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listenerMaker: "gpii.tests.userLogonEvents.modelChangeChecker",
        makerArgs: [ "logout", true, "testUser1" ]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listenerMaker: "gpii.tests.userLogonEvents.modelChangeChecker",
        makerArgs: [ "logout", false, "testUser1" ]
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }]
}];

kettle.test.bootstrapServer(gpii.tests.userLogonHandling.buildTestDefs(gpii.tests.userLogonEvents.testDefs));
