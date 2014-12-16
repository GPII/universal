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

gpii.oauth2.walkMiddleware = function (middleware, i, req, res, next) {
    // TODO best way to check if middleware is a single function?
    if (typeof middleware === "function") {
        return middleware(req, res, next);
    }
    if (i >= middleware.length) {
        return next();
    } else {
        return middleware[i](req, res, function () {
            return gpii.oauth2.walkMiddleware(middleware, i+1, req, res, next);
        });
    }
};
