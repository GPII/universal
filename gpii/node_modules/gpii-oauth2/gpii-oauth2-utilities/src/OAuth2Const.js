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
    client: "client",
    gpiiToken: "gpiiToken",
    authDecision: "authDecision",
    authCode: "authCode",
    clientCredentialsToken: "clientCredentialsToken",
    resourceOwnerToken: "resourceOwnerToken"
});

// All OAuth2 client types used for saving different documents into CouchDB/PouchDB
// See [the documentation of Authorization Server](../../../../../documentation/AuthServer.md)
// regarding accepted fields for each document type.
gpii.oauth2.oauth2ClientTypes = fluid.freezeRecursive({
    nativeApp: "nativeApp",
    webApp: "webApp",
    thirdPartyApp: "thirdPartyApp",
    clientCredentialsApp: "clientCredentialsApp"
});

// The default value of the number of seconds that access tokens become invalid.
gpii.oauth2.defaultTokenExpiresIn = 3600;

// All error details that the gpii-oauth2 module reports.
gpii.oauth2.errors = fluid.freezeRecursive({
    missingInput: {
        msg: "The input field \"%fieldName\" is undefined",
        statusCode: 400,
        isError: true
    },
    missingDoc: {
        msg: "The record of %docName is not found",
        statusCode: 400,
        isError: true
    },
    unauthorizedUser: {
        msg: "The user %userId is not authorized",
        statusCode: 401,
        isError: true
    },
    invalidUser: {
        msg: "Invalid user name and password combination",
        statusCode: 401,
        isError: true
    },
    invalidGpiiToken: {
        msg: "Invalid GPII token",
        statusCode: 401,
        isError: true
    },
    unauthorizedAuthCode: {
        msg: "The authorization code %code is not authorized",
        statusCode: 401,
        isError: true
    },
    unauthorizedClient: {
        msg: "The client is not authorized",
        statusCode: 401,
        isError: true
    },
    unauthorizedAccessToken: {
        msg: "The access token is not authorized",
        statusCode: 401,
        isError: true
    }
});

