/*
 * Untrusted User Logon Request Tests
 *
 * Copyright 2018-2019 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

require("./shared/UserLogonRequestTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonRequest");

// Specific tests for untrusted environment without database connection.
// Test the user report on NoConnection when the cloud cannot be accessed
gpii.tests.untrusted.userLogonRequest.buildTestDefs = function (testDefs) {
    var config = {
        configName: "gpii.config.untrusted.development",
        configPath: "%gpii-universal/gpii/configs/shared"
    };

    return fluid.transform(testDefs, function (testDef) {
        return fluid.extend(true, {
            config: config,
            gpiiKey: testDefs.gpiiKey || gpii.tests.userLogonRequest.gpiiKey
        }, gpii.tests.userLogonRequest.commonTestConfig, testDef);
    });
};

gpii.tests.untrusted.userLogonRequest.untrustedWithoutDbConnection = [{
    name: "GPII-3529: report NoConnection user error when no cloud connection",
    expect: 2,
    sequence: [{
        // standard login without a cloud
        task: "{lifecycleManager}.performLogin",
        args: [gpii.tests.userLogonRequest.gpiiKey],
        reject: "gpii.tests.userLogonRequest.testUserError",
        rejectArgs: ["{arguments}.0",
            {
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "127.0.0.1",
                "port": 8084,
                "isError": true
            },
            "{lifecycleManager}.userErrors.trackedUserErrors",
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

gpii.tests.untrusted.userLogonRequest.nonexistentKeyInTestDefs = [{
    name: "Testing login and logout with a nonexistent GPII key using a client credential that has privilege to access nonexistent GPII keys",
    expect: 2,
    gpiiKey: "bogusToken",
    distributeOptions: {
        "test.clientCredentialFilePath": {
            "record": "%gpii-universal/tests/data/clientCredentials/nova.json",
            "target": "{that gpii.flowManager.untrusted settingsDataSource}.options.clientCredentialFilePath",
            priority: "after:flowManager.clientCredentialFilePath"
        }
    },
    sequence: [
        {
            // login with a non-existing GPII key
            task: "{lifecycleManager}.performLogin",
            args: ["{testCaseHolder}.options.gpiiKey"],
            resolve: "gpii.tests.userLogonRequest.testLoginResponse",
            resolveArgs: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey"]
        },
        {
            event: "{lifecycleManager}.events.onQueueEmpty",
            listener: "fluid.identity"
        },
        {
            // logout of different user
            task: "{lifecycleManager}.performLogout",
            args: ["{testCaseHolder}.options.gpiiKey"],
            resolve: "gpii.tests.userLogonRequest.testLogoutResponse",
            resolveArgs: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey"]
        }
    ]
}, {
    name: "Testing keyin with a nonexistent GPII key with a client that doesn't have the privilege to access nonexistent GPII keys",
    expect: 2,
    gpiiKey: "bogusToken",
    sequence: [{
        task: "{lifecycleManager}.performLogin",
        args: ["{testCaseHolder}.options.gpiiKey"],
        reject: "gpii.tests.userLogonRequest.testUserError",
        rejectArgs: ["{arguments}.0",
            {
                "error_description": "Unauthorized",
                "message": "server_error while executing HTTP POST on url http://localhost:8084/access_token",
                "isError": true,
                "statusCode": 401
            },
            "{lifecycleManager}.userErrors.trackedUserErrors",
            {
                "isError": true,
                "messageKey": "KeyInFail",
                "originalError": "server_error while executing HTTP POST on url http://localhost:8084/access_token"
            }
        ]
    }]
}];

// Tests for general user logon request tests
gpii.test.runCouchTestDefs(gpii.tests.userLogonRequest.buildTestDefs(gpii.tests.userLogonRequest.testDefs, "untrusted"));

// Specific tests for untrusted environment without database connection.
gpii.test.runCouchTestDefs(gpii.tests.untrusted.userLogonRequest.buildTestDefs(gpii.tests.untrusted.userLogonRequest.untrustedWithoutDbConnection));

// Tests for key in and key out processes for nonexistent GPII keys
gpii.test.runCouchTestDefs(gpii.tests.userLogonRequest.buildTestDefs(gpii.tests.untrusted.userLogonRequest.nonexistentKeyInTestDefs, "untrusted"));
