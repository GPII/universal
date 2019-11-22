/*
 * User Logon Request Tests
 *
 * Copyright 2013 OCAD University
 * Copyright 2019 OCAD University
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
    gpii = fluid.registerNamespace("gpii");

require("./shared/UserLogonRequestTestDefs.js");

// With all-in-local config, nonexistent GPII keys are able to key in and key out.
// Note that with untrusted config, nonexistent GPII keys can only key in with client credentials that have privilege
// to create nonexistent GPII keys and prefs safes.
gpii.tests.userLogonRequest.nonexistentKeyInTestDefs = [{
    name: "Testing login and logout with a nonexistent GPII key",
    expect: 2,
    gpiiKey: "bogusToken",
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
}];

gpii.test.runCouchTestDefs(gpii.tests.userLogonRequest.buildTestDefs(gpii.tests.userLogonRequest.testDefs));
gpii.test.runCouchTestDefs(gpii.tests.userLogonRequest.buildTestDefs(gpii.tests.userLogonRequest.nonexistentKeyInTestDefs));
