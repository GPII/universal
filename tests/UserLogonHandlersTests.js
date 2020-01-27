/*
 * User Logon Handlers Tests
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

require("./shared/UserLogonHandlersTestDefs.js");

// With all-in-local config, nonexistent GPII keys are able to key in and key out.
// Note that with untrusted config, nonexistent GPII keys can only key in with client credentials that have privilege
// to create nonexistent GPII keys and prefs safes.
gpii.tests.userLogonHandlers.nonexistentKeyInTestDefs = [{
    name: "Testing login and logout with a nonexistent GPII key",
    expect: 2,
    sequence: [{
        // login with a nonexistent GPII key
        func: "{loginNonexistentRequest}.send"
    }, {
        event: "{loginNonexistentRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse",
        args: ["{arguments}.0", "nonexistent-gpii-key"]
    }, {
        // logout with a nonexistent GPII key
        func: "{logoutNonexistentRequest}.send"
    }, {
        event: "{logoutNonexistentRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", "nonexistent-gpii-key"]
    }]
}];

gpii.test.runCouchTestDefs(gpii.tests.userLogonHandlers.buildTestDefs(gpii.tests.userLogonHandlers.testDefs));
gpii.test.runCouchTestDefs(gpii.tests.userLogonHandlers.buildTestDefs(gpii.tests.userLogonHandlers.nonexistentKeyInTestDefs));
