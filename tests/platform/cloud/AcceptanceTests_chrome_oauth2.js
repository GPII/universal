/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2.chrome");
gpii.loadTestingSupport();

require("./OAuth2AcceptanceDataStore.js");

gpii.tests.cloud.oauth2.chrome.common = {
    client_id: "org.chrome.cloud4chrome",
    client_secret: "client_secret_chrome",
    redirect_uri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
    state: "The Client's Unique State",
    username: "bob",
    password: "b"
};

// A grade, applied to the testCaseHolder itself, to be used for testing whether
// the access token supplied for the settings request is checked. This overrides
// the definition of the settings request so that the member, ordinarily returned
// by the accessTokenRequest's fixture, holds an invalid value - and the test
// sequence as a whole is truncated so that this request is never actually issued
fluid.defaults("gpii.tests.cloud.oauth2.falseTokenHolder", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest: {
            type: "fluid.component",
            options: {
                members: {
                    accessToken: "FALSE TOKEN"
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.authorizationRequests", {
    gradeNames: ["fluid.component"],
    updatedSelectedPreferences: {},
    components: {
        putAuthorizationRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                // path: "/authorizations/%authorizationId/preferences", // TODO: currently cannot be dynamically templated
                method: "PUT"
            }
        },
        getAuthorizationRequest2: {
            type: "kettle.test.request.httpCookie"
                // path: "/authorizations/%authorizationId/preferences", // TODO: currently cannot be dynamically templated
        }
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.revocationRequests", {
    gradeNames: ["fluid.component"],
    updatedSelectedPreferences: {},
    components: {
        revocationRequest: {
            type: "kettle.test.request.httpCookie",
            options: {
                // path: "/authorizations/%authorizationId/preferences", // TODO: currently cannot be dynamically templated
                method: "DELETE"
            }
        },
        getAuthorizationRequest2: {
            type: "kettle.test.request.httpCookie"
                // path: "/authorizations/%authorizationId/preferences", // TODO: currently cannot be dynamically templated
        }
    }
});


// A set of grades derived from "gpii.test.disruption.mainSequence" encoding disruptions of the
// OAuth conversation at four interception points

fluid.defaults("gpii.tests.cloud.oauth2.disruptLoginRequest", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    truncateAt: 3,
    expect: 4,
    expectedStatusCode: 302,
    recordName: "loginRequestForm",
    finalRecord: {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{loginRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptDecisionRequest", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    truncateAt: 7,
    expect: 11,
    expectedStatusCode: 400,
    recordName: "decisionRequestForm",
    finalRecord: {
        event: "{decisionRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{decisionRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptAccessToken", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    truncateAt: 9,
    expect: 14,
    expectedStatusCode: 401,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptSettingsRequest", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.falseTokenHolder",
    truncateAt: 15,
    expect: 1,
    startAt: 14,
    expectedStatusCode: 401,
    finalRecord: {
        event: "{securedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{securedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptWithUpdatedDecision", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.authorizationRequests",
    insertAt: 14,
    expect: 22,
    insertRecords: [{
        funcName: "gpii.test.cloudBased.oauth2.sendAuthorizationRequest",
        args: ["{putAuthorizationRequest}", "{getAuthorizedServicesRequest}.authorizedService.authDecisionId",
            "/preferences", "{testCaseHolder}.options.updatedSelectedPreferences"]
    }, {
        event: "{putAuthorizationRequest}.events.onComplete",
        listener: "fluid.identity"
    }, {
        funcName: "gpii.test.cloudBased.oauth2.sendAuthorizationRequest",
        args: ["{getAuthorizationRequest2}", "{getAuthorizedServicesRequest}.authorizedService.authDecisionId",
            "/preferences"]
    }, {
        event: "{getAuthorizationRequest2}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyGetAuthorization",
        args: ["{arguments}.0", "{testCaseHolder}.options.updatedSelectedPreferences"]
    }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptWithRevocation", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.revocationRequests",
    truncateAt: 14,
    insertAt: 14,
    expect: 20,
    insertRecords: [{
        funcName: "gpii.test.cloudBased.oauth2.sendAuthorizationRequest",
        args: ["{revocationRequest}", "{getAuthorizedServicesRequest}.authorizedService.authDecisionId",
            null, "{testCaseHolder}.options.updatedSelectedPreferences"]
    }, {
        event: "{revocationRequest}.events.onComplete",
        listener: "fluid.identity"
    }, {
        funcName: "gpii.test.cloudBased.oauth2.sendAuthorizationRequest",
        args: ["{getAuthorizationRequest2}", "{getAuthorizedServicesRequest}.authorizedService.authDecisionId",
            "/preferences"]
    }, {
        event: "{getAuthorizationRequest2}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{getAuthorizationRequest2}", 404]
    }, {
        funcName: "gpii.test.cloudBased.oauth2.sendSecuredSettingsRequest",
        args: ["{securedSettingsRequest}", "{accessTokenRequest}"]
    }, { // TODO: We should have a method of rescuing this duplicated material from gpii.tests.cloud.oauth2.disruptSettingsRequest
        event: "{securedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{securedSettingsRequest}", 401]
    }
    ]
});

gpii.tests.cloud.oauth2.chrome.disruptions = [{
    name: "Access secured settings with false token",
    gradeName: "gpii.tests.cloud.oauth2.disruptSettingsRequest"
}, {
    name: "Attempt to log in with no username",
    gradeName: "gpii.tests.cloud.oauth2.disruptLoginRequest",
    changes: {
        path: "username",
        type: "DELETE"
    }
}, {
    name: "Attempt to log in with no password",
    gradeName: "gpii.tests.cloud.oauth2.disruptLoginRequest",
    changes: {
        path: "password",
        type: "DELETE"
    }
}, {
    name: "Attempt to send decision request without transaction id",
    gradeName: "gpii.tests.cloud.oauth2.disruptDecisionRequest",
    changes: {
        path: "transaction_id",
        type: "DELETE"
    }
}, {
    name: "Attempt to send decision request without \"accept\" form field",
    gradeName: "gpii.tests.cloud.oauth2.disruptDecisionRequest",
    changes: {
        path: "accept",
        type: "DELETE"
    },
    expectedStatusCode: 302 // TODO: fault in implementation returns redirect even if accept=true omitted
}, {
    name: "Attempt to get access token without sending grant_type",
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "grant_type",
        type: "DELETE"
    },
    expectedStatusCode: 501
}, {
    name: "Attempt to get access token without sending authentication code",
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "code",
        type: "DELETE"
    },
    expectedStatusCode: 400
}, {
    name: "Attempt to get access token without sending redirect_uri",
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "redirect_uri",
        type: "DELETE"
    },
    expectedStatusCode: 403 // TODO: actually returns "invalid access token"
}, {
    name: "Attempt to get access token without sending client_id",
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "client_id",
        type: "DELETE"
    }
}, {
    name: "Attempt to get access token without sending client_secret",
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "client_secret",
        type: "DELETE"
    }
}, {
    name: "Test ability to update selectedPreferences in auth decision",
    gradeName: "gpii.tests.cloud.oauth2.disruptWithUpdatedDecision",
    expected: {
        "org.chrome.cloud4chrome": {}
    }
}, {
    name: "Test ability to revoke an authorization decision",
    gradeName: "gpii.tests.cloud.oauth2.disruptWithRevocation"
}
];

var standardChromeTest = require("./AcceptanceTests_chrome_testDefs.json");

// Test 1 is the first with nonempty preference set
gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(standardChromeTest[1], gpii.tests.cloud.oauth2.chrome.common,
    gpii.tests.cloud.oauth2.chrome.disruptions, __dirname);
