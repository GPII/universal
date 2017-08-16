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

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.userLogonHandling");

fluid.defaults("gpii.tests.userLogonHandling.proximityTriggered", {
    gradeNames: "kettle.test.request.http",
    path: "/user/%userToken/proximityTriggered",
    termMap: {
        userToken: "{tests}.options.userToken"
    }
});

fluid.defaults("gpii.tests.userLogonHandling.testCaseHolder", {
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
            type: "gpii.tests.userLogonHandling.proximityTriggered"
        },
        proximityTriggeredRequest2: {
            type: "gpii.tests.userLogonHandling.proximityTriggered"
        },
        proximityTriggeredRequest3: {
            type: "gpii.tests.userLogonHandling.proximityTriggered"
        },
        proximityTriggeredRequestOther: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/sammy/proximityTriggered"
            }
        },
        logoutRequestOther: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/sammy/logout"
            }
        },
        loginRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/testUser1/login"
            }
        },
        logoutRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/testUser1/logout"
            }
        }
    },
    events: {
        timeoutComplete: null
    }
});

gpii.tests.userLogonHandling.userToken = "testUser1";

gpii.tests.userLogonHandling.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.userLogonHandling.userToken + " was successfully logged in.", data);
};

gpii.tests.userLogonHandling.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.userLogonHandling.userToken + " was successfully logged out.", data);
};

gpii.tests.userLogonHandling.testErrorResponse = function (expMsg, expCode) {
    return function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received message as expected", expMsg, data.message);
        jqUnit.assertEquals("Received correct error code", expCode, data.statusCode);
    };
};

gpii.tests.userLogonHandling.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            config: {
                configName: "gpii.config.development.all.local",
                configPath: "%universal/gpii/configs"
            },
            gradeNames: [ "gpii.tests.userLogonHandling.testCaseHolder", "gpii.test.integration.testCaseHolder.linux" ],
            userToken: gpii.tests.userLogonHandling.userToken
        }, testDef);
    });
};

gpii.tests.userLogonHandling.testDefs = [{
    name: "Testing standard proximityTriggered login and logout",
    expect: 2,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
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
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }]
}, {
    name: "Testing proximityTriggered login with debounce",
    expect: 4,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLoginResponse"
    }, {
        // wait, but not long enough for debounce
        func: "setTimeout",
        args: [ "{tests}.events.timeoutComplete.fire", 1000 ]
    }, {
        event: "{tests}.events.timeoutComplete",
        listener: "fluid.identity"

    }, { // standard logout
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
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
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
        event: "{proximityTriggeredRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }, { // wait, but not long enough for debounce
        func: "setTimeout",
        args: [ "{tests}.events.timeoutComplete.fire", 1000 ]
    }, {
        event: "{tests}.events.timeoutComplete",
        listener: "fluid.identity"
    }, { // trigger proximity logout
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
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
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
    }, { // login with different user
        func: "{proximityTriggeredRequestOther}.send"
    }, {
        event: "{proximityTriggeredRequestOther}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: [ "Response is correct", "User with token sammy was successfully logged in.", "{arguments}.0" ]
    }]
}, {
    name: "Login with a different user with proximity trigger should ignore debounce",
    expect: 2,
    sequence: [{ // standard login
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLoginResponse"
    }, {
        // wait a little bit, but not long enough for debounce
        func: "setTimeout",
        args: [ "{tests}.events.timeoutComplete.fire", 1000 ]
    }, {
        event: "{tests}.events.timeoutComplete",
        listener: "fluid.identity"
    }, { // login with different user
        func: "{proximityTriggeredRequestOther}.send"
    }, {
        event: "{proximityTriggeredRequestOther}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: [ "Response is correct", "User with token sammy was successfully logged in.", "{arguments}.0" ]
    }]
}, {
    name: "Testing proximityTriggered with 'reset' token",
    expect: 5,
    sequence: [{ // resetting with no user logged in
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error on reset with no users logged on",
            errorTexts: "No users currently logged in - nothing to reset",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{resetRequest}"
        }
    }, { // resetting with user logged in (part 1: login)
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLoginResponse"
    }, { // resetting with user logged in (part 2: reset and check that user is logged out)
        func: "{resetRequest2}.send"
    }, {
        event: "{resetRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }]
}, {
    name: "Testing standard user/<token>/login and /user/<token>/logout URLs",
    expect: 11,
    sequence: [{ // standard login
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLoginResponse"
    }, { // standard login with an already logged in user:
        func: "{loginRequest2}.send"
    }, {
        event: "{loginRequest2}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging in user who is already logged in",
            errorTexts: "Got log in request from user testUser1, but the user testUser1 is already logged in. So ignoring login request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{loginRequest2}"
        }
    }, { // logout of different user
        func: "{logoutRequestOther}.send"
    }, {
        event: "{logoutRequestOther}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging out user who is not logged in",
            errorTexts: "Got logout request from user sammy, but the user testUser1 is logged in. So ignoring the request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logoutRequestOther}"
        }
    }, { // logout of the correct user
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandling.testLogoutResponse"
    }, { // logout of user when none is logged
        func: "{logoutRequest2}.send"
    }, {
        event: "{logoutRequest2}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging out user when no user is logged in",
            errorTexts: "No user logged in, so ignoring logout action.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logoutRequest2}"
        }
    }]
}];
