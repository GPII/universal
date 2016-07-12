/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("universal");
var gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

require("./OAuth2AcceptanceDataStore.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.privacySettings");

gpii.tests.cloud.oauth2.privacySettings.sequence = [
    {
        func: "{privacySettingsRequest}.send"
    },
    {
        event: "{privacySettingsRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyLoginRedirect",
        args: ["{privacySettingsRequest}", "{cookieJar}"]
    },
    {
        funcName: "gpii.test.cloudBased.oauth2.sendLoginRequest",
        args: ["{loginRequest}", "{testCaseHolder}.options"]
    },
    {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyPrivacySettingsRedirect",
        args: ["{loginRequest}", "{privacySettingsRequest}"]
    },
    {
        funcName: "gpii.test.cloudBased.oauth2.sendPrivacySettingsRequest2",
        args: ["{privacySettingsRequest2}", "{loginRequest}"]
    },
    {
        event: "{privacySettingsRequest2}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyPrivacySettingsResponse",
        args: ["{arguments}.0", "{privacySettingsRequest2}",
            "{testCaseHolder}.options.expectedPrivacySettingsContents"]
    },
    {
        func: "{postAuthorizationRequest}.send",
        args: ["{testCaseHolder}.options.newAuthorization"]
    },
    {
        event: "{postAuthorizationRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyDataStoreAuthorization",
        args: ["{testCaseHolder}.configuration.server.flowManager.oauth2DataStore",
              "{testCaseHolder}.options.expectedAuthDecision"]
    },
    {
        func: "{logoutRequest}.send"
    },
    {
        func: "{privacySettingsRequest3}.send"
    },
    {
        event: "{privacySettingsRequest3}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyLoginRedirect",
        args: ["{privacySettingsRequest3}", "{cookieJar}"]
    }
];

gpii.tests.cloud.oauth2.privacySettings.testDefs = [
    {
        name: "Acceptance test for Privacy Settings page with Easit4all authorization",
        username: "alice",
        password: "a",
        expectedPrivacySettingsContents: [
            "Easit4all"
        ],
        newAuthorization: {
            oauth2ClientId: "org.chrome.cloud4chrome",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTests": true }
        },
        expectedAuthDecision: {
            userId: 2,
            clientId: 1,
            redirectUri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTests": true },
            revoked: false
        }
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.privacySettingsRequests", {
    gradeNames: ["fluid.component"],
    components: {
        privacySettingsRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/privacy-settings",
                port: 8081
            }
        },
        privacySettingsRequest2: {
            type: "kettle.test.request.httpCookie",
            options: {
                // path: - supplied dynamically based on returned redirect from previous request
                port: 8081
            }
        },
        postAuthorizationRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/authorizations",
                port: 8081,
                method: "POST"
            }
        },
        logoutRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/logout",
                port: 8081,
                method: "POST"
            }
        },
        privacySettingsRequest3: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/privacy-settings",
                port: 8081
            }
        }
    }
});

fluid.defaults("gpii.tests.disruption.privacySettingsSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.privacySettingsRequests",
    sequenceName: "gpii.tests.cloud.oauth2.privacySettings.sequence"
});

gpii.tests.cloud.oauth2.privacySettings.disruptions = [{
    gradeName: "gpii.tests.disruption.privacySettingsSequence"
}];

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.privacySettings.testDefs[0],
    {},
    gpii.tests.cloud.oauth2.privacySettings.disruptions,
    __dirname
);
