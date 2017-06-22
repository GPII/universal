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

fluid.registerNamespace("gpii.tests.cloud.oauth2.resourceOwner");

var initialTokenResponse;

gpii.tests.cloud.oauth2.resourceOwner.verifyInitialAccessToken = function (body, accessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyResourceOwnerAccessTokenInResponse(body, accessTokenRequest);
    initialTokenResponse = body;
};

gpii.tests.cloud.oauth2.resourceOwner.verifyRefetchedAccessToken = function (body, accessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyResourceOwnerAccessTokenInResponse(body, accessTokenRequest);
    jqUnit.assertEquals("The previously set unexpired access token is returned", initialTokenResponse, body);
};

gpii.tests.cloud.oauth2.resourceOwner.mainSequence = [
    { // 0
        funcName: "gpii.test.cloudBased.oauth2.sendAccessTokenRequestInResourceOwner",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.resourceOwner.verifyInitialAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 2
        funcName: "gpii.test.cloudBased.oauth2.sendAccessTokenRequestInResourceOwner",
        args: ["{accessTokenRequest2}", "{testCaseHolder}.options"]
    },
    { // 3
        event: "{accessTokenRequest2}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.resourceOwner.verifyRefetchedAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest2}"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.resourceOwner.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.cloud.oauth2.resourceOwner.mainSequence"
});

// Verify status code
fluid.defaults("gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode", {
    gradeNames: ["gpii.tests.cloud.oauth2.resourceOwner.disruption.mainSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.resourceOwner.disruptions = [
    {
        name: "A success access token request using the resource owner password credentials grant type",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.mainSequence"
    },
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
        changes: {
            path: "username",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
        changes: {
            path: "password",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithWrongClient = [{
    name: "Attempt to get access token with sending a wrong client (oauth2 client type is not \"nativeApps\")",
    gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithNonexistentClient = [{
    name: "Attempt to get access token with sending an nonexistent client",
    gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithNonexistentGpiiToken = [{
    name: "Attempt to get access token with sending a wrong GPII token",
    gradeName: "gpii.tests.cloud.oauth2.resourceOwner.disruption.statusCode",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.resourceOwner.disruptedTests = [
    {
        testDef: {
            name: "Acceptance test for verifying GPII apps - a successful entire work flow",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.resourceOwner.disruptions
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner password credentials grant type (oauth2 client type is not \"nativeApps\")",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithWrongClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner password credentials grant type (with nonexistent client)",
            client_id: "nonexistent-client",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithNonexistentClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner password credentials grant type (with nonexistent GPII token)",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.resourceOwner.disruptionsWithNonexistentGpiiToken
    }
];

fluid.each(gpii.tests.cloud.oauth2.resourceOwner.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
