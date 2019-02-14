/*
 * User logon Handlers Events Tests
 *
 * Copyright 2013-2018 OCAD University
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


fluid.require("%gpii-universal");

require("./shared/UserLogonHandlersTestDefs.js");
fluid.registerNamespace("gpii.tests.userLogonEvents");

gpii.tests.userLogonEvents.modelChangeChecker = function (changePayload, type, inProgress, gpiiKey) {
    jqUnit.assertEquals("Checking type of model change", type, changePayload.type);
    jqUnit.assertEquals("Checking inProgress of model change", inProgress, changePayload.inProgress);
    jqUnit.assertEquals("Checking gpiiKey of model change", gpiiKey, changePayload.gpiiKey);
};

gpii.tests.userLogonEvents.testDefs = [{
    name: "Testing events related to login and logout via proximityTriggered endpoint",
    expect: 20,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "logout", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "logout", false, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "login", true, gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "login", false, gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait for debounce
        func: "setTimeout",
        args: ["{tests}.events.debounceTimeoutComplete.fire", 3500]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, { // standard logout
        func: "{proximityTriggeredRequest2}.send"
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "logout", true, gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonEvents.modelChangeChecker",
        args: ["{arguments}.0", "logout", false, gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonHandlers.gpiiKey]
    }]
}];

gpii.test.runCouchTestDefs(gpii.tests.userLogonHandlers.buildTestDefs(gpii.tests.userLogonEvents.testDefs));
