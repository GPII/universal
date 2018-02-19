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
    gpiiAppInstallationClient: "gpiiAppInstallationClient",
    gpiiToken: "gpiiToken",
    gpiiAppInstallationAuthorization: "gpiiAppInstallationAuthorization"
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
    unauthorized: {
        message: "Unauthorized",
        statusCode: 401,
        isError: true
    }
});
