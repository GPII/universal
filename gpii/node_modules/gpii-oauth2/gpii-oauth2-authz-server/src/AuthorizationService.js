/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.oauth2.authorizationService", {
        gradeNames: ["fluid.component"],
        urls: {
            preferencesPost: ""
        },
        components: {
            dataStore: {
                type: "gpii.oauth2.dataStore"
            },
            codeGenerator: {
                type: "gpii.oauth2.codeGenerator"
            }
        },
        invokers: {
            grantAuthorizationCode: {
                funcName: "gpii.oauth2.authorizationService.grantAuthorizationCode",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                    // userId, clientId, redirectUri, selectedPreferences
            },
            addAuthorization: {
                funcName: "gpii.oauth2.authorizationService.addAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // userId, clientId, selectedPreferences
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
            getUnauthorizedClientsForGpiiToken: {
                funcName: "gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken",
                args: ["{that}", "{dataStore}", "{arguments}.0"]
                    // gpiiToken
            },
            getAuthorizedClientsForGpiiToken: {
                funcName: "gpii.oauth2.authorizationService.getAuthorizedClientsForGpiiToken",
                args: ["{dataStore}", "{arguments}.0"]
                    // gpiiToken
            },
            revokeAuthorization: {
                funcName: "gpii.oauth2.authorizationService.revokeAuthorization",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
                    // userId, authDecisionId
            },
            getAccessTokenForOAuth2ClientIdAndGpiiToken: {
                func: "{dataStore}.findAccessTokenByOAuth2ClientIdAndGpiiToken"
                    // oauth2ClientId, gpiiToken
            },
            getAuthForAccessToken: {
                func: "{dataStore}.findAuthByAccessToken"
                    // accessToken
            },
            getAuthByClientCredentialsAccessToken: {
                func: "{dataStore}.findAuthByClientCredentialsAccessToken"
                    // accessToken
            },
            grantClientCredentialsAccessToken: {
                funcName: "gpii.oauth2.authorizationService.grantClientCredentialsAccessToken",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1"]
                    // clientId, scope
            },
            revokeClientCredentialsToken: {
                func: "{dataStore}.revokeClientCredentialsToken"
                    // clientCredentialsTokenId
            }
        }
    });

    gpii.oauth2.authorizationService.grantAuthorizationCode = function (dataStore, codeGenerator, gpiiToken, clientId, redirectUri, selectedPreferences) {
        // Record the authorization decision if we haven't already
        var authDecision = dataStore.findAuthDecision(gpiiToken, clientId, redirectUri);
        if (!authDecision) {
            var accessToken = codeGenerator.generateAccessToken();
            authDecision = dataStore.addAuthDecision({
                gpiiToken: gpiiToken,
                clientId: clientId,
                redirectUri: redirectUri,
                accessToken: accessToken,
                selectedPreferences: selectedPreferences
            });
        }
        // Generate the authorization code and record it
        var code = codeGenerator.generateAuthCode();
        dataStore.saveAuthCode(authDecision.id, code);
        return code;
    };

    gpii.oauth2.authorizationService.addAuthorization = function (dataStore, codeGenerator, userId, oauth2ClientId, selectedPreferences) {
        var user = dataStore.findUserById(userId);
        var client = dataStore.findClientByOauth2ClientId(oauth2ClientId);
        if (user && client) {
            var clientId = client.id;
            var redirectUri = client.redirectUri;
            // Check to see if we have an existing authorization
            var authDecision = dataStore.findAuthDecision(user.gpiiToken, clientId, redirectUri);
            if (!authDecision) {
                // If not, add one
                var accessToken = codeGenerator.generateAccessToken();
                dataStore.addAuthDecision({
                    gpiiToken: user.gpiiToken,
                    clientId: clientId,
                    redirectUri: redirectUri,
                    accessToken: accessToken,
                    selectedPreferences: selectedPreferences
                });
            }
        }
    };

    gpii.oauth2.authorizationService.userHasAuthorized = function (dataStore, userId, clientId, redirectUri) {
        var user = dataStore.findUserById(userId);
        return user && dataStore.findAuthDecision(user.gpiiToken, clientId, redirectUri) ? true : false;
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
        if (authDecision && authDecision.userId === userId && !authDecision.revoked) {
            return authDecision.selectedPreferences;
        } else {
            // TODO or throw an exception?
            return undefined;
        }
    };

    gpii.oauth2.authorizationService.setSelectedPreferences = function (dataStore, userId, authDecisionId, selectedPreferences) {
        var user = dataStore.findUserById(userId);
        var authDecision = dataStore.findAuthDecisionById(authDecisionId);
        if (user && authDecision && authDecision.gpiiToken === user.gpiiToken) {
            authDecision.selectedPreferences = selectedPreferences;
            dataStore.updateAuthDecision(userId, authDecision);
        }
        // TODO else communicate not found?
    };

    gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken = function (that, dataStore, gpiiToken) {
        if (!dataStore.findGpiiToken(gpiiToken)) {
            return undefined;
        }

        var authorizations = that.getAuthorizedClientsForGpiiToken(gpiiToken);
        var authorizedClientIds = {};
        fluid.each(authorizations, function (authorization) {
            authorizedClientIds[authorization.clientId] = true;
        });

        var unauthorizedClients = [];
        var allClients = dataStore.findAllClients();
        fluid.each(allClients, function (client) {
            if (!authorizedClientIds.hasOwnProperty(client.id)) {
                unauthorizedClients.push({
                    clientName: client.name,
                    oauth2ClientId: client.oauth2ClientId
                });
            }
        });

        return unauthorizedClients;
    };

    gpii.oauth2.authorizationService.revokeAuthorization = function (dataStore, userId, authDecisionId) {
        var user = dataStore.findUserById(userId);
        if (!user) {
            return undefined;
        }

        return dataStore.revokeAuthDecision(user.gpiiToken, authDecisionId);
    };

    gpii.oauth2.authorizationService.getAuthorizedClientsForGpiiToken = function (dataStore, gpiiToken) {
        return dataStore.findAuthDecisionsByGpiiToken(gpiiToken);
    };

    gpii.oauth2.authorizationService.grantClientCredentialsAccessToken = function (dataStore, codeGenerator, clientId, scope) {
        // Record the credential client access token if we haven't already
        var client = dataStore.findClientById(clientId);
        if (!scope || scope.indexOf("add_preferences") === -1 || !client.allowAddPrefs) {
            return false;
        }

        var clientCredentialsToken = dataStore.findClientCredentialsTokenByClientId(clientId);
        if (!clientCredentialsToken) {
            var accessToken = codeGenerator.generateAccessToken();
            clientCredentialsToken = dataStore.addClientCredentialsToken({
                clientId: clientId,
                accessToken: accessToken,
                allowAddPrefs: true
            });
        }

        return clientCredentialsToken.accessToken;
    };

})();
