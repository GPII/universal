/*!
Copyright 2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

require("../../shared/FlowManagerSettingsPutTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");

gpii.tests.cloud.oauth2.settingsPut.config = {
    configName: "gpii.config.cloudBased.development",
    configPath: "%gpii-universal/gpii/configs"
};

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.requests", {
    gradeNames: ["fluid.component"],
    components: {
        settingsPutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings",
                port: 8081,
                method: "PUT",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey"
                }
            }
        }
    }
});

fluid.each(gpii.tests.cloud.oauth2.settingsPut.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.cloud.oauth2.settingsPut.config
    );
});

// Tests showing the inability to update a snapset
gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTests = {
    testDef: {
        name: "Flow manager tests - attempt (and fail) to update a snapset",
        expect: 10,
        config: gpii.tests.cloud.oauth2.settingsPut.config,
        components: {
            accessTokenRequestUpdateSnapset: {
                type: "kettle.test.request.http",
                options: {
                    path: "/access_token",
                    method: "POST",
                    expectedStatusCode: 200
                }
            },
            lifeCycleRequest: {
                type: "kettle.test.request.http",
                options: {
                    path: fluid.stringTemplate("/%gpiiKey/settings/%device", {
                        gpiiKey: gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
                        device: encodeURIComponent(JSON.stringify(
                            gpii.tests.cloud.oauth2.settingsPut.updateSnapset.device
                        ))}
                    ),
                    headers: {
                        "Authorization": "Bearer token" // set at test run
                    },
                    method: "GET",
                    expectedStatusCode: 200
                }
            },
            putSettingsRequestFailure: { // can't update snapset (readonly)
                type: "kettle.test.request.http",
                options: {
                    path: "/%gpiiKey/settings",
                    termMap: {
                        "gpiiKey": gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey
                    },
                    headers: {
                        "Authorization": "Bearer token" // set at test run
                    },
                    method: "PUT",
                    expectedStatusCode: 404,
                    expectedPayload: {
                        "isError": true,
                        "message": "Cannot update:  GPII key \"" + gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey + "\" is a snapset while executing HTTP PUT on url http://localhost:8081/preferences/%gpiiKey?merge=%merge"
                    }
                }
            }
        }
    },
    disruptions: [{
        gradeName: "gpii.tests.cloud.oauth2.settingsPut.updateSnapsetFailure"
    }]
};

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.updateSnapsetFailure", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.sequence"
});

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTests.testDef,
    {},
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTests.disruptions,
    gpii.tests.cloud.oauth2.settingsPut.config
);
