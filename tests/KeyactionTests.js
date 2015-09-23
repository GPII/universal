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

fluid.defaults("gpii.tests.UserKeyactionTests.testCaseHolder", {
    gradeNames: ["gpii.test.common.testCaseHolder", "autoInit"],
    components: {
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/userKeyaction/reset",
                port: 8081
            }
        },
        userKeyactionRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/userKeyaction/someotheruser",
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

fluid.registerNamespace("gpii.tests.UserKeyactionTests");

gpii.tests.UserKeyactionTests.userToken = "testUser1";

gpii.tests.UserKeyactionTests.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.UserKeyactionTests.userToken + " was successfully logged in.", data);
};

gpii.tests.UserKeyactionTests.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.UserKeyactionTests.userToken + " was successfully logged out.", data);
};

gpii.tests.UserKeyactionTests.testErrorResponse = function (expMsg) {
    return function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received message as expected", expMsg, data.message);
        jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
    };
};

gpii.tests.UserKeyactionTests.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDef) {
        return $.extend(true, {
            config: {
                configName: "development.all.local",
                configPath: configPath
            },
            gradeNames: "gpii.tests.UserKeyactionTests.testCaseHolder",
            userToken: gpii.tests.UserKeyactionTests.userToken
        }, testDef);
    });
};

gpii.tests.UserKeyactionTests.testDefs = [{
    name: "Testing standard userKeyaction login and logout",
    expect: 2,
    sequence: [{ // standard login
        func: "{userKeyactionRequest}.send"
    }, {
        event: "{userKeyactionRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLoginResponse"
    }, { // standard logout
        func: "{userKeyactionRequest}.send"
    }, {
        event: "{userKeyactionRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLogoutResponse"
    }]
}, {
    name: "Testing userKeyaction with 'reset' token",
    expect: 5,
    sequence: [{ // resetting with no user logged in
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
        // listener: "gpii.tests.UserKeyactionTests.testOtherUserLoggedInResponse"
        listenerMaker: "gpii.tests.UserKeyactionTests.testErrorResponse",
        makerArgs: [ "No users currently logged in - nothing to reset" ]
    }, { // resetting with user logged in (part 1: login)
        func: "{userKeyactionRequest}.send"
    }, {
        event: "{userKeyactionRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLoginResponse"
    }, { // resetting with user logged in (part 2: reset and check that user is logged out)
        func: "{resetRequest}.send"
    }, {
        event: "{resetRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLogoutResponse"
    }]
}, {
    name: "Testing standard userKeyaction with another user already logged in",
    expect: 4,
    sequence: [{ // standard login
        func: "{userKeyactionRequest}.send"
    }, {
        event: "{userKeyactionRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLoginResponse"
    }, { // logout of different user
        func: "{userKeyactionRequest2}.send"
    }, {
        event: "{userKeyactionRequest2}.events.onComplete",
        // listener: "gpii.tests.UserKeyactionTests.testOtherUserLoggedInResponse"
        listenerMaker: "gpii.tests.UserKeyactionTests.testErrorResponse",
        makerArgs: [ "Got keyaction from user someotheruser, but the user testUser1 is already " +
        "logged in. So ignoring key action."]
    }]
}, {
    name: "Testing standard user/<token>/login and /user/<token>/logout URLs",
    expect: 11,
    sequence: [{ // standard login
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLoginResponse"
    }, { // standard login with an already logged in user:
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listenerMaker: "gpii.tests.UserKeyactionTests.testErrorResponse",
        makerArgs: [ "Got key in action from user testUser1, but the user testUser1 is already " +
        "logged in. So ignoring key action."]
    }, { // logout of different user
        func: "{logoutRequest2}.send"
    }, {
        event: "{logoutRequest2}.events.onComplete",
        listenerMaker: "gpii.tests.UserKeyactionTests.testErrorResponse",
        makerArgs: [ "Got key out action from user someotheruser, but the user testUser1 is " +
        "logged in. So ignoring key action."]
    }, { // logout of the correct user
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.UserKeyactionTests.testLogoutResponse"
    }, { // logout of user when none is logged
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listenerMaker: "gpii.tests.UserKeyactionTests.testErrorResponse",
        makerArgs: [ "No user logged in, so ignoring key action."]
    }]
}];

kettle.test.bootstrapServer(gpii.tests.UserKeyactionTests.buildTestDefs(gpii.tests.UserKeyactionTests.testDefs));
