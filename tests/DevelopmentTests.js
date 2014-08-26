/**
 * GPII Flow Manager Development Tests
 *
 * Copyright 2013 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    path = require("path"),
    jqUnit = fluid.require("jqUnit"),
    configPath = path.resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = require("kettle");

kettle.loadTestingSupport();

fluid.registerNamespace("gpii.tests.development");

gpii.tests.development.token = "testUser1";

gpii.tests.development.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.token + " was successfully logged in.", data);
};

gpii.tests.development.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.token + " was successfully logged out.", data);
};

var testDefs = [{
    name: "Flow Manager development tests.",
    expect: 2,
    config: {
        nodeEnv: "fm.ps.sr.dr.mm.os.lms.development",
        configPath: configPath
    },
    components: {
        loginRequest: {
            type: "kettle.test.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/login",
                    port: 8081
                },
                termMap: {
                    token: gpii.tests.development.token
                }
            }
        },
        logoutRequest: {
            type: "kettle.test.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/logout",
                    port: 8081
                },
                termMap: {
                    token: gpii.tests.development.token
                }
            }
        }
    },
    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.development.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.development.testLogoutResponse"
    }]
}];

module.exports = kettle.test.bootstrapServer(testDefs);
