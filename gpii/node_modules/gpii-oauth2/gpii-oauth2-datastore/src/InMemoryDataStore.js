"use strict";

var fluid = fluid || require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

// TODO where should this grade live?
fluid.defaults("gpii.oauth2.dataStore", {
    gradeNames: ["fluid.eventedComponent", "autoInit"]
});

fluid.defaults("gpii.oauth2.inMemoryDataStore", {
    gradeNames: ["gpii.oauth2.dataStore", "fluid.standardRelayComponent", "autoInit"],
    // We are using a model but we don't expect to share the model or to
    // have subscribers to change events.
    // By using a model we gain the documentation of the mutable state
    // and the identification of changes to the mutable state through
    // use of the change applier.
    model: {
        users: [],
        clients: [],
        authDecisionsIdSeq: 1,
        authDecisions: [],
        authCodes: []
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
        saveAuthDecision: {
            funcName: "gpii.oauth2.dataStore.saveAuthDecision",
            args: ["{that}.model", "{that}.applier",
                "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                // userId, clientId, redirectUri, accessToken
        },
        findAuthDecisionById: {
            funcName: "gpii.oauth2.dataStore.findAuthDecisionById",
            args: ["{that}.model.authDecisions", "{arguments}.0"]
                // id
        },
        findAuthDecision: {
            funcName: "gpii.oauth2.dataStore.findAuthDecision",
            args: ["{that}.model.authDecisions", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                // userId, clientId, redirectUri
        },
        revokeAuthDecision: {
            funcName: "gpii.oauth2.dataStore.revokeAuthDecision",
            args: ["{that}.model.authDecisions", "{that}.applier", "{arguments}.0", "{arguments}.1"]
                // userId, authDecisionId
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
        findAuthorizedClientsByUserId: {
            funcName: "gpii.oauth2.dataStore.findAuthorizedClientsByUserId",
            args: ["{that}.model.authDecisions", "{that}.model.clients", "{arguments}.0"]
                // userId
        },
        findAuthByAccessToken: {
            funcName: "gpii.oauth2.dataStore.findAuthByAccessToken",
            args: ["{that}.model.authDecisions", "{that}.model.users", "{that}.model.clients", "{arguments}.0"]
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
    return fluid.find_if(users, function (user) { return user.username === username; } );
};

// Clients
// -------

gpii.oauth2.dataStore.findClientById = function (clients, id) {
    return fluid.find_if(clients, function (client) { return client.id === id; });
};

gpii.oauth2.dataStore.findClientByOauth2ClientId = function (clients, oauth2ClientId) {
    return fluid.find_if(clients, function (client) { return client.oauth2ClientId === oauth2ClientId; });
};

// Authorization Decisions
// -----------------------

// TODO in this implementation, there is a one-to-one correspondence between
// recorded user 'authorization decisions' and access tokens. We may want to
// rethink this and give them different lifetimes.

gpii.oauth2.dataStore.saveAuthDecision = function (model, applier, userId, clientId, redirectUri, accessToken) {
    var authDecisionId = model.authDecisionsIdSeq;
    applier.change("authDecisionsIdSeq", model.authDecisionsIdSeq + 1);
    var authDecision = {
        id: authDecisionId, // primary key
        userId: userId, // foreign key
        clientId: clientId, // foreign key
        redirectUri: redirectUri,
        accessToken: accessToken,
        revoked: false
    };
    model.authDecisions.push(authDecision);
    applier.change("authDecisions", model.authDecisions);
    console.log("SAVE AUTH DECISION: id=" + authDecisionId);
    console.log(JSON.stringify(model.authDecisions, null, 4));
    return authDecision;
};

gpii.oauth2.dataStore.findAuthDecisionById = function (authDecisions, id) {
    return fluid.find_if(authDecisions, function (ad) {
        return ad.id === id;
    });
};

gpii.oauth2.dataStore.findAuthDecision = function (authDecisions, userId, clientId, redirectUri) {
    return fluid.find_if(authDecisions, function (ad) {
        return ad.userId === userId &&
            ad.clientId === clientId &&
            ad.redirectUri === redirectUri &&
            ad.revoked === false;
    });
};

gpii.oauth2.dataStore.revokeAuthDecision = function (authDecisions, applier, userId, authDecisionId) {
    // Only revoke the authorization with authDecisionId if it is owned
    // by userId so that users cannot revoke authorizations owned by others
    var authDecision = gpii.oauth2.dataStore.findAuthDecisionById(authDecisions, authDecisionId);
    if (authDecision && authDecision.userId === userId) {
        authDecision.revoked = true;
    }
    // We are changing one of the authDecision items in the collection but
    // notifying on the collection (it's not worth it to extend the query api
    // to allow a more fine grained update)
    applier.change("authDecisions", authDecisions);
    console.log("REVOKE AUTH DECISION: id=" + authDecisionId);
    console.log(JSON.stringify(authDecisions, null, 4));
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
    console.log("SAVE AUTH CODE: code=" + code);
    console.log(JSON.stringify(authCodes, null, 4));
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

gpii.oauth2.dataStore.findAuthorizedClientsByUserId = function (authDecisions, clients, userId) {
    var userAuthDecisions = fluid.copy(authDecisions);
    fluid.remove_if(userAuthDecisions, function (ad) {
        return ad.userId !== userId || ad.revoked !== false;
    });
    // TODO when move to CouchDB, do join there, rather than by hand
    var authorizedClients = [];
    userAuthDecisions.forEach(function (ad) {
        var client = gpii.oauth2.dataStore.findClientById(clients, ad.clientId);
        if (client) {
            authorizedClients.push({
                authDecisionId: ad.id,
                clientName: client.name
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
    var user = gpii.oauth2.dataStore.findUserById(users, authDecision.userId);
    if (!user) {
        return undefined;
    }
    var client = gpii.oauth2.dataStore.findClientById(clients, authDecision.clientId);
    if (!client) {
        return undefined;
    }
    return {
        userGpiiToken: user.gpiiToken,
        oauth2ClientId: client.oauth2ClientId
    };
};
