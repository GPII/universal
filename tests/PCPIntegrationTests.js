/**
 * GPII PCP Integration Tests
 *
 * Copyright 2015 Raising the Floor - International
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
    configPath = path.resolve(__dirname, "configs"),
    kettle = require("kettle"),
    gpii = fluid.registerNamespace("gpii");

require("universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.integration.PCPInterface");

gpii.tests.integration.PCPInterface.checkConnectionRequest = function (data, client) {
    jqUnit.assertEquals("Connection succeeded", "Client has successfully established connection to the PCP Channel", data);

    // connect socket events to the client events so we can test it
    client.socket.on("login", client.events.onLogin.fire);
    client.socket.on("logout", client.events.onLogout.fire);
    client.socket.on("message", client.events.onMessage.fire);
};

fluid.defaults("gpii.tests.integration.PCPInterface.basicClient", {
    gradeNames: ["kettle.test.request.io", "autoInit"],
    path: "/pcpChannel",
    port: 8081,
    listenOnInit: true,
    events: {
        onLogin: null,
        onLogout: null,
        onMessage: null
    }
});

gpii.tests.integration.PCPInterface.checkPCPLoginEvent = function (data, expected) {
    jqUnit.assertDeepEq("Testing login event on PCP client", expected, data);
};

gpii.tests.integration.PCPInterface.onLogout = function () {
    jqUnit.assertTrue("Logout event received on client side of socket", true);
};

gpii.tests.integration.PCPInterface.onMessage = function (data, expected) {
    jqUnit.assertDeepEq("Message succusfully received by socket client", expected, data);

};

fluid.defaults("gpii.tests.integration.PCPInterface.mockServer", {
    gradeNames: ["autoInit", "fluid.littleComponent"],
    invokers: {
        set: {
            funcName: "gpii.tests.integration.PCPInterface.mockServer.set"
        }
    }
});

gpii.tests.integration.PCPInterface.mockServer.set = function () {
    fluid.fail();
    return fluid.promise();
};

var testDefs = [{
    name: "Flow Manager PCPInterface tests",
    expect: 3,
    config: {
        configName: "localInstall",
        configPath: configPath
    },
    userToken: "screenreader_common",
    gradeNames: "gpii.test.integration.testCaseHolder.windows",
    components: {
        client: {
            type: "gpii.tests.integration.PCPInterface.basicClient"
        }
    },
    sequence: [
        {   // connect the PCP client first
            func: "{client}.send"
        }, {
            event: "{client}.events.onComplete",
            listener: "gpii.tests.integration.PCPInterface.checkConnectionRequest",
            args: [ "{arguments}.0", "{client}" ]
        }, {
            // Test login notification on user login
            func: "{loginRequest}.send"
        }, {
            event: "{client}.events.onLogin",
            listener: "gpii.tests.integration.PCPInterface.checkPCPLoginEvent",
            args: [ "{arguments}.0", {
                "userToken": "screenreader_common",
                "settings": {
                    "http://registry.gpii.net/common/highContrastEnabled": false
                },
                "multiUser": false,
                "pendingMsgs": []
            }]
        // }, {
        //     event: "{client}.events.onMessage",
        //     listener: "gpii.tests.integration.PCPInterface.onMessage",
        //     args: [ "{arguments}.0",
        //         { type: "infoMessage", message: "The token screenreader_common was logged in." }
        //     ]
        }, {
            // Test logout notification gets passed to socket client
            func: "{logoutRequest}.send"
        }, {
            event: "{client}.events.onLogout",
            listener: "gpii.tests.integration.PCPInterface.onLogout"
        // }, {
        //     event: "{client}.events.onMessage",
        //     listener: "gpii.tests.integration.PCPInterface.onMessage",
        //     args: [ "{arguments}.0",
        //         { type: "infoMessage", message: "The token screenreader_common was logged out." }
        //     ]
        }
    ]
}];

module.exports = kettle.test.bootstrapServer(testDefs);