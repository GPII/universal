/**
GPII "GET /settings" tests using a production configuration where there are
separate docker containers running a cloud-based flowmanaer, preferences server
and couch data base

Requirements:
* an internet connection
* a cloud based flow manager
* a preferences server
* a couchdb containing at least the standard snapset GPII keys and prefs safes

---

Copyright 2015 Raising the Floor - International
Copyright 2018-2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

fluid.registerNamespace("gpii.tests.productionConfigTesting");
fluid.registerNamespace("gpii.test.cloudBased.oauth2");

/*
 * ========================================================================
 * Testing of untrusted local config with the live cloud based flow manager
 * ========================================================================
 */

require("./ProductionTestsUtils.js");
require("../shared/FlowManagerSettingsGetTestDefs.js");

gpii.loadTestingSupport();

// GET /settings tests

fluid.defaults("gpii.tests.productionConfigTesting.settingsGet.testCaseHolder", {
    gradeNames: ["gpii.test.cloudBased.oauth2.testCaseHolder"],
    productionHostConfig: {
        hostname: "flowmanager",
        port: 9082
    },
    distributeOptions: {
        "accessTokenRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest}.options"
        },
        "accessTokenRequest_settings.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest_settings}.options"
        },
        "settingsRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that settingsRequest}.options"
        }
    }
});

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsGet.disruptedTests,
    gpii.tests.productionConfigTesting.config,
    "gpii.test.serverEnvironment",
    "gpii.tests.productionConfigTesting.settingsGet.testCaseHolder"
);
