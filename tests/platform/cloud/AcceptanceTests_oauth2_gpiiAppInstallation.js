/*!
Copyright 2017 OCAD university

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

fluid.registerNamespace("gpii.tests.cloud.oauth2.gpiiAppInstallation");

gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest = function (accessTokenRequest, options) {
    var formBody = {
        grant_type: "password",
        client_id: options.client_id,
        client_secret: options.client_secret,
        username: options.username,
        password: options.password
    };

    gpii.test.cloudBased.oauth2.sendRequest(accessTokenRequest, options, formBody, "accessTokenForm");
};

gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse = function (body, accessTokenRequest) {
    var response = gpii.test.verifyJSONResponse(body, accessTokenRequest);
    gpii.test.cloudBased.oauth2.verifyFieldInResponse(response, accessTokenRequest, "oauth2.verifyGpiiAppInstallationAccessTokenInResponse", "access_token");
    gpii.test.cloudBased.oauth2.verifyFieldInResponse(response, accessTokenRequest, "oauth2.verifyGpiiAppInstallationAccessTokenInResponse", "expiresIn");
};

gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyRefetchedAccessToken = function (body, refetchAccessTokenRequest, initialAccessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse(body, refetchAccessTokenRequest);
    jqUnit.assertNotEquals("A new access token is issued at the refetch", initialAccessTokenRequest.access_token, refetchAccessTokenRequest.access_token);
};

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest2: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                port: 8081,
                method: "POST"
            }
        }
    }
});

gpii.tests.cloud.oauth2.gpiiAppInstallation.mainSequence = [
    { // 0
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 2
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest",
        args: ["{accessTokenRequest2}", "{testCaseHolder}.options"]
    },
    { // 3
        event: "{accessTokenRequest2}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyRefetchedAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest2}", "{accessTokenRequest}"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.gpiiAppInstallation.requests",
    sequenceName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.mainSequence"
});

// Verify status code
fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode", {
    gradeNames: ["gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptions = [
    {
        name: "A success access token request using the resource owner gpii token grant type",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"
    },
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "username",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "password",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongClient = [{
    name: "Attempt to get access token with sending a wrong client (oauth2 client type is not \"gpiiAppInstallationClient\")",
    gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithNonexistentClient = [{
    name: "Attempt to get access token with sending an nonexistent client",
    gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithNonexistentGpiiToken = [{
    name: "Attempt to get access token with sending a wrong GPII token",
    gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptedTests = [
    {
        testDef: {
            name: "Acceptance test for verifying GPII apps - a successful entire work flow",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptions
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner gpii token grant type (oauth2 client type is not \"gpiiAppInstallationClient\")",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner gpii token grant type (with nonexistent client)",
            client_id: "nonexistent-client",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithNonexistentClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner gpii token grant type (with nonexistent GPII token)",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithNonexistentGpiiToken
    }
];

fluid.each(gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
