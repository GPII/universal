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
var ipaddr = require("ipaddr.js");

fluid.registerNamespace("gpii.oauth2");

gpii.oauth2.parseAccessTokenFromRequest = function (req) {
    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(/\s+/);
        if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
            return parts[1];
        }
    }
    return undefined;
};

gpii.oauth2.getAuthorization = function (accessToken, authGrantFinder) {
    var promiseTogo = fluid.promise();

    if (!accessToken) {
        promiseTogo.reject(gpii.dbOperation.errors.unauthorized);
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

gpii.oauth2.mapPromiseToResponse = function (promise, response) {
    promise.then(function () {
        response.sendStatus(200);
    }, function (err) {
        response.sendStatus(err.statusCode);
    });
};

/**
 * Calculate the timestamp of currentTime + expiresIn.
 * @param {Date} timestampStarts - A start timestamp in the format returned by Date().
 * @param {Number} expiresIn - The number of seconds that the expiration will occur.
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
 * @param {Date} timestampStarts - A start timestamp in the format returned by Date().
 * @param {String} timestampExpires - A string in the format returned by Date().toISOString().
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

/**
 * Verify if the given IP address is in the allowed IP blocks.
 * @param {String} ipAddress - An IP to verify.
 * @param {Array} allowedIPBlocks - An array of allowed IP blocks.
 * @return {Boolean} Return true if the IP is within the range. Otherwise, return false.
 */
gpii.oauth2.isIPINRange = function (ipAddress, allowedIPBlocks) {
    allowedIPBlocks = fluid.makeArray(allowedIPBlocks);
    var addr = ipaddr.process(ipAddress);

    for (var i in allowedIPBlocks) {
        var oneIPBlock = allowedIPBlocks[i];
        if (oneIPBlock.indexOf("/") > 0) {
            // The IP block specifies a range of IP addresses such as "192.168.1.0/24"(IPV4) or "::1/128"(IPV6)
            try {
                if (addr.match(ipaddr.parseCIDR(oneIPBlock))) {
                    return true;
                }
            } catch (e) {
                // Catch the error when kinds of ipAddress and oneIPBlock don't match: one is in IPV4 format while
                // the other is in IPV6 format. Ignore this error and continue with verifying other IP blocks.
            }
        } else {
            // The IP block specifies a single IP address such as "192.168.1.0"(IPV4) or "::1"(IPV6)
            var range = ipaddr.parse(oneIPBlock);
            if (addr.toString() === range.toString()) {
                return true;
            }
        }
    };
    return false;
};
