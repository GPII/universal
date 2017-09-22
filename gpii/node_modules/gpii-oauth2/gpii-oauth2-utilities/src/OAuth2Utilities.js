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

gpii.oauth2.parseBearerAuthorizationHeader = function (req) {
    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(/\s+/);
        if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
            return parts[1];
        }
    }
    return undefined;
};

gpii.oauth2.getAuthorization = function (req, authGrantFinder) {
    var promiseTogo = fluid.promise();
    var accessToken = gpii.oauth2.parseBearerAuthorizationHeader(req);

    if (!accessToken) {
        promiseTogo.reject(gpii.oauth2.errors.unauthorized);
    } else {
        promiseTogo = authGrantFinder.getGrantForAccessToken(accessToken);
    }
    return promiseTogo;
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
    err.message = fluid.stringTemplate(err.message, termMap);
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
 * Returns the current time in a human readable string that also naturally sort in chronological order.
 * See http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.5.43
 * @return {String} The current time in ISO string format.
 */
gpii.oauth2.getCurrentTimestamp = function () {
    return new Date().toISOString();
};

/**
 * Calculate the timestamp of currentTime + expiresIn.
 * @param timestampStarts {Date} A start timestamp in the format returned by Date()
 * @param expiresIn {Number} The number of seconds that the expiration will occur.
 * @return {String} A date in simpilified ISO string format.
 */
gpii.oauth2.getTimestampExpires = function (timestampStarts, expiresIn) {
    if (!timestampStarts) {
        return undefined;
    }
    return new Date(timestampStarts.getTime() + expiresIn * 1000).toISOString();
};

/**
 * Compare the current time with the expiresIn time and return the number of seconds that the expiration will occur.
 * @param timestampStarts {Date} A start timestamp in the format returned by Date()
 * @param timestampExpires {String} A string in the format returned by Date().toISOString()
 * @return {Number} The number of seconds that the expiration will occur. Return 0 if the given timestampExpires < the current timestamp.
 */
gpii.oauth2.getExpiresIn = function (timestampStarts, timestampExpires) {
    if (!timestampStarts || !timestampExpires) {
        return undefined;
    }

    var startsTimeInMsec = timestampStarts.getTime();
    var expiresTimeInMsec = new Date(timestampExpires).getTime();
    return expiresTimeInMsec > startsTimeInMsec ? Math.round((expiresTimeInMsec - startsTimeInMsec) / 1000) : 0;
};
