/*!
Copyright 2014-2017 OCAD university

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

if (!gpii.oauth2.errors) {
    require("./OAuth2Const.js");
}

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

/**
 * Compare a given timestamp with the current time to find out if it has expired.
 * If timestampCreated + expiresIn < currentTimestamp, expired; else, not expired.
 * @param timestampCreated {String} A date string
 * @param expiresIn {Number} The number of seconds that the timestampCreated will expire.
 * @return {Boolean} return true if expired; otherwise, return false.
 */
gpii.oauth2.isExpired = function (timestampCreated, expiresIn) {
    expiresIn = parseInt(expiresIn);

    if (!timestampCreated || !expiresIn) {
        return false;
    }

    var createdTime = new Date(timestampCreated).getTime();

    // expiresIn is in the number of seconds but getTime() returns in millisecond.
    var expiredTime = createdTime + expiresIn * 1000;

    var currentTime = new Date().getTime();
// console.log("currentTime", currentTime, "expiredTime", expiredTime);
    return currentTime > expiredTime;
};
