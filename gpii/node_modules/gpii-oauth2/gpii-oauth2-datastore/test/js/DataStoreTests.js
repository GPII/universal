/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global jqUnit */

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

// TODO standardise on undefined rather than 'falsey'

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.tests.oauth2.dataStore");
    fluid.registerNamespace("gpii.tests.oauth2.dataStore.testdata");

    fluid.defaults("gpii.tests.oauth2.dataStore.dataStoreWithTestData", {
        gradeNames: ["gpii.oauth2.inMemoryDataStore"],
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
                    redirectUri: "http://example.com/callback_A",
                    allowDirectGpiiTokenAccess: false
                },
                {
                    id: 2,
                    name: "Client B",
                    oauth2ClientId: "client_id_B",
                    oauth2ClientSecret: "client_secret_B",
                    redirectUri: "http://example.com/callback_B",
                    allowDirectGpiiTokenAccess: true
                },
                {
                    id: 3,
                    name: "Client C",
                    oauth2ClientId: "client_id_C",
                    oauth2ClientSecret: "client_secret_C",
                    redirectUri: "http://example.com/callback_C",
                    allowDirectGpiiTokenAccess: false
                },
                {
                    id: 4,
                    name: "Client D",
                    oauth2ClientId: "client_id_D",
                    oauth2ClientSecret: "client_secret_D",
                    allowDirectGpiiTokenAccess: false,
                    allowAddPrefs: true
                }
            ]
        }
    });

    gpii.tests.oauth2.dataStore.testdata.userId1 = 1;

    gpii.tests.oauth2.dataStore.testdata.authDecision1 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 2,
        redirectUri: "http://example.com/callback_B",
        accessToken: "access_token_1",
        selectedPreferences: "selected preferences 1"
    };

    gpii.tests.oauth2.dataStore.testdata.authDecision2 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 3,
        redirectUri: "http://example.com/callback_C",
        accessToken: "access_token_2",
        selectedPreferences: "selected preferences 2"
    };

    gpii.tests.oauth2.dataStore.testdata.authDecision3 = {
        userId: gpii.tests.oauth2.dataStore.testdata.userId1,
        clientId: 2,
        redirectUri: "http://example.com/callback_B",
        accessToken: "access_token_3",
        selectedPreferences: "selected preferences 3"
    };

    gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1 = {
        clientId: 4,
        accessToken: "access_token_4",
        revoked: false,
        allowAddPrefs: true
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

    gpii.tests.oauth2.dataStore.verifyClientC = function (client) {
        jqUnit.assertEquals("name", "Client C", client.name);
        jqUnit.assertEquals("oauth2ClientId", "client_id_C", client.oauth2ClientId);
        jqUnit.assertEquals("oauth2ClientSecret", "client_secret_C", client.oauth2ClientSecret);
        jqUnit.assertEquals("redirectUri", "http://example.com/callback_C", client.redirectUri);
    };

    gpii.tests.oauth2.dataStore.verifyClientD = function (client) {
        jqUnit.assertEquals("name", "Client D", client.name);
        jqUnit.assertEquals("oauth2ClientId", "client_id_D", client.oauth2ClientId);
        jqUnit.assertEquals("oauth2ClientSecret", "client_secret_D", client.oauth2ClientSecret);
        jqUnit.assertFalse("allowDirectGpiiTokenAccess", client.allowDirectGpiiTokenAccess);
        jqUnit.assertTrue("allowAddPrefs", client.allowAddPrefs);
    };

    gpii.tests.oauth2.dataStore.addAuthDecision1 = function (dataStore) {
        return dataStore.addAuthDecision(gpii.tests.oauth2.dataStore.testdata.authDecision1);
    };

    gpii.tests.oauth2.dataStore.addAuthDecision2 = function (dataStore) {
        return dataStore.addAuthDecision(gpii.tests.oauth2.dataStore.testdata.authDecision2);
    };

    gpii.tests.oauth2.dataStore.addAuthDecision3 = function (dataStore) {
        return dataStore.addAuthDecision(gpii.tests.oauth2.dataStore.testdata.authDecision3);
    };

    gpii.tests.oauth2.dataStore.findAuthDecision1 = function (dataStore) {
        return dataStore.findAuthDecision(gpii.tests.oauth2.dataStore.testdata.authDecision1.userId,
            gpii.tests.oauth2.dataStore.testdata.authDecision1.clientId,
            gpii.tests.oauth2.dataStore.testdata.authDecision1.redirectUri);
    };

    gpii.tests.oauth2.dataStore.verifyAuthDecision1 = function (authDecision, expectedSelectedPreferences) {
        jqUnit.assertEquals("userId", gpii.tests.oauth2.dataStore.testdata.authDecision1.userId, authDecision.userId);
        jqUnit.assertEquals("clientId", gpii.tests.oauth2.dataStore.testdata.authDecision1.clientId, authDecision.clientId);
        jqUnit.assertEquals("redirectUri", gpii.tests.oauth2.dataStore.testdata.authDecision1.redirectUri, authDecision.redirectUri);
        jqUnit.assertEquals("accessToken", gpii.tests.oauth2.dataStore.testdata.authDecision1.accessToken, authDecision.accessToken);
        jqUnit.assertEquals("selectedPreferences", expectedSelectedPreferences, authDecision.selectedPreferences);
        jqUnit.assertFalse("not revoked", authDecision.revoked);
    };

    gpii.tests.oauth2.dataStore.verifyAuthDecision2 = function (authDecision) {
        jqUnit.assertEquals("userId", gpii.tests.oauth2.dataStore.testdata.authDecision2.userId, authDecision.userId);
        jqUnit.assertEquals("clientId", gpii.tests.oauth2.dataStore.testdata.authDecision2.clientId, authDecision.clientId);
        jqUnit.assertEquals("redirectUri", gpii.tests.oauth2.dataStore.testdata.authDecision2.redirectUri, authDecision.redirectUri);
        jqUnit.assertEquals("accessToken", gpii.tests.oauth2.dataStore.testdata.authDecision2.accessToken, authDecision.accessToken);
        jqUnit.assertEquals("selectedPreferences", gpii.tests.oauth2.dataStore.testdata.authDecision2.selectedPreferences, authDecision.selectedPreferences);
        jqUnit.assertFalse("not revoked", authDecision.revoked);
    };

    gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1 = function (clientCredentialsToken, expectedRevoked) {
        jqUnit.assertEquals("The value of clientId is expected", gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.clientId, clientCredentialsToken.clientId);
        jqUnit.assertEquals("The value of accessToken is expected", gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.accessToken, clientCredentialsToken.accessToken);
        jqUnit.assertEquals("The value of allowAddPrefs is expected", gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.allowAddPrefs, clientCredentialsToken.allowAddPrefs);
        jqUnit.assertEquals("The value of revoked is expected", expectedRevoked, clientCredentialsToken.revoked);
    };

    gpii.tests.oauth2.dataStore.saveAuthCode1 = function (dataStore, authDecisionId) {
        dataStore.saveAuthCode(authDecisionId, "code_1");
    };

    gpii.tests.oauth2.dataStore.findAuthByCode1 = function (dataStore) {
        return dataStore.findAuthByCode("code_1");
    };

    gpii.tests.oauth2.dataStore.verifyAuthorizedClientB = function (authClient, authDecisionId, expectedSelectedPreferences) {
        jqUnit.assertEquals("authDecisionId", authDecisionId, authClient.authDecisionId);
        jqUnit.assertEquals("oauth2ClientId", "client_id_B", authClient.oauth2ClientId);
        jqUnit.assertEquals("clientName", "Client B", authClient.clientName);
        jqUnit.assertEquals("selectedPreferences", expectedSelectedPreferences, authClient.selectedPreferences);
    };

    gpii.tests.oauth2.dataStore.verifyAuthorizedClientC = function (authClient, authDecisionId) {
        jqUnit.assertEquals("authDecisionId", authDecisionId, authClient.authDecisionId);
        jqUnit.assertEquals("oauth2ClientId", "client_id_C", authClient.oauth2ClientId);
        jqUnit.assertEquals("clientName", "Client C", authClient.clientName);
        jqUnit.assertEquals("selectedPreferences", "selected preferences 2", authClient.selectedPreferences);
    };

    gpii.tests.oauth2.dataStore.verifyAuthForAccessToken1 = function (auth) {
        jqUnit.assertEquals("userGpiiToken", "alice_gpii_token", auth.userGpiiToken);
        jqUnit.assertEquals("oauth2ClientId", "client_id_B", auth.oauth2ClientId);
        jqUnit.assertEquals("selectedPreferences", "selected preferences 1", auth.selectedPreferences);
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

        jqUnit.test("findUserByGpiiToken() returns the user for existing gpiiToken", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            gpii.tests.oauth2.dataStore.verifyAlice(dataStore.findUserByGpiiToken("alice_gpii_token"));
            gpii.tests.oauth2.dataStore.verifyBob(dataStore.findUserByGpiiToken("bob_gpii_token"));
        });

        jqUnit.test("findUserByGpiiToken() returns falsey for non-existing gpiiToken", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing gpiiToken is falsey", dataStore.findUserByGpiiToken("NON-EXISTING"));
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

        jqUnit.test("addAuthDecision() assigns an id and returns the new entity (without selected preferences)", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(authDecision1, "selected preferences 1");
            jqUnit.assertValue("Id has been assigned", authDecision1.id);
        });

        jqUnit.test("findAuthDecisionById() finds an existing authorization (without selected preferences)", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            var retrieved = dataStore.findAuthDecisionById(authDecision1.id);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(retrieved, "selected preferences 1");
        });

        jqUnit.test("addAuthDecision() assigns an id and returns the new entity (with selected preferences)", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision2 = gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            gpii.tests.oauth2.dataStore.verifyAuthDecision2(authDecision2);
            jqUnit.assertValue("Id has been assigned", authDecision2.id);
        });

        jqUnit.test("findAuthDecisionById() finds an existing authorization (with selected preferences)", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision2 = gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            var retrieved = dataStore.findAuthDecisionById(authDecision2.id);
            gpii.tests.oauth2.dataStore.verifyAuthDecision2(retrieved);
        });

        jqUnit.test("findAuthDecisionById() returns falsey for non-existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertFalse("non-existing authDecision is falsey",
                dataStore.findAuthDecisionById(-1));
        });

        jqUnit.test("findAuthDecisionsByUserId() finds non-revoked", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var userId = gpii.tests.oauth2.dataStore.testdata.userId1;
            // verify initially empty
            jqUnit.assertEquals("authDecisions is empty", 0, dataStore.findAuthDecisionsByUserId(userId).length);
            // add
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            var authDecision2 = gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            // find and verify
            var userAuthDecisions = dataStore.findAuthDecisionsByUserId(userId);
            jqUnit.assertEquals("userAuthDecisions has 2 elements", 2, userAuthDecisions.length);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(userAuthDecisions[0], "selected preferences 1");
            gpii.tests.oauth2.dataStore.verifyAuthDecision2(userAuthDecisions[1], "selected preferences 2");
            // revoke authDecision1
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify still find authDecision2
            userAuthDecisions = dataStore.findAuthDecisionsByUserId(userId);
            jqUnit.assertEquals("userAuthDecisions has 1 element", 1, userAuthDecisions.length);
            gpii.tests.oauth2.dataStore.verifyAuthDecision2(userAuthDecisions[0], "selected preferences 2");
            // revoke authDecision2
            dataStore.revokeAuthDecision(authDecision2.userId, authDecision2.id);
            // verify find no authDecisions
            jqUnit.assertEquals("authDecisions is empty", 0, dataStore.findAuthDecisionsByUserId(userId).length);
        });

        jqUnit.test("findAuthDecisionsByUserId() returns empty for non-existing user", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            jqUnit.assertEquals("authDecisions is empty", 0, dataStore.findAuthDecisionsByUserId(10).length);
        });

        jqUnit.test("findAuthDecision() finds an existing authorization and falsey for revoked", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            // find and verify
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(gpii.tests.oauth2.dataStore.findAuthDecision1(dataStore),
                "selected preferences 1");
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

        jqUnit.test("updateAuthDecision() updates selectedPreferences", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            // set selectedPreferences
            authDecision1.selectedPreferences = "selectedPreferencesUpdate 1";
            dataStore.updateAuthDecision(authDecision1.userId, authDecision1);
            // verify
            var retrieved = dataStore.findAuthDecisionById(authDecision1.id);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(retrieved, "selectedPreferencesUpdate 1");
            // update selectedPreferences
            authDecision1.selectedPreferences = "selectedPreferencesUpdate 2";
            dataStore.updateAuthDecision(authDecision1.userId, authDecision1);
            // verify
            retrieved = dataStore.findAuthDecisionById(authDecision1.id);
            gpii.tests.oauth2.dataStore.verifyAuthDecision1(retrieved, "selectedPreferencesUpdate 2");
        });

        jqUnit.test("saveAuthCode(), verify findAuthByCode(), revoke, and then verify no longer found", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add authDecision and authCode
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
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

        jqUnit.test("findAuthorizedClientsByUserId()", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add authDecisions
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            var authDecision2 = gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            var userId = gpii.tests.oauth2.dataStore.testdata.userId1;
            // find both clients
            var clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[0], authDecision1.id, "selected preferences 1");
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[1], authDecision2.id);
            // revoke authDecision1
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("1 client", 1, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            // add a new authDecision and verify found
            var authDecision3 = gpii.tests.oauth2.dataStore.addAuthDecision3(dataStore);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[1], authDecision3.id, "selected preferences 3");
            // revoke authDecision2 and authDecision3
            dataStore.revokeAuthDecision(authDecision2.userId, authDecision2.id);
            dataStore.revokeAuthDecision(authDecision3.userId, authDecision3.id);
            clients = dataStore.findAuthorizedClientsByUserId(userId);
            jqUnit.assertEquals("0 clients", 0, clients.length);
        });

        jqUnit.test("findAuthorizedClientsByGpiiToken()", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add authDecisions
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            var authDecision2 = gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            var gpiiToken = "alice_gpii_token";
            // find both clients
            var clients = dataStore.findAuthorizedClientsByGpiiToken(gpiiToken);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[0], authDecision1.id, "selected preferences 1");
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[1], authDecision2.id);
            // revoke authDecision1
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            clients = dataStore.findAuthorizedClientsByGpiiToken(gpiiToken);
            jqUnit.assertEquals("1 client", 1, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            // add a new authDecision and verify found
            var authDecision3 = gpii.tests.oauth2.dataStore.addAuthDecision3(dataStore);
            clients = dataStore.findAuthorizedClientsByGpiiToken(gpiiToken);
            jqUnit.assertEquals("2 clients", 2, clients.length);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientC(clients[0], authDecision2.id);
            gpii.tests.oauth2.dataStore.verifyAuthorizedClientB(clients[1], authDecision3.id, "selected preferences 3");
            // revoke authDecision2 and authDecision3
            dataStore.revokeAuthDecision(authDecision2.userId, authDecision2.id);
            dataStore.revokeAuthDecision(authDecision3.userId, authDecision3.id);
            clients = dataStore.findAuthorizedClientsByGpiiToken(gpiiToken);
            jqUnit.assertEquals("0 clients", 0, clients.length);
        });

        jqUnit.test("findAuthByAccessToken() finds an existing authorization", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
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
            // add
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            // find and verify
            gpii.tests.oauth2.dataStore.verifyAuthForAccessToken1(dataStore.findAuthByAccessToken(authDecision1.accessToken));
            // revoke
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify no longer found
            jqUnit.assertUndefined("revoked authDecision is undefined",
                dataStore.findAuthByAccessToken(authDecision1.accessToken));
        });

        jqUnit.test("findAccessTokenByOAuth2ClientIdAndGpiiToken()", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add authDecision
            var authDecision1 = gpii.tests.oauth2.dataStore.addAuthDecision1(dataStore);
            // find and verify
            var auth = dataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken("client_id_B", "alice_gpii_token");
            jqUnit.assertEquals("accessToken",
                gpii.tests.oauth2.dataStore.testdata.authDecision1.accessToken,
                auth.accessToken);
            // revoke authorization
            dataStore.revokeAuthDecision(authDecision1.userId, authDecision1.id);
            // verify no longer found
            jqUnit.assertUndefined("revoked authDecision is undefined",
                dataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken("client_id_B", "alice_gpii_token"));
        });

        jqUnit.test("findAccessTokenByOAuth2ClientIdAndGpiiToken() fails on client not explicited allowed", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            // add authDecision
            gpii.tests.oauth2.dataStore.addAuthDecision2(dataStore);
            // verify undefined
            jqUnit.assertUndefined("undefined for client without allowDirectGpiiTokenAccess",
                dataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken("client_id_C", "alice_gpii_token"));
        });

        jqUnit.test("findAllClients returns all clients", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var clients = dataStore.findAllClients();
            jqUnit.assertEquals("Expect 4 clients", 4, clients.length);
            gpii.tests.oauth2.dataStore.verifyClientA(clients[0]);
            gpii.tests.oauth2.dataStore.verifyClientB(clients[1]);
            gpii.tests.oauth2.dataStore.verifyClientC(clients[2]);
        });

        jqUnit.test("addClientCredentialsToken(), find added token by id and client id, revoke, then find revoked token by id and client id", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();
            var clientCredentialsToken = dataStore.addClientCredentialsToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1);
            gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1(clientCredentialsToken, gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.revoked);
            jqUnit.assertValue("Id has been assigned", clientCredentialsToken.id);

            var retrieved = dataStore.findClientCredentialsTokenById(clientCredentialsToken.id);
            gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1(retrieved, gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.revoked);

            retrieved = dataStore.findClientCredentialsTokenByClientId(clientCredentialsToken.clientId);
            gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1(retrieved, gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.revoked);

            dataStore.revokeClientCredentialsToken(clientCredentialsToken.id);

            retrieved = dataStore.findClientCredentialsTokenById(clientCredentialsToken.id);
            gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1(retrieved, true);

            retrieved = dataStore.findClientCredentialsTokenByClientId(clientCredentialsToken.clientId);
            jqUnit.assertUndefined("Revoked credential client token is not found", retrieved);
        });

        jqUnit.test("findClientCredentialsTokenByAccessToken(), find by a correct token, find by a wrong token, revoke and find again", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();

            var clientCredentialsToken = dataStore.addClientCredentialsToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1);
            jqUnit.assertValue("Id has been assigned", clientCredentialsToken.id);

            var retrieved = dataStore.findClientCredentialsTokenByAccessToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.accessToken);
            gpii.tests.oauth2.dataStore.verifyClientCredentialsToken1(retrieved, gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.revoked);

            var token = dataStore.findClientCredentialsTokenByAccessToken("wrong-token");
            jqUnit.assertUndefined("non-existing token returns undefined", token);

            dataStore.revokeClientCredentialsToken(clientCredentialsToken.id);

            retrieved = dataStore.findClientCredentialsTokenByAccessToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.accessToken);
            jqUnit.assertUndefined("Revoked credential client token is not found", retrieved);
        });

        jqUnit.test("findAuthForClientCredentialsAccessToken()", function () {
            var dataStore = gpii.tests.oauth2.dataStore.dataStoreWithTestData();

            var clientCredentialsToken = dataStore.addClientCredentialsToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1);
            jqUnit.assertValue("Id has been assigned", clientCredentialsToken.id);

            var client = dataStore.findAuthForClientCredentialsAccessToken("wrong-token");
            jqUnit.assertUndefined("non-existing token returns undefined", client);

            var retrieved = dataStore.findAuthForClientCredentialsAccessToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.accessToken);
            var expected = {
                oauth2ClientId: "client_id_D",
                allowAddPrefs: true
            };
            jqUnit.assertDeepEq("The retrieved auth information is expected", expected, retrieved);

            dataStore.revokeClientCredentialsToken(clientCredentialsToken.id);

            retrieved = dataStore.findAuthForClientCredentialsAccessToken(gpii.tests.oauth2.dataStore.testdata.clientCredentialsToken1.accessToken);
            jqUnit.assertUndefined("Revoked credential client token is not found", retrieved);
        });

    };

})();
