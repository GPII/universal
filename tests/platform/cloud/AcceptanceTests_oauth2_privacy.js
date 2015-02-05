"use strict";

var fluid = require("universal");
var gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

require("./OAuth2AcceptanceDataStore.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.privacy");

gpii.tests.cloud.oauth2.privacy.sequence = [
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

gpii.tests.cloud.oauth2.privacy.testDefs = [
    {
        name: "Acceptance test for Privacy Settings page with Easit4all authorization",
        username: "alice",
        password: "a",
        expectedPrivacySettingsContents: [
            "Easit4all"
        ],
        // TODO I think we want some indirection here
        sequence: gpii.tests.cloud.oauth2.privacy.sequence
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.privacySettingsRequests", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    components: {
        privacySettingsRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/authorized-services",
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
                path: "/authorized-services",
                port: 8081
            }
        }
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.noDisruption", {
    gradeNames: ["gpii.tests.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.privacySettingsRequests"
});

gpii.tests.cloud.oauth2.privacy.disruptions = [{
    gradeName: "gpii.tests.cloud.oauth2.noDisruption"
}];

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.privacy.testDefs[0],
    {},
    gpii.tests.cloud.oauth2.privacy.disruptions,
    __dirname
);
