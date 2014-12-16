/*
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/* global jqUnit */

// TODO standardise on undefined rather than 'falsey'

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.tests.oauth2.dataStore");
    fluid.registerNamespace("gpii.tests.oauth2.dataStore.testdata");

    fluid.defaults("gpii.tests.oauth2.dataStore.dataStoreWithTestData", {
        gradeNames: ["gpii.oauth2.inMemoryDataStore", "autoInit"],
        model: {
            users: [
                { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" },
                { id: 2, username: "bob", password: "b", gpiiToken: "bob_gpii_token" }
            ],
            clients: [
                {
                    id: 1,
                    name: "Client A",
                    oauth2ClientId: "client_id_A",
                    oauth2ClientSecret: "client_secret_A",
                    redirectUri: "http://example.com/callback_A"
                },
                {
                    id: 2,
                    name: "Client B",
                    oauth2ClientId: "client_id_B",
                    oauth2ClientSecret: "client_secret_B",
                    redirectUri: "http://example.com/callback_B"
                },
                {
                    id: 3,
                    name: "Client C",
                    oauth2ClientId: "client_id_C",
                    oauth2ClientSecret: "client_secret_C",
                    redirectUri: "http://example.com/callback_C"
                }
            ]
        }
    });

    gpii.tests.oauth2.dataStore.testdata.userId1 = 1;

    gpii.tests.oauth2.dataStore.testdata.authDecision1 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 2,
        redirectUri: "http://example.com/callback_B",
        accessToken: "access_token_1"
    };

    gpii.tests.oauth2.dataStore.testdata.authDecision2 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 3,
        redirectUri: "http://example.com/callback_C",
        accessToken: "access_token_2"
    };

    gpii.tests.oauth2.dataStore.testdata.authDecision3 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 2,
        redirectUri: "http://example.com/callback_B",
        accessToken: "access_token_3"
    };

    gpii.tests.oauth2.dataStore.verifyAlice = function (user) {
        jqUnit.assertEquals("username is alice", "alice", user.username);
        jqUnit.assertEquals("password is a", "a", user.password);
    };

    gpii.tests.oauth2.dataStore.verifyBob = function (user) {
        jqUnit.assertEquals("username is bob", "bob", user.username);
        jqUnit.assertEquals("password is b", "b", user.password);
    };

    gpii.tests.oauth2.dataStore.verifyClientA = function (client) {
        jqUnit.assertEquals("name", "Client A", client.name);
        jqUnit.assertEquals("oauth2ClientId", "client_id_A", client.oauth2ClientId);
        jqUnit.assertEquals("oauth2ClientSecret", "client_secret_A", client.oauth2ClientSecret);
        jqUnit.assertEquals("redirectUri", "http://example.com/callback_A", client.redirectUri);
    };

    gpii.tests.oauth2.dataStore.verifyClientB = function (client) {
        jqUnit.assertEquals("name", "Client B", client.name);
        jqUnit.assertEquals("oauth2ClientId", "client_id_B", client.oauth2ClientId);
        jqUnit.assertEquals("oauth2ClientSecret", "client_secret_B", client.oauth2ClientSecret);
        jqUnit.assertEquals("redirectUri", "http://example.com/callback_B", client.redirectUri);
    };

    gpii.tests.oauth2.dataStore.saveAuthDecision = function (dataStore, authDecision) {
        return dataStore.saveAuthDecision(authDecision.userId, authDecision.clientId,
            authDecision.redirectUri, authDecision.accessToken);
    };

    gpii.tests.oauth2.dataStore.saveAuthDecision1 = function (dataStore) {
        return gpii.tests.oauth2.dataStore.saveAuthDecision(dataStore,
            gpii.tests.oauth2.dataStore.testdata.authDecision1);
    };

    gpii.tests.oauth2.dataStore.saveAuthDecision2 = function (dataStore) {
        return gpii.tests.oauth2.dataStore.saveAuthDecision(dataStore,
            gpii.tests.oauth2.dataStore.testdata.authDecision2);
    };

    gpii.tests.oauth2.dataStore.saveAuthDecision3 = function (dataStore) {
        return gpii.tests.oauth2.dataStore.saveAuthDecision(dataStore,
            gpii.tests.oauth2.dataStore.testdata.authDecision3);
    };

    gpii.tests.oauth2.dataStore.findAuthDecision1 = function (dataStore) {
        return dataStore.findAuthDecision(gpii.tests.oauth2.dataStore.testdata.authDecision1.userId,
            gpii.tests.oauth2.dataStore.testdata.authDecision1.clientId,
            gpii.tests.oauth2.dataStore.testdata.authDecision1.redirectUri);
    };

    gpii.tests.oauth2.dataStore.verifyAuthDecision1 = function (authDecision) {
        jqUnit.assertEquals("userId", gpii.tests.oauth2.dataStore.testdata.authDecision1.userId, authDecision.userId);
        jqUnit.assertEquals("clientId", gpii.tests.oauth2.dataStore.testdata.authDecision1.clientId, authDecision.clientId);
        jqUnit.assertEquals("redirectUri", gpii.tests.oauth2.dataStore.testdata.authDecision1.redirectUri, authDecision.redirectUri);
        jqUnit.assertEquals("accessToken", gpii.tests.oauth2.dataStore.testdata.authDecision1.accessToken, authDecision.accessToken);
        jqUnit.assertFalse("not revoked", authDecision.revoked);
    };

    gpii.tests.oauth2.dataStore.saveAuthCode1 = function (dataStore, authDecisionId) {
        dataStore.saveAuthCode(authDecisionId, "code_1");
    };

    gpii.tests.oauth2.dataStore.findAuthByCode1 = function (dataStore) {
        return dataStore.findAuthByCode("code_1");
    };

    gpii.tests.oauth2.dataStore.verifyAuthorizedClientB = function (authClient, authDecisionId) {
        jqUnit.assertEquals("authDecisionId", authDecisionId, authClient.authDecisionId);
        jqUnit.assertEquals("clientName", "Client B", authClient.clientName);
    };

    gpii.tests.oauth2.dataStore.verifyAuthorizedClientC = function (authClient, authDecisionId) {
        jqUnit.assertEquals("authDecisionId", authDecisionId, authClient.authDecisionId);
        jqUnit.assertEquals("clientName", "Client C", authClient.clientName);
    };

    gpii.tests.oauth2.dataStore.verifyAuthForAccessToken1 = function (auth) {
        jqUnit.assertEquals("userGpiiToken", "alice_gpii_token", auth.userGpiiToken);
        jqUnit.assertEquals("oauth2ClientId", "client_id_B", auth.oauth2ClientId);
    };

    gpii.tests.oauth2.dataStore.runTests = function () {

        jqUnit.module("GPII OAuth2 data store");

        jqUnit.test("findUserById() returns the user for existing id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            gpii.tests.oauth2.dataStore.verifyAlice(dataStore.findUserById(1));
            gpii.tests.oauth2.dataStore.verifyBob(dataStore.findUserById(2));
        });

        jqUnit.test("findUserById() returns falsey for non-existing id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing user is falsey", dataStore.findUserById(-1));
        });

        jqUnit.test("findUserByUsername() returns the user for existing username", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            gpii.tests.oauth2.dataStore.verifyAlice(dataStore.findUserByUsername("alice"));
            gpii.tests.oauth2.dataStore.verifyBob(dataStore.findUserByUsername("bob"));
        });

        jqUnit.test("findUserByUsername() returns falsey for non-existing username", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing user is falsey", dataStore.findUserByUsername("NON-EXISTING"));
        });

        jqUnit.test("findClientById() returns the client for existing id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            gpii.tests.oauth2.dataStore.verifyClientA(dataStore.findClientById(1));
            gpii.tests.oauth2.dataStore.verifyClientB(dataStore.findClientById(2));
        });

        jqUnit.test("findClientById() returns falsey for non-existing id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing client is falsey", dataStore.findClientById(-1));
        });

        jqUnit.test("findClientByOauth2ClientId() returns the client for existing client_id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            gpii.tests.oauth2.dataStore.verifyClientA(dataStore.findClientByOauth2ClientId("client_id_A"));
            gpii.tests.oauth2.dataStore.verifyClientB(dataStore.findClientByOauth2ClientId("client_id_B"));
        });

        jqUnit.test("findClientByOauth2ClientId() returns falsey for non-existing client_id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing client is falsey", dataStore.findClientByOauth2ClientId("NON-EXISTING"));
        });

        jqUnit.test("saveAuthDecision() assigns an id and returns the new entity", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(authDecision1);
            jqUnit.assertValue("Id has been assigned", authDecision1.id);
        });

        jqUnit.test("findAuthDecisionById() finds an existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            var retrieved = dataStore.findAuthDecisionById(authDecision1.id);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(retrieved);
        });

        jqUnit.test("findAuthDecisionById() returns falsey for non-existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing authDecision is falsey",
                dataStore.findAuthDecisionById(-1));
        });

        jqUnit.test("findAuthDecision() finds an existing authorization and falsey for revoked", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // save
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            // find and verify
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(gpii.tests.oauth2.dataStore.findAuthDecision1(dataStore));
            // revoke
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify no longer found
            jqUnit.assertFalse("revoked authDecision is falsey",
                gpii.tests.oauth2.dataStore.findAuthDecision1(dataStore));
        });

        jqUnit.test("findAuthDecision() returns falsey for non-existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing authDecision is falsey",
                gpii.tests.oauth2.dataStore.findAuthDecision1(dataStore));
        });

        jqUnit.test("saveAuthCode(), verify findAuthByCode(), revoke, and then verify no longer found", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // save authDecision and authCode
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            gpii.tests.oauth2.dataStore.saveAuthCode1(dataStore, authDecision1.id);
            // find and verify
            var auth = gpii.tests.oauth2.dataStore.findAuthByCode1(dataStore);
            jqUnit.assertEquals("clientId",
                gpii.tests.oauth2.dataStore.testdata.authDecision1.clientId,
                auth.clientId);
            jqUnit.assertEquals("redirectUri",
                gpii.tests.oauth2.dataStore.testdata.authDecision1.redirectUri,
                auth.redirectUri);
            jqUnit.assertEquals("accessToken",
                gpii.tests.oauth2.dataStore.testdata.authDecision1.accessToken,
                auth.accessToken);
            // revoke authorization
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify no longer found
            jqUnit.assertFalse("revoked authorization is falsey", gpii.tests.oauth2.dataStore.findAuthByCode1(dataStore));
        });

        jqUnit.test("findAuthorizedClientsByUserId() with revoking", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // save authDecisions
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            var authDecision2 = gpii.tests.oauth2.dataStore.saveAuthDecision2(dataStore);
            var userId = gpii.tests.oauth2.dataStore.testdata.userId1;
            // find both clients
            var clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[0], authDecision1.id);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[1], authDecision2.id);
            // revoke authDecision1
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("1 client", 1, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            // save a new authDecision and verify found
            var authDecision3 = gpii.tests.oauth2.dataStore.saveAuthDecision3(dataStore);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[1], authDecision3.id);
            // revoke authDecision2 and authDecision3
            dataStore.revokeAuthDecision(authDecision2.userId, authDecision2.id);
            dataStore.revokeAuthDecision(authDecision3.userId, authDecision3.id);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("0 clients", 0, clients.length);
        });

        jqUnit.test("findAuthByAccessToken() finds an existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            var auth = dataStore.findAuthByAccessToken(authDecision1.accessToken);
            gpii.tests.oauth2.dataStore.verifyAuthForAccessToken1(auth);
        });

        jqUnit.test("findAuthByAccessToken() returns undefined for non-existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertUndefined("non-existing authDecision is undefined",
                dataStore.findAuthByAccessToken("NON-EXISTING"));
        });

        jqUnit.test("findAuthByAccessToken() finds an existing authorization and undefined for revoked", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // save
            var authDecision1 = gpii.tests.oauth2.dataStore.saveAuthDecision1(dataStore);
            // find and verify
            gpii.tests.oauth2.dataStore.verifyAuthForAccessToken1(dataStore.findAuthByAccessToken(authDecision1.accessToken));
            // revoke
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify no longer found
            jqUnit.assertUndefined("revoked authDecision is undefined",
                dataStore.findAuthByAccessToken(authDecision1.accessToken));
        });

    };

})();
