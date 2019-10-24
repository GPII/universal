/*
 * GPII Untrusted Flow Manager Development Tests
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
require("./shared/DevelopmentTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.development");

gpii.tests.untrusted.development.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.config.untrusted.development.local",
                configPath: "%gpii-universal/gpii/configs/shared"
            }
        });

        return testDef;
    });
};

// With untrusted config, nonexistent GPII keys can only key in with client credentials that have privilege
// to create nonexistent GPII keys and prefs safes.
// Note that with all-in-local config, nonexistent GPII keys are able to key in and key out.
gpii.tests.development.nonexistentKeyInWithPrivTestDefs = [{
    name: "Flow Manager test: Key in and key out with a nonexistent GPII key",
    expect: 2,
    gpiiKey: "nonexistent_gpii_key",
    distributeOptions: {
        "test.clientCredentialFilePath": {
            "record": "%gpii-universal/tests/data/clientCredentials/nova.json",
            "target": "{that gpii.flowManager.untrusted settingsDataSource}.options.clientCredentialFilePath",
            priority: "after:flowManager.clientCredentialFilePath"
        }
    },
    sequenceGrade: "gpii.tests.development.commonTestSequence"
}];

gpii.tests.development.nonexistentKeyInWithoutPrivTestDefs = [{
    name: "Flow Manager test: Key in and key out with a nonexistent GPII key",
    expect: 3,
    gpiiKey: "nonexistent_gpii_key",
    gradeNames: ["gpii.test.testCaseHolder"],
    sequence: [{
        // login with a nonexistent GPII key
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            errorTexts: "server_error while executing HTTP POST on url",
            statusCode: 401,
            string: "{arguments}.0",
            request: "{loginRequest}"
        }
    }]
}];

gpii.test.runCouchTestDefs(gpii.tests.untrusted.development.buildTestDefs(gpii.tests.development.testDefs));
gpii.test.runCouchTestDefs(gpii.tests.untrusted.development.buildTestDefs(gpii.tests.development.nonexistentKeyInWithPrivTestDefs));
gpii.test.runCouchTestDefs(gpii.tests.untrusted.development.buildTestDefs(gpii.tests.development.nonexistentKeyInWithoutPrivTestDefs));
