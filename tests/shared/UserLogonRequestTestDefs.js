/*
 * User Logon Request Test Definitions
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
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

fluid.require("%gpii-universal/gpii/node_modules/testing/src/PromiseUtils.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.userLogonRequest");

fluid.defaults("gpii.tests.userLogonRequest.testCaseHolder", {
    gradeNames: [ "gpii.test.common.lifecycleManagerReceiver", "gpii.test.common.testCaseHolder" ],
    events: {
        debounceTimeoutComplete: null,
        onResponse: null,
        onError: null
    }
});

gpii.tests.userLogonRequest.gpiiKey = "testUser1";
gpii.tests.userLogonRequest.anotherGpiiKey = "sammy";

gpii.tests.userLogonRequest.verifyActiveGpiiKey = function (lifecycleManager, expected) {
    jqUnit.assertDeepEq("The current active GPII key is as expected - " + expected, expected, lifecycleManager.getActiveSessionGpiiKeys());
};

gpii.tests.userLogonRequest.testLoginResponse = function (data, gpiiKey) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpiiKey + " was successfully logged in.", data);
};

gpii.tests.userLogonRequest.testLogoutResponse = function (data, gpiiKey) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpiiKey + " was successfully logged out.", data);
};

gpii.tests.userLogonRequest.testResetResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "Reset successfully.", data);
};

gpii.tests.userLogonRequest.modelChangeChecker = function (trackedLogonChange, expectedType, expectedInProgress, expectedGpiiKey) {
    var result = trackedLogonChange[trackedLogonChange.length - 1];
    jqUnit.assertEquals("Checking type of model change", expectedType, result.type);
    jqUnit.assertEquals("Checking inProgress of model change", expectedInProgress, result.inProgress);
    jqUnit.assertEquals("Checking gpiiKey of model change", expectedGpiiKey, result.gpiiKey);
};

gpii.tests.userLogonRequest.testUserError = function (actualResponse, expectedResponse, userError, expectedUserError) {
    jqUnit.assertDeepEq("onError fires with the expected message", expectedResponse, actualResponse);
    jqUnit.assertDeepEq("User error has been fired with the expected content", expectedUserError, userError.error);
};

gpii.tests.userLogonRequest.commonTestConfig = {
    gradeNames: ["gpii.tests.userLogonRequest.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
    distributeOptions: {
        "lifecycleManager.userErrorsListener": {
            "record": {
                trackedUserErrors: {},
                listeners: {
                    "userError.trackReportedError": {
                        listener: "fluid.set",
                        args: ["{that}.options.trackedUserErrors", "error", "{arguments}.0"]
                    }
                }
            },
            "target": "{that gpii.flowManager.local userErrors}.options"
        }
    }
};

gpii.tests.userLogonRequest.buildTestDefs = function (testDefs, testType) {
    var config = {
        // The custom config file is to config the debounce time at proximityTriggered endpoint to 3 seconds
        // rather than using the default 1.5 seconds. This is to work around an issue with testing a following
        // request that occurs < the debounce time. In this test, the following request was sent after waiting
        // for 1 second. However in the reality with all other running processes, CPU processing power etc,
        // this request is usually sent a bit more than after 1 second, occassionally even more than 1.5 seconds,
        // which causes the test to fail. Setting the debounce time to 3 seconds provides more buffering time
        // for the following request to send.
        configName: testType === "untrusted" ? "gpii.tests.acceptance.untrusted.userLogon.config" : "gpii.tests.acceptance.userLogon.config",
        configPath: "%gpii-universal/tests/configs"
    };

    return fluid.transform(testDefs, function (testDef) {
        var extraTestDef = testType === "untrusted" ? testDef.untrustedExtras : {};
        return fluid.extend(true, {
            config: config,
            gpiiKey: testDefs.gpiiKey || gpii.tests.userLogonRequest.gpiiKey,
            distributeOptions: {
                "lifecycleManager.logonChangeListener": {
                    "record": {
                        trackedLogonChange: [],
                        modelListeners: {
                            "logonChange": {
                                listener: "gpii.tests.userLogonRequest.trackLogonChange",
                                args: ["{that}.options.trackedLogonChange", "{change}.value"]
                            }
                        }
                    },
                    "target": "{that gpii.flowManager.local lifecycleManager}.options"
                }
            }
        }, gpii.tests.userLogonRequest.commonTestConfig, testDef, extraTestDef);
    });
};

gpii.tests.userLogonRequest.trackLogonChange = function (trackedLogonChange, logonChange) {
    trackedLogonChange.push(logonChange);
};

// Note: There is an implementation risk with this fixture due to FLUID-5502 (https://issues.fluidproject.org/browse/FLUID-5502)
// but we believe that this is currently reliable because each of the model changes is triggered asynchronously.
gpii.tests.userLogonRequest.testDefs = [{
    name: "Testing standard proximityTriggered login and logout",
    expect: 29,
    sequence: [{
        // The initial active GPII key is "noUser"
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }, {
        // 1. 1nd proximityTriggered request to key in testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", false, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "testUser1"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "testUser1"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", [gpii.tests.userLogonRequest.gpiiKey]]
    }, {
        // 2. wait for the debounce period to pass so that the following proximityTriggered request is not rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 3. 2nd proximityTriggered request to key out testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", true, "testUser1"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", false, "testUser1"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // noUser automatically keys in when no actual key is keyed in
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }]
}, {
    name: "Login with a different user with proximity trigger should log previous user out and noUser does not login in between",
    expect: 15,
    sequence: [{
        // 1. 1nd proximityTriggered request to key in testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 2. wait for the debounce period to pass
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 3. 2nd proximityTriggered request to key in another key "sammy". This should trigger:
        // 1) key out the first key "testUser1";
        // 2) key in the 2nd key "sammy";
        // 3) "noUser" is not keyed in between step 1 and 2.
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.anotherGpiiKey], "{that}"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", true, gpii.tests.userLogonRequest.gpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", false, gpii.tests.userLogonRequest.gpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, gpii.tests.userLogonRequest.anotherGpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, gpii.tests.userLogonRequest.anotherGpiiKey]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.anotherGpiiKey]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", [gpii.tests.userLogonRequest.anotherGpiiKey]]
    }]
}, {
    name: "Login with a different user with proximity trigger should ignore debounce",
    expect: 2,
    sequence: [{
        // 1. 1nd proximityTriggered request to key in testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 2. wait within the debounce period
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 10 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 3. 2nd proximityTriggered request to key in with a different user
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.anotherGpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.anotherGpiiKey]
    }]
}, {
    name: "Testing proximityTriggered login with debounce",
    expect: 2,
    sequence: [{
        // 1. 1nd proximityTriggered request to key in testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 2. wait within the debounce period to trigger the debounce logic so that the following proximityTriggered request will be rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 10 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 1. 2nd proximityTriggered request to key out testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "jqUnit.assertDeepEq",
        args: ["Proximity trigger ignored due to bounce rules", {
            "statusCode": 429,
            "message": "Proximity trigger ignored due to bounce rules. Please wait current logon change is complete",
            "ignoreUserErrors": false
        }, "{arguments}.0"]
    }]
}, {
    name: "Testing proximityTriggered logout with debounce",
    expect: 3,
    sequence: [{
        // 1. 1nd proximityTriggered request to key in testUser1
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 2. wait for the debounce period to pass so that the following proximityTriggered request is not rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 3. 2nd proximityTriggered request: standard logout
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 4. wait within the debounce period to trigger the debounce logic so that the following proximityTriggered request with the same GPII key will be rejected
        // use 1000ms to allow a buffer time for "noUser" login after the logout above to complete.
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 1000 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 5. 3rd proximityTriggered request with the same GPII key: will be rejected
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "jqUnit.assertDeepEq",
        args: ["Proximity trigger ignored due to bounce rules", {
            "statusCode": 429,
            "message": "Proximity trigger ignored due to bounce rules. Please wait current logon change is complete",
            "ignoreUserErrors": false
        }, "{arguments}.0"]
    }]
}, {
    name: "Testing 'reset' GPII key: resetting with noUser logs out noUser",
    expect: 7,
    sequence: [{
        // 1. resetting with noUser logs out noUser
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", ["reset"], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testResetResponse",
        args: ["{arguments}.0"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }]
}, {
    name: "Testing 'reset' GPII key: resetting with a user logged in",
    expect: 17,
    initialState: {
        "gpii.gsettings.launch": {
            "org.gnome.desktop.a11y.magnifier": [{
                "settings": {
                    "running": true
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled"
                }
            }]
        }
    },
    expectedStateAfterReset: {
        "gpii.gsettings.launch": {
            "org.gnome.desktop.a11y.magnifier": [{
                "settings": {
                    "running": false
                }
            }]
        }
    },
    sequence: [{
        // 1. set the initial settings: start the magnifier
        func: "gpii.test.expandSettings",
        args: [ "{tests}", "initialState" ]
    }, {
        func: "gpii.test.setInitialSettingsState",
        args: [ "{tests}.initialState", "{nameResolver}", "{testCaseHolder}.events.onInitialStateSet.fire"]
    }, {
        event: "{testCaseHolder}.events.onInitialStateSet",
        listener: "fluid.identity"
    }, {
        func: "gpii.test.checkConfiguration",
        args: ["{tests}.initialState", "{nameResolver}", "{testCaseHolder}.events.onInitialStateConfirmed.fire", "Confirming initial state"]
    }, {
        event: "{testCaseHolder}.events.onInitialStateConfirmed",
        listener: "fluid.identity"
    }, {
        // 2. login
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 3. reset and check that user is logged out)
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performProximityTriggered", ["reset"], "{that}"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", true, gpii.tests.userLogonRequest.gpiiKey]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", false, gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 4. reset and check that user is logged out)
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testResetResponse",
        args: ["{arguments}.0"]
    }, {
        // 5. "noUser" is automatically keyed in when no actual key is keyed in
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }, {
        // 6. Verify the default settings have been applied: stop the magnifier
        func: "gpii.test.checkRestoredInitialState",
        args: [ "{tests}.expectedStateAfterReset", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredInitialStateComplete.fire"]
    }, {
        event: "{testCaseHolder}.events.onCheckRestoredInitialStateComplete",
        listener: "fluid.identity"
    }]
}, {
    name: "Testing standard user/<gpiiKey>/login and /user/<gpiiKey>/logout URLs",
    expect: 13,
    sequence: [{
        // standard login
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogin", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLoginResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // standard login with an already logged in user:
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogin", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "gpii.tests.userLogonRequest.testUserError",
        args: ["{arguments}.0",
            {
                "statusCode": 409,
                "message": "Got log in request from user testUser1, but the user testUser1 is already logged in. So ignoring login request.",
                "ignoreUserErrors": false
            },
            "{lifecycleManager}.userErrors.options.trackedUserErrors",
            {
                "isError": true,
                "messageKey": "KeyInFail",
                "originalError": "Got log in request from user testUser1, but the user testUser1 is already logged in. So ignoring login request."
            }
        ]
    }, {
        // logout of different user
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogout", [gpii.tests.userLogonRequest.anotherGpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        priority: "last",
        listener: "gpii.tests.userLogonRequest.testUserError",
        args: ["{arguments}.0",
            {
                "statusCode": 409,
                "message": "Got logout request from user sammy, but the user testUser1 is logged in. So ignoring the request.",
                "ignoreUserErrors": false
            },
            "{lifecycleManager}.userErrors.options.trackedUserErrors",
            {
                "isError": true,
                "messageKey": "KeyInFail",
                "originalError": "Got logout request from user sammy, but the user testUser1 is logged in. So ignoring the request."
            }
        ]
    }, {
        // logout of the correct user
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogout", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonRequest.gpiiKey]
    }, {
        // 3. "noUser" is automatically keyed in when no actual key is keyed in
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }]
}, {
    name: "GPII-3481: /user/<gpiiKey>/logout does not trigger the user error report when the current logged in user is \"noUser\"",
    expect: 2,
    sequence: [{
        // logout of user when none is logged in
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogout", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "gpii.tests.userLogonRequest.testUserError",
        args: ["{arguments}.0",
            {
                "statusCode": 409,
                "message": "Got logout request from user testUser1, but the user noUser is logged in. So ignoring the request.",
                "ignoreUserErrors": true
            },
            "{lifecycleManager}.userErrors.options.trackedUserErrors",
            undefined
        ]
    }]
}, {
    name: "Testing standard error handling: invalid user URLs",
    expect: 8,
    gpiiKey: "bogusToken",
    untrustedExtras: {
        statusCode: 401,
        errorText: "server_error while executing HTTP POST on url http://localhost:8084/access_token"
    },
    errorText: "Error when retrieving preferences: GPII key \"bogusToken\" does not exist while executing HTTP GET on url http://localhost:8081/preferences/%gpiiKey?merge=%merge",
    statusCode: 404,
    sequence: [{
        // login with a non-existing GPII key
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogin", ["{testCaseHolder}.options.gpiiKey"], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "jqUnit.assertDeepEq",
        args: ["Received error when logging in non-existing GPII key", {
            "isError": true,
            "statusCode": "{testCaseHolder}.options.statusCode",
            "message": "{testCaseHolder}.options.errorText"
        }, "{arguments}.0"]
    }, {
        // "noUser" is automatically keyed in when a user logon request is rejected
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }, {
        // "noUser" is still keyed in when a logon request is rejected
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }]
}, {
    name: "noUser logs back in after an explicit request to logout noUser",
    expect: 15,
    sequence: [{
        // 1. "noUser" is keyed in initially
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }, {
        // 2. explicitly key out "noUser"
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogout", ["noUser"], "{that}"]
    }, {
        // 3. "noUser" is in the process of being keyed out
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "logout", false, "noUser"]
    }, {
        // 4. "noUser" has been keyed out
        event: "{that}.events.onResponse",
        listener: "gpii.tests.userLogonRequest.testLogoutResponse",
        args: ["{arguments}.0", "noUser"]
    }, {
        // noUser automatically keys back in
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", true, "noUser"]
    }, {
        changeEvent: "{lifecycleManager}.applier.modelChanged",
        path: "logonChange",
        listener: "gpii.tests.userLogonRequest.modelChangeChecker",
        args: ["{lifecycleManager}.options.trackedLogonChange", "login", false, "noUser"]
    }, {
        func: "gpii.tests.userLogonRequest.verifyActiveGpiiKey",
        args: ["{lifecycleManager}", ["noUser"]]
    }]
}];
