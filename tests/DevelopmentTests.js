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

/*global require, __dirname*/

var fluid = require("infusion"),
    path = require("path"),
    flowManager = fluid.require("../gpii/node_modules/flowManager", require);
    jqUnit = fluid.require("jqUnit"),
    configPath = path.resolve(__dirname, "../gpii/configs"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("kettle/test/utils/js/KettleTestUtils", require);

kettle.tests.token = "carla";

kettle.tests.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        kettle.tests.token + " was successfully logged in.", data);
};

kettle.tests.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        kettle.tests.token + " was successfully logged out.", data);
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
            type: "kettle.tests.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/login",
                    port: 8081
                },
                termMap: {
                    token: kettle.tests.token
                }
            }
        },
        logoutRequest: {
            type: "kettle.tests.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/logout",
                    port: 8081
                },
                termMap: {
                    token: kettle.tests.token
                }
            }
        }
    },
    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "kettle.tests.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "kettle.tests.testLogoutResponse"
    }]
}];

module.exports = kettle.tests.bootstrap(testDefs);
