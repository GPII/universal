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
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                // userId, clientId, redirectUri, selectedPreferences
        },
        userHasAuthorized: {
            funcName: "gpii.oauth2.authorizationService.userHasAuthorized",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                // userId, clientId, redirectUri
        },
        exchangeCodeForAccessToken: {
            funcName: "gpii.oauth2.authorizationService.exchangeCodeForAccessToken",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                // code, clientId, redirectUri
        },
        getSelectedPreferences: {
            funcName: "gpii.oauth2.authorizationService.getSelectedPreferences",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
                // userId, authDecisionId
        },
        setSelectedPreferences: {
            funcName: "gpii.oauth2.authorizationService.setSelectedPreferences",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                // userId, authDecisionId, selectedPreferences
        },
        getAuthorizedClientsForUser: {
            func: "{dataStore}.findAuthorizedClientsByUserId"
                // userId
        },
        revokeAuthorization: {
            func: "{dataStore}.revokeAuthDecision"
                // userId, authDecisionId
        },
        getAccessTokenForOAuth2ClientIdAndGpiiToken: {
            func: "{dataStore}.findAccessTokenByOAuth2ClientIdAndGpiiToken"
                // oauth2ClientId, gpiiToken
        },
        getAuthForAccessToken: {
            func: "{dataStore}.findAuthByAccessToken"
                // accessToken
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

gpii.oauth2.authorizationService.grantAuthorizationCode = function (dataStore, userId, clientId, redirectUri, selectedPreferences) {
    // Record the authorization decision if we haven't already
    var authDecision = dataStore.findAuthDecision(userId, clientId, redirectUri);
    if (!authDecision) {
        var accessToken = gpii.oauth2.authorizationService.generateAccessToken();
        authDecision = dataStore.addAuthDecision({
            userId: userId,
            clientId: clientId,
            redirectUri: redirectUri,
            accessToken: accessToken,
            selectedPreferences: selectedPreferences
        });
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

gpii.oauth2.authorizationService.getSelectedPreferences = function (dataStore, userId, authDecisionId) {
    var authDecision = dataStore.findAuthDecisionById(authDecisionId);
    if (authDecision && authDecision.userId === userId) {
        return authDecision.selectedPreferences;
    } else {
        // TODO or throw an exception?
        return undefined;
    }
};

gpii.oauth2.authorizationService.setSelectedPreferences = function (dataStore, userId, authDecisionId, selectedPreferences) {
    var authDecision = dataStore.findAuthDecisionById(authDecisionId);
    if (authDecision && authDecision.userId === userId) {
        authDecision.selectedPreferences = selectedPreferences;
        dataStore.updateAuthDecision(userId, authDecision);
    }
    // TODO else communicate not found?
};
