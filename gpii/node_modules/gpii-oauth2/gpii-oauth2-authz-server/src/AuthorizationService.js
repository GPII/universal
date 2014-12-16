"use strict";

var fluid = require("infusion");
var crypto = require("crypto");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.authorizationService", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    components: {
        dataStore: {
            type: "gpii.oauth2.dataStore"
        }
    },
    invokers: {
        grantAuthorizationCode: {
            funcName: "gpii.oauth2.authorizationService.grantAuthorizationCode",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            //                    userId, clientId, redirectUri
        },
        userHasAuthorized: {
            funcName: "gpii.oauth2.authorizationService.userHasAuthorized",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            //                    userId, clientId, redirectUri
        },
        exchangeCodeForAccessToken: {
            funcName: "gpii.oauth2.authorizationService.exchangeCodeForAccessToken",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            //                    code, clientId, redirectUri
        },
        getAuthorizedClientsForUser: {
            func: "{dataStore}.findAuthorizedClientsByUserId"
        },
        revokeAuthorization: {
            func: "{dataStore}.revokeAuthDecision"
        }
    }
});

gpii.oauth2.authorizationService.generateHandle = function () {
    // TODO ensure that handles cannot be guessed
    // TODO crypto.randomBytes can fail if there is not enough entropy
    // see http://nodejs.org/api/crypto.html
    return crypto.randomBytes(16).toString("hex");
};

gpii.oauth2.authorizationService.generateAuthCode = function () {
    return gpii.oauth2.authorizationService.generateHandle();
};

gpii.oauth2.authorizationService.generateAccessToken = function () {
    return gpii.oauth2.authorizationService.generateHandle();
};

gpii.oauth2.authorizationService.grantAuthorizationCode = function (dataStore, userId, clientId, redirectUri) {
    // Record the authorization decision if we haven't already
    var authDecision = dataStore.findAuthDecision(userId, clientId, redirectUri);
    if (!authDecision) {
        var accessToken = gpii.oauth2.authorizationService.generateAccessToken();
        authDecision = dataStore.saveAuthDecision(userId, clientId, redirectUri, accessToken);
    }
    // Generate the authorization code and record it
    var code = gpii.oauth2.authorizationService.generateAuthCode();
    dataStore.saveAuthCode(authDecision.id, code);
    return code;
};

gpii.oauth2.authorizationService.userHasAuthorized = function (dataStore, userId, clientId, redirectUri) {
    return dataStore.findAuthDecision(userId, clientId, redirectUri) ? true : false;
};

gpii.oauth2.authorizationService.exchangeCodeForAccessToken = function (dataStore, code, clientId, redirectUri) {
    var auth = dataStore.findAuthByCode(code);
    // TODO flag an authCode after it is found to make single use
    if (auth && auth.clientId === clientId && auth.redirectUri === redirectUri) {
        return auth.accessToken;
    } else {
        return false;
    }
};
