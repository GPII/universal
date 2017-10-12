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

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.privacySettings");

gpii.tests.cloud.oauth2.privacySettings.verifyPrivacySettingsRedirect = function (loginRequest, privacySettingsRequest) {
    gpii.test.verifyRedirectResponse(loginRequest, privacySettingsRequest.nativeRequest.path);
    var response = loginRequest.nativeResponse;
    jqUnit.assertTrue("Should have been redirected to /privacy-settings", response.headers.location.indexOf("/privacy-settings") === 0);
};

gpii.tests.cloud.oauth2.privacySettings.sendPrivacySettingsRequest = function (privacySettingsRequest2, loginRequest) {
    privacySettingsRequest2.send(null, {
        path: loginRequest.nativeResponse.headers.location
    });
};

gpii.tests.cloud.oauth2.privacySettings.verifyPrivacySettingsResponse = function (body, privacySettingsRequest, expectedParts) {
    gpii.test.verifyHTMLResponse(body, privacySettingsRequest);
    gpii.test.verifyBodyContents(body, expectedParts);
};

gpii.tests.cloud.oauth2.privacySettings.verifyDataStoreAuthorization = function (clientType, dataStore, expectedAuthorization, verificationDoneEvent) {
    var findAuthorizationPromise;

    if (clientType === gpii.oauth2.docTypes.webPrefsConsumerAuthorization) {
        findAuthorizationPromise = dataStore.findWebPrefsConsumerAuthorization(expectedAuthorization.gpiiToken,
                                                                 expectedAuthorization.clientId,
                                                                 expectedAuthorization.redirectUri);
    } else {
        findAuthorizationPromise = dataStore.findOnboardedSolutionAuthorization(expectedAuthorization.gpiiToken,
                                                                 expectedAuthorization.clientId);
    }

    findAuthorizationPromise.then(function (foundAuthorization) {
        jqUnit.assertValue("The dataStore contains a matching authorization", foundAuthorization);
        jqUnit.assertValue("id has a value", foundAuthorization.id);

        var expected = fluid.extend(expectedAuthorization, {id: foundAuthorization.id});
        if (clientType === gpii.oauth2.docTypes.webPrefsConsumerAuthorization) {
            jqUnit.assertValue("accessToken has a value", foundAuthorization.accessToken);
            expected = fluid.extend(expected, {accessToken: foundAuthorization.accessToken});
        }

        jqUnit.assertDeepEq("Authorization contents are as expected",
                            expected,
                            foundAuthorization);
        verificationDoneEvent.fire();
    });
};

gpii.tests.cloud.oauth2.privacySettings.sequence = fluid.freezeRecursive([
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
        listener: "gpii.tests.cloud.oauth2.privacySettings.verifyPrivacySettingsRedirect",
        args: ["{loginRequest}", "{privacySettingsRequest}"]
    },
    {
        funcName: "gpii.tests.cloud.oauth2.privacySettings.sendPrivacySettingsRequest",
        args: ["{privacySettingsRequest2}", "{loginRequest}"]
    },
    {
        event: "{privacySettingsRequest2}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.privacySettings.verifyPrivacySettingsResponse",
        args: ["{arguments}.0", "{privacySettingsRequest2}",
            "{testCaseHolder}.options.expectedPrivacySettingsContents"]
    },
    {  // Add a new authorization for a web prefs consumer client
        func: "{postAuthorizationRequest1}.send",
        args: ["{testCaseHolder}.options.newWebPrefsConsumerAuthorization"]
    },
    {
        event: "{postAuthorizationRequest1}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.privacySettings.verifyDataStoreAuthorization",
        args: [
            gpii.oauth2.docTypes.webPrefsConsumerAuthorization,
            "{testCaseHolder}.configuration.server.flowManager.oauth2DataStore",
            "{testCaseHolder}.options.expectedWebPrefsConsumerAuthorization",
            "{testCaseHolder}.events.webPrefsConsumerAuthorizationVerificationDone"
        ]
    },
    {
        event: "{testCaseHolder}.events.webPrefsConsumerAuthorizationVerificationDone",
        listener: "fluid.identity"
    },
    {  // Add a new authorization for an onboarded solution client
        func: "{postAuthorizationRequest2}.send",
        args: ["{testCaseHolder}.options.newOnboardedSolutionAuthorization"]
    },
    {
        event: "{postAuthorizationRequest2}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.privacySettings.verifyDataStoreAuthorization",
        args: [
            gpii.oauth2.docTypes.onboardedSolutionAuthorization,
            "{testCaseHolder}.configuration.server.flowManager.oauth2DataStore",
            "{testCaseHolder}.options.expectedOnboardedSolutionAuthorization",
            "{testCaseHolder}.events.onboardedSolutionAuthorizationVerificationDone"
        ]
    },
    {
        event: "{testCaseHolder}.events.onboardedSolutionAuthorizationVerificationDone",
        listener: "fluid.identity"
    },
    {
        func: "{logoutRequest}.send"
    },
    {
        event: "{logoutRequest}.events.onComplete",
        listener: "fluid.identity"
    },
    {
        func: "{privacySettingsRequest3}.send"
    },
    {
        event: "{privacySettingsRequest3}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyLoginRedirect",
        args: ["{privacySettingsRequest3}", "{cookieJar}"]
    }
]);

gpii.tests.cloud.oauth2.privacySettings.testDefs = [
    {
        name: "Acceptance test for Privacy Settings page with web prefs consumer and onboarded solution authorizations",
        username: "alice",
        password: "a",
        expectedPrivacySettingsContents: [
            "Easit4all"
        ],
        newWebPrefsConsumerAuthorization: {
            clientId: "org.chrome.cloud4chrome",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTestsForWebPrefsConsumer": true }
        },
        expectedWebPrefsConsumerAuthorization: {
            type: "webPrefsConsumerAuthorization",
            gpiiToken: "alice_gpii_token",
            clientId: "client-1",
            redirectUri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTestsForWebPrefsConsumer": true },
            revoked: false
        },
        newOnboardedSolutionAuthorization: {
            clientId: "org.gnome.desktop.a11y.magnifier",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTestsForOnboardedSolution": true }
        },
        expectedOnboardedSolutionAuthorization: {
            type: "onboardedSolutionAuthorization",
            gpiiToken: "alice_gpii_token",
            clientId: "client-3",
            selectedPreferences: { "setByPrivacySettingsAcceptanceTestsForOnboardedSolution": true },
            revoked: false
        },
        events: {
            webPrefsConsumerAuthorizationVerificationDone: null,
            onboardedSolutionAuthorizationVerificationDone: null
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
        postAuthorizationRequest1: {
            type: "kettle.test.request.httpCookie",
            options: {
                path: "/authorizations",
                port: 8081,
                method: "POST"
            }
        },
        postAuthorizationRequest2: {
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
