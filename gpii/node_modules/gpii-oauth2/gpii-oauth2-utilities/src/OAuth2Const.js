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

var fluid = fluid || require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

// All doc types used for saving different documents into CouchDB/PouchDB
// See [the documentation of Authorization Server](../../../../../documentation/AuthServer.md)
// regarding accepted fields for each document type.
gpii.oauth2.docTypes = fluid.freezeRecursive({
    user: "user",
    gpiiAppInstallationClient: "gpiiAppInstallationClient",
    onboardedSolutionClient: "onboardedSolutionClient",
    privilegedPrefsCreatorClient: "privilegedPrefsCreatorClient",
    webPrefsConsumerClient: "webPrefsConsumerClient",
    gpiiToken: "gpiiToken",
    gpiiAppInstallationAuthorization: "gpiiAppInstallationAuthorization",
    onboardedSolutionAuthorization: "onboardedSolutionAuthorization",
    privilegedPrefsCreatorAuthorization: "privilegedPrefsCreatorAuthorization",
    webPrefsConsumerAuthorization: "webPrefsConsumerAuthorization",
    authCode: "authCode"
});

// The default value of the number of seconds that access tokens become invalid.
gpii.oauth2.defaultTokenLifeTimeInSeconds = 3600;

// All error details that the gpii-oauth2 module reports.
gpii.oauth2.errors = fluid.freezeRecursive({
    missingInput: {
        message: "The input field \"%fieldName\" is undefined",
        statusCode: 400,
        isError: true
    },
    missingDoc: {
        message: "The record of %docName is not found",
        statusCode: 400,
        isError: true
    },
    unauthorizedUser: {
        message: "The user %userId is not authorized",
        statusCode: 401,
        isError: true
    },
    invalidUser: {
        message: "Invalid user name and password combination",
        statusCode: 401,
        isError: true
    },
    unauthorizedAuthCode: {
        message: "The authorization code %code is not authorized",
        statusCode: 401,
        isError: true
    },
    unauthorizedClient: {
        message: "The client is not authorized",
        statusCode: 401,
        isError: true
    },
    unauthorizedAccessToken: {
        message: "The access token is not authorized",
        statusCode: 401,
        isError: true
    },
    unauthorized: {
        message: "Unauthorized",
        statusCode: 401,
        isError: true
    }
});

