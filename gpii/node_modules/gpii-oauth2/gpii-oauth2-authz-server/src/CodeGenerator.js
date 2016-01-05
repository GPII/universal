/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var crypto = require("crypto");

var gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.oauth2.codeGenerator", {
    gradeNames: ["fluid.eventedComponent"],
    invokers: {
        generateAuthCode: {
            funcName: "gpii.oauth2.codeGenerator.generateAuthCode"
        },
        generateAccessToken: {
            funcName: "gpii.oauth2.codeGenerator.generateAccessToken"
        }
    }
});

gpii.oauth2.codeGenerator.generateHandle = function () {
    // TODO ensure that handles cannot be guessed
    // TODO crypto.randomBytes can fail if there is not enough entropy
    // see http://nodejs.org/api/crypto.html
    return crypto.randomBytes(16).toString("hex");
};

gpii.oauth2.codeGenerator.generateAuthCode = function () {
    return gpii.oauth2.codeGenerator.generateHandle();
};

gpii.oauth2.codeGenerator.generateAccessToken = function () {
    return gpii.oauth2.codeGenerator.generateHandle();
};
