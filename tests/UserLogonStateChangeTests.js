/*
 * GPII Flow Manager Development Tests
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
    jqUnit = fluid.require("jqUnit"),
    path = require("path"),
    configPath = path.resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

fluid.defaults("gpii.tests.userLogonStateChange.testCaseHolder", {
    gradeNames: ["gpii.test.common.testCaseHolder"],
    components: {
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/logonChange",
                port: 8081
            }
        },
        logonChangeRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/someotheruser/logonChange",
                port: 8081
            }
        },
        logoutRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/someotheruser/logout",
                port: 8081
            }
        }
    }
});

fluid.registerNamespace("gpii.tests.userLogonStateChange");

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
        return $.extend(true, {
            config: {
                configName: "development.all.local",
                configPath: configPath
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
        func: "{logonChangeRequest}.send"
    }, {
        event: "{logonChangeRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLogoutResponse"
    }]
}, {
    name: "Testing logonChange with 'reset' token",
    expect: 5,
    sequence: [{ // resetting with no user logged in
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
        listenerMaker: "gpii.tests.userLogonStateChange.testErrorResponse",
        makerArgs: [ "No users currently logged in - nothing to reset", 409 ]
    }, { // resetting with user logged in (part 1: login)
        func: "{logonChangeRequest}.send"
    }, {
        event: "{logonChangeRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLoginResponse"
    }, { // resetting with user logged in (part 2: reset and check that user is logged out)
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
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
        func: "{logonChangeRequest2}.send"
    }, {
        event: "{logonChangeRequest2}.events.onComplete",
        // listener: "gpii.tests.userLogonStateChange.testOtherUserLoggedInResponse"
        listenerMaker: "gpii.tests.userLogonStateChange.testErrorResponse",
        makerArgs: [ "Got logon change request from user someotheruser, but the user testUser1 is " +
        "already logged in. So ignoring request.", 409]
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
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listenerMaker: "gpii.tests.userLogonStateChange.testErrorResponse",
        makerArgs: [ "Got log in request from user testUser1, but the user testUser1 is already " +
        "logged in. So ignoring login request.", 409]
    }, { // logout of different user
        func: "{logoutRequest2}.send"
    }, {
        event: "{logoutRequest2}.events.onComplete",
        listenerMaker: "gpii.tests.userLogonStateChange.testErrorResponse",
        makerArgs: [ "Got logout request from user someotheruser, but the user testUser1 is logged " +
        "in. So ignoring the request.", 409]
    }, { // logout of the correct user
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.userLogonStateChange.testLogoutResponse"
    }, { // logout of user when none is logged
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listenerMaker: "gpii.tests.userLogonStateChange.testErrorResponse",
        makerArgs: [ "No user logged in, so ignoring logout action.", 409]
    }]
}];

kettle.test.bootstrapServer(gpii.tests.userLogonStateChange.buildTestDefs(gpii.tests.userLogonStateChange.testDefs));
