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

var fluid = fluid || require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

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

gpii.oauth2.parseBearerAuthorizationHeader = function (req) {
    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(/\s+/);
        if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
            return parts[1];
        }
    }
    return undefined;
};

gpii.oauth2.walkMiddleware = function (middleware, i, req, res, next) {
    // TODO best way to check if middleware is a single function?
    if (typeof middleware === "function") {
        return middleware(req, res, next);
    }
    if (i >= middleware.length) {
        return next();
    } else {
        return middleware[i](req, res, function () {
            return gpii.oauth2.walkMiddleware(middleware, i + 1, req, res, next);
        });
    }
};

gpii.oauth2.composeError = function (error, termMap) {
    var err = fluid.copy(error);
    err.msg = fluid.stringTemplate(err.msg, termMap);
    return err;
};

gpii.oauth2.mapPromiseToResponse = function (promise, response) {
    promise.then(function () {
        response.sendStatus(200);
    }, function (err) {
        response.sendStatus(err.statusCode);
    });
};

