/*!
GPII In-Memory OAuth 2 Data Store

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
    fluid.registerNamespace("gpii.oauth2");

    fluid.defaults("gpii.oauth2.inMemoryDataStore", {
        gradeNames: ["gpii.oauth2.dataStore", "fluid.modelComponent"],
        // We are using a model but we don't expect to share the model or to
        // have subscribers to change events.
        // By using a model we gain the documentation of the mutable state
        // and the identification of changes to the mutable state through
        // use of the change applier.
        model: {
            users: [],
            gpiiTokens: [],
            clients: [],
            authDecisionsIdSeq: 1,
            authDecisions: [],
            authCodes: [],
            clientCredentialsTokensIdSeq: 1,
            clientCredentialsTokens: []
        },
        invokers: {
            findUserById: {
                funcName: "gpii.oauth2.dataStore.findUserById",
                args: ["{that}.model.users", "{arguments}.0"]
                    // id
            },
            findUserByUsername: {
                funcName: "gpii.oauth2.dataStore.findUserByUsername",
                args: ["{that}.model.users", "{arguments}.0"]
                    // username
            },
            findUserByGpiiToken: {
                funcName: "gpii.oauth2.dataStore.findUserByGpiiToken",
                args: ["{that}.model.users", "{that}.model.gpiiTokens", "{arguments}.0"]
                    // gpiiToken
            },
            findGpiiToken: {
                funcName: "gpii.oauth2.dataStore.findGpiiToken",
                args: ["{that}.model.gpiiTokens", "{arguments}.0"]
                    // gpiiToken
            },
            findClientById: {
                funcName: "gpii.oauth2.dataStore.findClientById",
                args: ["{that}.model.clients", "{arguments}.0"]
                    // id
            },
            findClientByOauth2ClientId: {
                funcName: "gpii.oauth2.dataStore.findClientByOauth2ClientId",
                args: ["{that}.model.clients", "{arguments}.0"]
                    // oauth2ClientId
            },
            findAllClients: {
                funcName: "gpii.oauth2.dataStore.findAllClients",
                args: ["{that}.model.clients"]
            },
            addAuthDecision: {
                funcName: "gpii.oauth2.dataStore.addAuthDecision",
                args: ["{that}.model", "{that}.applier", "{arguments}.0"]
                    // authDecision
            },
            updateAuthDecision: {
                funcName: "gpii.oauth2.dataStore.updateAuthDecision",
                args: [
                    "{that}.model.authDecisions",
                    "{that}.model.gpiiTokens",
                    "{that}.applier",
                    "{arguments}.0",
                    "{arguments}.1"
                ]
                // userId, authDecision
            },
            revokeAuthDecision: {
                funcName: "gpii.oauth2.dataStore.revokeAuthDecision",
                args: [
                    "{that}.model.authDecisions",
                    "{that}.model.gpiiTokens",
                    "{that}.applier",
                    "{arguments}.0",
                    "{arguments}.1"
                ]
                // userId, authDecisionId
            },
            findAuthDecisionById: {
                funcName: "gpii.oauth2.dataStore.findAuthDecisionById",
                args: ["{that}.model.authDecisions", "{arguments}.0"]
                    // id
            },
            findAuthDecisionsByGpiiToken: {
                funcName: "gpii.oauth2.dataStore.findAuthDecisionsByGpiiToken",
                args: ["{that}.model.authDecisions", "{arguments}.0"]
                    // gpiiToken
            },
            findAuthDecision: {
                funcName: "gpii.oauth2.dataStore.findAuthDecision",
                args: ["{that}.model.authDecisions", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // gpiiToken, clientId, redirectUri
            },
            saveAuthCode: {
                funcName: "gpii.oauth2.dataStore.saveAuthCode",
                args: ["{that}.model.authCodes", "{that}.applier", "{arguments}.0", "{arguments}.1"]
                    // authDecisionId, code
            },
            findAuthByCode: {
                funcName: "gpii.oauth2.dataStore.findAuthByCode",
                args: ["{that}.model.authCodes", "{that}.model.authDecisions", "{arguments}.0"]
                    // code
            },
            findAuthorizedClientsByGpiiToken: {
                funcName: "gpii.oauth2.dataStore.findAuthorizedClientsByGpiiToken",
                args: ["{that}.model.authDecisions", "{that}.model.clients", "{arguments}.0"]
                    // gpiiToken
            },
            findAuthByAccessToken: {
                funcName: "gpii.oauth2.dataStore.findAuthByAccessToken",
                args: ["{that}.model.authDecisions", "{that}.model.users", "{that}.model.clients", "{arguments}.0"]
                    // accessToken
            },
            findAccessTokenByOAuth2ClientIdAndGpiiToken: {
                funcName: "gpii.oauth2.dataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken",
                args: ["{that}.model.authDecisions", "{that}.model.users", "{that}.model.clients", "{arguments}.0", "{arguments}.1"]
                    // oauth2ClientId, gpiiToken
            },
            findClientCredentialsTokenById: {
                funcName: "gpii.oauth2.dataStore.findClientCredentialsTokenById",
                args: ["{that}.model.clientCredentialsTokens", "{arguments}.0"]
                    // clientCredentialsTokenId
            },
            findClientCredentialsTokenByClientId: {
                funcName: "gpii.oauth2.dataStore.findClientCredentialsTokenByClientId",
                args: ["{that}.model.clientCredentialsTokens", "{arguments}.0"]
                    // clientId
            },
            findClientCredentialsTokenByAccessToken: {
                funcName: "gpii.oauth2.dataStore.findClientCredentialsTokenByAccessToken",
                args: ["{that}.model.clientCredentialsTokens", "{arguments}.0"]
                    // accessToken
            },
            addClientCredentialsToken: {
                funcName: "gpii.oauth2.dataStore.addClientCredentialsToken",
                args: ["{that}.model", "{that}.applier", "{arguments}.0"]
                    // clientCredentialsTokenData
            },
            revokeClientCredentialsToken: {
                funcName: "gpii.oauth2.dataStore.revokeClientCredentialsToken",
                args: ["{that}.model.clientCredentialsTokens", "{that}.applier", "{arguments}.0"]
                    // clientCredentialsTokenId
            },
            findAuthByClientCredentialsAccessToken: {
                funcName: "gpii.oauth2.dataStore.findAuthByClientCredentialsAccessToken",
                args: ["{that}.model.clientCredentialsTokens", "{that}.model.clients", "{arguments}.0"]
                    // accessToken
            }
        }
    });

    // Users
    // -----

    gpii.oauth2.dataStore.findUserById = function (users, id) {
        return fluid.find_if(users, function (user) { return user.id === id; });
    };

    gpii.oauth2.dataStore.findUserByUsername = function (users, username) {
        return fluid.find_if(users, function (user) { return user.username === username; });
    };

    gpii.oauth2.dataStore.findUserByGpiiToken = function (users, gpiiTokens, gpiiToken) {
        var tokenFound = gpii.oauth2.dataStore.findGpiiToken(gpiiTokens, gpiiToken);
        if (tokenFound) {
            return fluid.find_if(users, function (user) { return user.id === tokenFound.userId; });
        } else {
            return undefined;
        }
    };

    // Gpii Tokens
    // -----------

    gpii.oauth2.dataStore.findGpiiToken = function (gpiiTokens, gpiiToken) {
        return fluid.find_if(gpiiTokens, function (token) { return token.gpiiToken === gpiiToken; });
    };

    // Clients
    // -------

    gpii.oauth2.dataStore.findClientById = function (clients, id) {
        return fluid.find_if(clients, function (client) { return client.id === id; });
    };

    gpii.oauth2.dataStore.findClientByOauth2ClientId = function (clients, oauth2ClientId) {
        return fluid.find_if(clients, function (client) { return client.oauth2ClientId === oauth2ClientId; });
    };

    gpii.oauth2.dataStore.findAllClients = function (clients) {
        return fluid.copy(clients);
    };

    // Authorization Decisions
    // -----------------------

    // TODO in this implementation, there is a one-to-one correspondence between
    // recorded user 'authorization decisions' and access tokens. We may want to
    // rethink this and give them different lifetimes.

    gpii.oauth2.dataStore.addAuthDecision = function (model, applier, authDecisionData) {
        var authDecisionId = model.authDecisionsIdSeq;
        applier.change("authDecisionsIdSeq", model.authDecisionsIdSeq + 1);
        var authDecision = {
            id: authDecisionId, // primary key
            gpiiToken: authDecisionData.gpiiToken, // foreign key
            clientId: authDecisionData.clientId, // foreign key
            redirectUri: authDecisionData.redirectUri,
            accessToken: authDecisionData.accessToken,
            selectedPreferences: authDecisionData.selectedPreferences,
            revoked: false
        };
        model.authDecisions.push(authDecision);
        applier.change("authDecisions", model.authDecisions);
        return authDecision;
    };

    gpii.oauth2.dataStore.updateAuthDecision = function (authDecisions, gpiiTokens, applier, userId, authDecisionData) {
        // Only update the authDecision if it is owned by userId so that
        // users cannot update authorizations owned by others
        var authDecision = gpii.oauth2.dataStore.findAuthDecisionById(authDecisions, authDecisionData.id);
        if (authDecision) {
            var gpiiToken = gpii.oauth2.dataStore.findGpiiToken(gpiiTokens, authDecision.gpiiToken);
            if (gpiiToken && gpiiToken.userId === userId) {
                authDecision.selectedPreferences = fluid.copy(authDecisionData.selectedPreferences);
                // We are changing one of the authDecision items in
                // the collection but notifying on the collection
                // (it's not worth it to extend the query api to allow
                // a more fine grained update)
                applier.change("authDecisions", authDecisions);
            }
        }
    };

    gpii.oauth2.dataStore.revokeAuthDecision = function (authDecisions, gpiiTokens, applier, userId, authDecisionId) {
        // Only revoke the authorization with authDecisionId if it is owned
        // by userId so that users cannot revoke authorizations owned by others
        var authDecision = gpii.oauth2.dataStore.findAuthDecisionById(authDecisions, authDecisionId);
        if (authDecision) {
            var gpiiToken = gpii.oauth2.dataStore.findGpiiToken(gpiiTokens, authDecision.gpiiToken);
            if (gpiiToken && gpiiToken.userId === userId) {
                authDecision.revoked = true;
                // We are changing one of the authDecision items in
                // the collection but notifying on the collection
                // (it's not worth it to extend the query api to allow
                // a more fine grained update)
                applier.change("authDecisions", authDecisions);
            }
        }
    };

    gpii.oauth2.dataStore.findAuthDecisionById = function (authDecisions, id) {
        return fluid.find_if(authDecisions, function (ad) {
            return ad.id === id;
        });
    };

    gpii.oauth2.dataStore.findAuthDecisionsByGpiiToken = function (authDecisions, gpiiToken) {
        var selectedAuthDecisions = fluid.copy(authDecisions);
        fluid.remove_if(selectedAuthDecisions, function (ad) {
            return ad.gpiiToken !== gpiiToken || ad.revoked !== false;
        });
        return selectedAuthDecisions;
    };

    gpii.oauth2.dataStore.findAuthDecision = function (authDecisions, gpiiToken, clientId, redirectUri) {
        return fluid.find_if(authDecisions, function (ad) {
            return ad.gpiiToken === gpiiToken &&
                ad.clientId === clientId &&
                ad.redirectUri === redirectUri &&
                ad.revoked === false;
        });
    };

    // Authorization Codes
    // -------------------

    // TODO make authCodes active only for a limited period of time
    // TODO make authCodes single use

    gpii.oauth2.dataStore.saveAuthCode = function (authCodes, applier, authDecisionId, code) {
        authCodes.push({
            authDecisionId: authDecisionId, // foreign key
            code: code
        });
        applier.change("authCodes", authCodes);
    };

    // Authorization Decision join Authorization Code
    // ----------------------------------------------

    gpii.oauth2.dataStore.findAuthByCode = function (authCodes, authDecisions, code) {
        var authCode = fluid.find_if(authCodes, function (ac) { return ac.code === code; });
        if (!authCode) {
            return authCode;
        }
        // TODO when move to CouchDB, do join there, rather than by hand
        var authDecision = gpii.oauth2.dataStore.findAuthDecisionById(authDecisions, authCode.authDecisionId);
        if (!authDecision || authDecision.revoked !== false) {
            return false;
        }
        return {
            clientId: authDecision.clientId,
            redirectUri: authDecision.redirectUri,
            accessToken: authDecision.accessToken
        };
    };

    // Authorization Decision join Client
    // ----------------------------------

    gpii.oauth2.dataStore.findAuthorizedClientsByGpiiToken = function (authDecisions, clients, gpiiToken) {
        var userAuthDecisions = gpii.oauth2.dataStore.findAuthDecisionsByGpiiToken(authDecisions, gpiiToken);
        // TODO when move to CouchDB, do join there, rather than by hand
        var authorizedClients = [];
        fluid.each(userAuthDecisions, function (ad) {
            var client = gpii.oauth2.dataStore.findClientById(clients, ad.clientId);
            if (client) {
                authorizedClients.push({
                    authDecisionId: ad.id,
                    oauth2ClientId: client.oauth2ClientId,
                    clientName: client.name,
                    selectedPreferences: ad.selectedPreferences
                });
            }
        });
        return authorizedClients;
    };

    // Authorization Decision join User and Client
    // -------------------------------------------

    gpii.oauth2.dataStore.findAuthByAccessToken = function (authDecisions, users, clients, accessToken) {
        var authDecision = fluid.find_if(authDecisions, function (ad) { return ad.accessToken === accessToken; });
        if (!authDecision || authDecision.revoked !== false) {
            return undefined;
        }
        // TODO when move to CouchDB, do joins there, rather than by hand
        var client = gpii.oauth2.dataStore.findClientById(clients, authDecision.clientId);
        if (!client) {
            return undefined;
        }
        return {
            userGpiiToken: authDecision.gpiiToken,
            oauth2ClientId: client.oauth2ClientId,
            selectedPreferences: authDecision.selectedPreferences
        };
    };

    // findAccessTokenByOAuth2ClientIdAndGpiiToken()
    // ---------------------------------------------
    // TODO this method was added to integrate Mobile Accessibility for the January 2015 review
    // TODO and it needs to be reassessed after the review GPII-1066
    gpii.oauth2.dataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken = function (authDecisions, users, clients, oauth2ClientId, gpiiToken) {
        var client = fluid.find_if(clients, function (c) { return c.oauth2ClientId === oauth2ClientId; });
        if (!client || client.allowDirectGpiiTokenAccess !== true) {
            return undefined;
        }
        var authDecision = fluid.find_if(authDecisions, function (ad) {
            return ad.clientId === client.id && ad.gpiiToken === gpiiToken && ad.revoked === false;
        });
        if (authDecision) {
            return {
                accessToken: authDecision.accessToken
            };
        }
        return undefined;
    };

    gpii.oauth2.dataStore.findClientCredentialsTokenById = function (clientCredentialsTokens, id) {
        return fluid.find_if(clientCredentialsTokens, function (cct) {
            return cct.id === id;
        });
    };

    // Join clientCredentialsTokens and clients
    gpii.oauth2.dataStore.findClientCredentialsTokenByClientId = function (clientCredentialsTokens, clientId) {
        var clientCredentialsToken = fluid.find_if(clientCredentialsTokens, function (cct) {
            return cct.clientId === clientId && cct.revoked === false;
        });
        return clientCredentialsToken ? clientCredentialsToken : undefined;
    };

    gpii.oauth2.dataStore.findClientCredentialsTokenByAccessToken = function (clientCredentialsTokens, accessToken) {
        var clientCredentialsToken = fluid.find_if(clientCredentialsTokens, function (cct) {
            return cct.accessToken === accessToken && cct.revoked === false;
        });
        return clientCredentialsToken ? clientCredentialsToken : undefined;
    };

    gpii.oauth2.dataStore.addClientCredentialsToken = function (model, applier, clientCredentialsTokenData) {
        var clientCredentialsTokenId = model.clientCredentialsTokensIdSeq;
        applier.change("clientCredentialsTokensIdSeq", model.clientCredentialsTokensIdSeq + 1);
        var clientCredentialsToken = {
            id: clientCredentialsTokenId, // primary key
            clientId: clientCredentialsTokenData.clientId, // foreign key
            accessToken: clientCredentialsTokenData.accessToken,
            allowAddPrefs: clientCredentialsTokenData.allowAddPrefs,
            revoked: false
        };
        model.clientCredentialsTokens.push(clientCredentialsToken);
        applier.change("clientCredentialsTokens", model.clientCredentialsTokens);
        return clientCredentialsToken;
    };

    gpii.oauth2.dataStore.revokeClientCredentialsToken = function (clientCredentialsTokens, applier, clientCredentialsTokenId) {
        var clientCredentialsToken = gpii.oauth2.dataStore.findClientCredentialsTokenById(clientCredentialsTokens, clientCredentialsTokenId);
        if (clientCredentialsToken) {
            clientCredentialsToken.revoked = true;
            applier.change("clientCredentialsTokens", clientCredentialsTokens);
        }
    };

    // Join clientCredentialsTokens and clients
    gpii.oauth2.dataStore.findAuthByClientCredentialsAccessToken = function (clientCredentialsTokens, clients, accessToken) {
        var clientCredentialsToken = gpii.oauth2.dataStore.findClientCredentialsTokenByAccessToken(clientCredentialsTokens, accessToken);
        if (!clientCredentialsToken) {
            return undefined;
        } else {
            var client = gpii.oauth2.dataStore.findClientById(clients, clientCredentialsToken.clientId);
            return client ? {
                oauth2ClientId: client.oauth2ClientId,
                allowAddPrefs: clientCredentialsToken.allowAddPrefs
            } : undefined;
        }
    };
})();
