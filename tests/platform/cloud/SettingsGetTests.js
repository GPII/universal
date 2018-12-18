/*!
Copyright 2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit");

fluid.require("%gpii-universal");

require("../../shared/CloudFlowManagerTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsGet");

gpii.tests.cloud.oauth2.settingsGet.config = {
    configName: "gpii.config.cloudBased.development",
    configPath: "%gpii-universal/gpii/configs"
};

gpii.tests.cloud.oauth2.settingsGet.verifyRefetchedAccessToken = function (body, refetchAccessTokenRequest, initialAccessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiKeyAccessTokenInResponse(body, refetchAccessTokenRequest);
    jqUnit.assertNotEquals("A new access token is issued at the refetch", initialAccessTokenRequest.access_token, refetchAccessTokenRequest.access_token);
};

gpii.tests.cloud.oauth2.settingsGet.verifyPayloadMatchMakerOutput = function (body, expectedMatchMakerOutput) {
    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("Verify expected matchMakerOutput", expectedMatchMakerOutput, payload.matchMakerOutput);
};

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest_settings: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                method: "POST"
            }
        },
        settingsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings/%device",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey",
                    device: {
                        expander: {
                            func: "gpii.test.cloudBased.computeDevice",
                            args: [
                                [
                                    "org.gnome.desktop.a11y.magnifier",
                                    "org.gnome.desktop.interface",
                                    "org.alsa-project"
                                ],
                                "linux"
                            ]
                        }
                    }
                }
            }
        }
    }
});

fluid.each(gpii.tests.cloud.oauth2.settingsGet.disruptedTests, function (oneTest) {
    debugger;
    var whatsthis = gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.cloud.oauth2.settingsGet.config
    );
    debugger;
});
