"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2.chrome");

require("./OAuth2AcceptanceDataStore.js");

var testDefs = require("./AcceptanceTests_chrome.js");

gpii.tests.cloud.oauth2.chrome.common = {
    client_id: "org.chrome.cloud4chrome",
    client_secret: "client_secret_chrome",
    redirect_uri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
    state: "The Client's Unique State",
    username: "bob",
    password: "b"
};

fluid.defaults("gpii.tests.cloud.oauth2.falseTokenHolder", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    components: {
        accessTokenRequest: {
            type: "fluid.littleComponent",
            options: {
                members: {
                    accessToken: "FALSE TOKEN"
                }
            }
        }
    }
});

// A set of grades derived from "gpii.tests.disruption" encoding disruptions of the 
// OAuth conversation at four interception points

fluid.defaults("gpii.tests.cloud.oauth2.disruptLoginRequest", {
    gradeNames: ["gpii.tests.disruption"],
    truncateAt: 3,
    expect: 4,
    expectedStatusCode: 302,
    recordName: "loginRequestForm",
    finalRecord: {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{loginRequest}", "{testCaseHolder}.options.expectedStatusCode", ]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptDecisionRequest", {
    gradeNames: ["gpii.tests.disruption"],
    truncateAt: 7,
    expect: 11,
    expectedStatusCode: 400,
    recordName: "decisionRequestForm",
    finalRecord: {
        event: "{decisionRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{decisionRequest}", "{testCaseHolder}.options.expectedStatusCode", ]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptAccessToken", {
    gradeNames: ["gpii.tests.disruption"],
    truncateAt: 9,
    expect: 14,
    expectedStatusCode: 401,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode", ]
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.disruptSettingsRequest", {
    gradeNames: ["gpii.tests.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.falseTokenHolder",
    truncateAt: 11,
    expect: 1,
    startAt: 10,
    expectedStatusCode: 401,
    finalRecord: {
        event: "{securedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{securedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode", ]
    }
});

gpii.tests.cloud.oauth2.chrome.disruptions = [{
    gradeName: "gpii.tests.cloud.oauth2.disruptSettingsRequest"
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptLoginRequest",
    changes: {
        path: "username",
        type: "DELETE"
    }
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptLoginRequest",
    changes: {
        path: "password",
        type: "DELETE"
    }
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptDecisionRequest",
    changes: {
        path: "transaction_id",
        type: "DELETE"
    }
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptDecisionRequest",
    changes: {
        path: "accept",
        type: "DELETE"
    },
    expectedStatusCode: 302 // TODO: fault in implementation returns redirect even if accept=true omitted
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "grant_type",
        type: "DELETE"
    },
    expectedStatusCode: 501
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "code",
        type: "DELETE"
    },
    expectedStatusCode: 400
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "redirect_uri",
        type: "DELETE"
    },
    expectedStatusCode: 403 // TODO: actually returns "invalid access token"
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "client_id",
        type: "DELETE"
    }
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptAccessToken",
    changes: {
        path: "client_secret",
        type: "DELETE"
    }
}];

gpii.test.cloudBased.oauth2.bootstrap(testDefs, gpii.tests.cloud.oauth2.chrome.common, __dirname);

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(testDefs[0], gpii.tests.cloud.oauth2.chrome.common,
    gpii.tests.cloud.oauth2.chrome.disruptions, __dirname);
