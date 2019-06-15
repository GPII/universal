/*
 * Untrusted User logon Handlers Tests
 *
 * Copyright 2015 OCAD University
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

fluid.require("%gpii-universal");

require("./shared/UserLogonHandlersTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonHandling");

gpii.tests.untrusted.userLogonHandling.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.untrusted.userLogon.config",
                configPath: "%gpii-universal/tests/configs"
            },
            gradeNames: ["gpii.tests.userLogonHandlers.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
            gpiiKey: testDefIn.gpiiKey || gpii.tests.userLogonHandlers.gpiiKey
        });

        return testDef;
    });
};

// With untrusted config, nonexistent GPII keys can only key in with client credentials that have privilege
// to create nonexistent GPII keys and prefs safes.
// Note that with all-in-local config, nonexistent GPII keys are able to key in and key out.
gpii.tests.untrusted.userLogonHandling.nonexistentKeyInTestDefs = [{
    name: "Testing keyin and keyout with a nonexistent GPII key using a client credential that has privilege to access nonexistent GPII keys",
    expect: 2,
    distributeOptions: {
        "test.clientCredentialFilePath": {
            "record": "%gpii-universal/tests/data/clientCredentials/nova.json",
            "target": "{that gpii.flowManager.untrusted settingsDataSource}.options.clientCredentialFilePath",
            priority: "after:flowManager.clientCredentialFilePath"
        }
    },
    sequence: [{
        // keyin with a nonexistent GPII key
        func: "{loginNonexistentRequest}.send"
    }, {
        event: "{loginNonexistentRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLoginResponse",
        args: ["{arguments}.0", "nonexistent-gpii-key"]
    }, {
        // keyout with a nonexistent GPII key
        func: "{logoutNonexistentRequest}.send"
    }, {
        event: "{logoutNonexistentRequest}.events.onComplete",
        listener: "gpii.tests.userLogonHandlers.testLogoutResponse",
        args: ["{arguments}.0", "nonexistent-gpii-key"]
    }]
}, {
    name: "Testing keyin with a nonexistent GPII key with a client that doesn't have the privilege to access nonexistent GPII keys",
    expect: 3,
    sequence: [{
        // login with a nonexistent GPII key
        func: "{loginNonexistentRequest}.send"
    }, {
        event: "{loginNonexistentRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            errorTexts: "server_error while executing HTTP POST on url",
            statusCode: 401,
            string: "{arguments}.0",
            request: "{loginNonexistentRequest}"
        }
    }]
}];

gpii.test.runCouchTestDefs(gpii.tests.untrusted.userLogonHandling.buildTestDefs(gpii.tests.userLogonHandlers.testDefs));
gpii.test.runCouchTestDefs(gpii.tests.untrusted.userLogonHandling.buildTestDefs(gpii.tests.untrusted.userLogonHandling.nonexistentKeyInTestDefs));
