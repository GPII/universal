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

fluid.defaults("gpii.tests.userLogonStateChange.logonChange", {
    gradeNames: "kettle.test.request.http",
    path: "/user/%userToken/logonChange",
    termMap: {
        userToken: "{tests}.options.userToken"
    }
});

fluid.defaults("gpii.tests.userLogonStateChange.testCaseHolder", {
    gradeNames: "gpii.test.common.testCaseHolder",
    components: {
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/logonChange"
            }
        },
        resetRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/logonChange"
            }
        },
        logonChangeRequest: {
            type: "gpii.tests.userLogonStateChange.logonChange"
        },
        logonChangeRequest2: {
            type: "gpii.tests.userLogonStateChange.logonChange"
        },
        logonChangeRequestOther: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/someotheruser/logonChange"
            }
        },
        logoutRequestOther: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/someotheruser/logout"
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
    }
});

gpii.tests.userLogonStateChange.userToken = "testUser1";

gpii.tests.userLogonStateChange.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.userLogonStateChange.userToken + " was successfully logged in.", data);
};

gpii.tests.userLogonStateChange.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.userLogonStateChange.userToken + " was successfully logged out.", data);
};

gpii.tests.userLogonStateChange.testErrorResponse = function (expMsg, expCode) {
    return function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received message as expected", expMsg, data.message);
        jqUnit.assertEquals("Received correct error code", expCode, data.statusCode);
    };
};

gpii.tests.userLogonStateChange.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            config: {
                configName: "development.all.local",
                configPath: "%universal/gpii/configs"
            },
            gradeNames: "gpii.tests.userLogonStateChange.testCaseHolder",
            userToken: gpii.tests.userLogonStateChange.userToken
        }, testDef);
    });
};

gpii.tests.userLogonStateChange.testDefs = [{
    name: "Testing standard logonChange login and logout",
    expect: 2,
    sequence: [{ // standard login
        func: "{logonChangeRequest}.send"
    }, {
        event: "{logonChangeRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLoginResponse"
    }, { // standard logout
        func: "{logonChangeRequest2}.send"
    }, {
        event: "{logonChangeRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLogoutResponse"
    }]
}, {
    name: "Testing logonChange with 'reset' token",
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
        func: "{logonChangeRequest}.send"
    }, {
        event: "{logonChangeRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLoginResponse"
    }, { // resetting with user logged in (part 2: reset and check that user is logged out)
        func: "{resetRequest2}.send"
    }, {
        event: "{resetRequest2}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLogoutResponse"
    }]
}, {
    name: "Testing standard logonChange with another user already logged in",
    expect: 4,
    sequence: [{ // standard login
        func: "{logonChangeRequest}.send"
    }, {
        event: "{logonChangeRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLoginResponse"
    }, { // logout of different user
        func: "{logonChangeRequestOther}.send"
    }, {
        event: "{logonChangeRequestOther}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Received 409 error when logging out user who is not logged in",
            errorTexts: "Got logon change request from user someotheruser, but the user testUser1 is already logged in. So ignoring request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logonChangeRequestOther}"
        }
    }]
}, {
    name: "Testing standard user/<token>/login and /user/<token>/logout URLs",
    expect: 11,
    sequence: [{ // standard login
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLoginResponse"
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
            errorTexts: "Got logout request from user someotheruser, but the user testUser1 is logged in. So ignoring the request.",
            statusCode: 409,
            string: "{arguments}.0",
            request: "{logoutRequestOther}"
        }
    }, { // logout of the correct user
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLogoutResponse"
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
