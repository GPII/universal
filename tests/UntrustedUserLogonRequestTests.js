/*
 * Untrusted User Logon Request Tests
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
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

require("./shared/UserLogonRequestTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonRequest");

// 1. Tests for general user logon request tests
gpii.test.bootstrapServer(gpii.tests.userLogonRequest.buildTestDefs(gpii.tests.userLogonRequest.testDefs, "untrusted"));

// 2. Specific tests for untrusted environment only.
// Test the user report on NoConnection when the cloud cannot be accessed
gpii.tests.untrusted.userLogonRequest.buildTestDefs = function (testDefs) {
    var config = {
        configName: "gpii.config.untrusted.development",
        configPath: "%gpii-universal/gpii/configs"
    };

    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            config: config,
            gpiiKey: testDefs.gpiiKey || gpii.tests.userLogonRequest.gpiiKey,
            distributeOptions: {
                "flowManager.escalate": {
                    "record": {
                        "resetAtStartSuccess.escalate": "{testEnvironment}.events.resetAtStartSuccess"
                    },
                    "target": "{that gpii.flowManager.local}.options.listeners"
                }
            }
        }, gpii.tests.userLogonRequest.commonTestConfig, testDef);
    });
};

// Override the original "kettle.test.testDefToServerEnvironment" function provided by kettle library to boil a new
// aggregate event "onAllReady" that listens to both "onServerReady" and "{flowManager}.events.resetAtStartSuccess" events
kettle.test.testDefToServerEnvironment = function (testDef) {
    var configurationName = testDef.configType || kettle.config.createDefaults(testDef.config);
    return {
        type: "kettle.test.serverEnvironment",
        options: {
            configurationName: configurationName,
            components: {
                tests: {
                    options: kettle.test.testDefToCaseHolder(configurationName, testDef)
                }
            },
            events: {
                resetAtStartSuccess: null
            }
        }
    };
};

gpii.tests.untrusted.userLogonRequest.untrustedSpecificTests = [{
    name: "GPII-3529: report NoConnection user error when no cloud connection",
    expect: 2,
    sequence: [{
        event: "{kettle.test.serverEnvironment}.events.resetAtStartSuccess",
        listener: "fluid.identity"
    }, {
        // standard login without a cloud
        func: "gpii.tests.invokePromiseProducer",
        args: ["{lifecycleManager}.performLogin", [gpii.tests.userLogonRequest.gpiiKey], "{that}"]
    }, {
        event: "{that}.events.onError",
        listener: "gpii.tests.userLogonRequest.testUserError",
        args: ["{arguments}.0",
            {
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "127.0.0.1",
                "port": 8084,
                "isError": true
            },
            "{lifecycleManager}.userErrors.options.trackedUserErrors",
            {
                "isError": true,
                "messageKey": "NoConnection",
                "originalError": {
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 8084,
                    "isError": true
                }
            }
        ]
    }]
}];

kettle.test.bootstrapServer(gpii.tests.untrusted.userLogonRequest.buildTestDefs(gpii.tests.untrusted.userLogonRequest.untrustedSpecificTests));
