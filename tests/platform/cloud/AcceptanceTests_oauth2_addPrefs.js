/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("universal");
var gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

require("./OAuth2AcceptanceDataStore.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.addPrefs");

gpii.tests.cloud.oauth2.addPrefs.sequence = [
    { // 0
        funcName: "gpii.test.cloudBased.oauth2.sendAccessTokenRequestInClientCredentials",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyAccessTokenInClientCredentialsResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    }
];

gpii.tests.cloud.oauth2.addPrefs.testDefs = [
    {
        name: "Acceptance test for suppporting the client credentials grant type",
        scope: "add_preferences",
        client_id: "client_first_discovery",
        client_secret: "client_secret_firstDiscovery"
    },
    {
        name: "Acceptance test for suppporting client credentials grant type (with wrong client)",
        scope: "add_preferences",
        client_id: "com.bdigital.easit4all",
        client_secret: "client_secret_easit4all"
    },
    {
        name: "Acceptance test for suppporting client credentials grant type (with wrong client)",
        scope: "update_preferences",
        client_id: "client_first_discovery",
        client_secret: "client_secret_firstDiscovery"
    }
];

fluid.defaults("gpii.tests.disruption.addPrefsSequence", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.cloud.oauth2.addPrefs.sequence"
});

fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken", {
    gradeNames: ["gpii.tests.disruption.addPrefsSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.addPrefs.disruptions = [{
    name: "A success access token request using the client credentials grant type",
    gradeName: "gpii.tests.disruption.addPrefsSequence"
}, {
    name: "Attempt to get access token without sending client_id",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    changes: {
        path: "client_id",
        type: "DELETE"
    },
    expectedStatusCode: 401
}, {
    name: "Attempt to get access token without sending client_secret",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    changes: {
        path: "client_secret",
        type: "DELETE"
    },
    expectedStatusCode: 401
}, {
    name: "Attempt to get access token without sending scope",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    changes: {
        path: "scope",
        type: "DELETE"
    },
    expectedStatusCode: 403
}, {
    name: "Attempt to get access token without sending grant_type",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    changes: {
        path: "grant_type",
        type: "DELETE"
    },
    expectedStatusCode: 501
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongClient = [{
    name: "Attempt to get access token with sending a wrong client",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    expectedStatusCode: 403
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongScope = [{
    name: "Attempt to get access token with sending a wrong scope",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruptAccessToken",
    expectedStatusCode: 403
}];

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.addPrefs.testDefs[0],
    {},
    gpii.tests.cloud.oauth2.addPrefs.disruptions,
    __dirname
);

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.addPrefs.testDefs[1],
    {},
    gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongClient,
    __dirname
);

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.addPrefs.testDefs[2],
    {},
    gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongScope,
    __dirname
);
