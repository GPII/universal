/*
 * User Logon State Change Test Definitions
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

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.userLogonHandlers");

fluid.defaults("gpii.tests.userLogonHandlers.proximityTriggered", {
    gradeNames: "kettle.test.request.http",
    path: "/user/%gpiiKey/proximityTriggered",
    termMap: {
        gpiiKey: "{tests}.options.gpiiKey"
    }
});

fluid.defaults("gpii.tests.userLogonHandlers.testCaseHolder", {
    gradeNames: [ "gpii.test.common.lifecycleManagerReceiver", "gpii.test.common.testCaseHolder" ],
    components: {
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/proximityTriggered"
            }
        },
        resetRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/proximityTriggered"
            }
        },
        proximityTriggeredRequest: {
            type: "gpii.tests.userLogonHandlers.proximityTriggered"
        },
        proximityTriggeredRequest2: {
            type: "gpii.tests.userLogonHandlers.proximityTriggered"
        },
        proximityTriggeredRequest3: {
            type: "gpii.tests.userLogonHandlers.proximityTriggered"
        },
        proximityTriggeredRequestOther: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/sammy/proximityTriggered"
            }
        },
        logoutSammyRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/sammy/logout"
            }
        },
        loginAdjustCursorRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/adjustCursor/login"
            }
        },
        logoutAdjustCursorRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/adjustCursor/logout"
            }
        },
        logoutDefaultGpiiKeyRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/" + gpii.defaultGpiiKey + "/logout"
            }
        }
    },
    events: {
        debounceTimeoutComplete: null
    }
});

gpii.tests.userLogonHandlers.gpiiKey = "adjustCursor";

gpii.tests.userLogonHandlers.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpii.tests.userLogonHandlers.gpiiKey + " was successfully logged in.", data);
};

gpii.tests.userLogonHandlers.testLogoutResponse = function (data, gpiiKey) {
    jqUnit.assertEquals("Response is correct", "User with GPII key " +
        gpiiKey + " was successfully logged out.", data);
};

gpii.tests.userLogonHandlers.testResetResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "Reset successfully.", data);
};

gpii.tests.userLogonHandlers.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            config: {
                // The custom config file is to config the debounce time at /proximityTriggered endpoint to 3 seconds
                // rather than using the default 1.5 seconds. This is to work around an issue with testing a following
                // request that occurs < the debounce time. In this test, the following request was sent after waiting
                // for 1 second. However in the reality with all other running processes, CPU processing power etc,
                // this request is usually sent a bit more than after 1 second, occassionally even more than 1.5 seconds,
                // which causes the test to fail. Setting the debounce time to 3 seconds provides more buffering time
                // for the following request to send.
                configName: "gpii.tests.acceptance.userLogon.config",
                configPath: "%gpii-universal/tests/configs"
            },
            gradeNames: ["gpii.tests.userLogonHandlers.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
            gpiiKey: testDefs.gpiiKey || gpii.tests.userLogonHandlers.gpiiKey
        }, testDef);
    });
};


gpii.tests.userLogonHandlers.testDefs = [{
    name: "Testing standard proximityTriggered login and logout",
    expect: 2,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait for the debounce period to pass so that the following /proximityTriggered request is not rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 2nd /proximityTriggered request: standard logout
        func: "{proximityTriggeredRequest2}.send"
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonHandlers.gpiiKey]
    }]
}, {
    name: "Testing proximityTriggered login with debounce",
    expect: 4,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait within the debounce period to trigger the debounce logic so that the following /proximityTriggered request will be rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 100 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"

    }, {
        // 2nd /proximityTriggered request: will be rejected
        func: "{proximityTriggeredRequest2}.send"
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 429 error due to debounce rules",
            errorTexts: "Proximity trigger ignored due to bounce rules",
            statusCode: 429,
            string: "{arguments}.0",
            request: "{proximityTriggeredRequest2}"
        }
    }]
}, {
    name: "Testing proximityTriggered logout with debounce",
    expect: 5,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait for the debounce period to pass so that the following /proximityTriggered request is not rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 2nd /proximityTriggered request: standard logout
        func: "{proximityTriggeredRequest2}.send"
    }, {
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        // wait within the debounce period to trigger the debounce logic so that the following /proximityTriggered request with the same GPII key will be rejected
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 100 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 3rd /proximityTriggered request with the same GPII key: will be rejected
        func: "{proximityTriggeredRequest3}.send"
    }, {
        event: "{proximityTriggeredRequest3}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 429 error due to debounce rules",
            errorTexts: "Proximity trigger ignored due to bounce rules",
            statusCode: 429,
            string: "{arguments}.0",
            request: "{proximityTriggeredRequest3}"
        }
    }]
}, {
    name: "Login with a different user with proximity trigger should log previous user out",
    expect: 2,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait for the debounce period to pass
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 3500 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 2nd /proximityTriggered request to login with a different user
        func: "{proximityTriggeredRequestOther}.send"
    }, {
        event: "{proximityTriggeredRequestOther}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: [ "Response is correct", "User with GPII key sammy was successfully logged in.", "{arguments}.0" ]
    }]
}, {
    name: "Login with a different user with proximity trigger should ignore debounce",
    expect: 2,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // wait within the debounce period
        func: "setTimeout",
        args: [ "{tests}.events.debounceTimeoutComplete.fire", 100 ]
    }, {
        event: "{tests}.events.debounceTimeoutComplete",
        listener: "fluid.identity"
    }, {
        // 2nd /proximityTriggered request to login with a different user
        func: "{proximityTriggeredRequestOther}.send"
    }, {
        event: "{proximityTriggeredRequestOther}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: [ "Response is correct", "User with GPII key sammy was successfully logged in.", "{arguments}.0" ]
    }]
}, {
    name: "Testing proximityTriggered with 'reset' GPII key",
    expect: 2,
    sequence: [{
        // log in a user (part 1: login)
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // resetting with user logged in (part 2: reset and check that user is logged out)
        func: "{resetRequest2}.send"
    }, {
        event: "{resetRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testResetResponse",
        args: ["{arguments}.0"]
    }]
}, {
    name: "Testing proximityTriggered with 'reset' the default GPII key",
    expect: 1,
    sequence: [{
        // resetting with no user logged in
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testResetResponse",
        args: ["{arguments}.0"]
    }]
}, {
    name: "Testing standard user/<gpiiKey>/login and /user/<gpiiKey>/logout URLs",
    expect: 11,
    sequence: [{
        // standard login
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse"
    }, {
        // standard login with an already logged in user:
        func: "{loginAdjustCursorRequest}.send"
    }, {
        event: "{loginAdjustCursorRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging in user who is already logged in",
            errorTexts: "Got log in request from user adjustCursor, but the user adjustCursor is already logged in. So ignoring login request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{loginAdjustCursorRequest}"
        }
    }, {
        // logout of different user
        func: "{logoutSammyRequest}.send"
    }, {
        event: "{logoutSammyRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging out user who is not logged in",
            errorTexts: "Got logout request from user sammy, but the user adjustCursor is logged in. So ignoring the request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logoutSammyRequest}"
        }
    }, {
        // logout of the correct user
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", gpii.tests.userLogonHandlers.gpiiKey]
    }, {
        // logout of user when none is logged in
        func: "{logoutAdjustCursorRequest}.send"
    }, {
        event: "{logoutAdjustCursorRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging out user when no user is logged in",
            errorTexts: "Got logout request from user adjustCursor, but the user " + gpii.defaultGpiiKey + " is logged in. So ignoring the request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logoutAdjustCursorRequest}"
        }
    }]
}, {
    name: "Testing standard error handling: invalid user URLs",
    expect: 3,
    gpiiKey: "bogusToken",
    untrustedExtras: {
        statusCode: 401,
        errorText: "server_error while executing HTTP POST on"
    },
    errorText: "Error when retrieving preferences: GPII key \"bogusToken\" does not exist",
    statusCode: 404,
    sequence: [{
        // login with a non-existing GPII key
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received error when logging in non-existing GPII key",
            errorTexts: "{testCaseHolder}.options.errorText",
            string: "{arguments}.0",
            request: "{proximityTriggeredRequest}",
            statusCode: "{testCaseHolder}.options.statusCode"
        }
    }]
}, {
    name: "The default GPII key logs back in after an explicit request to log it out",
    expect: 1,
    sequence: [{
        // 1st /proximityTriggered request: standard login
        func: "{logoutDefaultGpiiKeyRequest}.send"
    }, {
        event: "{logoutDefaultGpiiKeyRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", gpii.defaultGpiiKey]
    }]
}];
