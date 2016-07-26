/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global jqUnit, fluid */

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.tests.oauth2.authorizationServiceWithEmptyDataStore", {
        gradeNames: ["gpii.oauth2.authorizationService"],
        components: {
            dataStore: {
                type: "gpii.oauth2.inMemoryDataStore"
            },
            codeGenerator: {
                type: "fluid.component"
            },
            tempPreferencesDataSource: {
                type: "fluid.emptySubcomponent"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.authorizationService.dataStoreWithTestData", {
        gradeNames: ["gpii.oauth2.inMemoryDataStore"],
        model: {
            users: [
                { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" },
                { id: 2, username: "bob",   password: "b", gpiiToken: "bob_gpii_token" },
                { id: 3, username: "carol", password: "c", gpiiToken: "carol_gpii_token" },
                { id: 4, username: "dave",  password: "d", gpiiToken: "dave_gpii_token" }
            ],
            authDecisions: [
                {
                    id: 1,
                    userId: 2,
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "bob_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 2,
                    userId: 3,
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "carol_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 3,
                    userId: 3,
                    clientId: 2,
                    redirectUri: false,
                    accessToken: "carol_B_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 4,
                    userId: 4,
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "dave_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: true
                },
                {
                    id: 5,
                    userId: 4,
                    clientId: 2,
                    redirectUri: false,
                    accessToken: "dave_B_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                }
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
                }
            ]
        }
    });

    fluid.defaults("gpii.tests.oauth2.authorizationServiceWithTestData", {
        gradeNames: ["gpii.oauth2.authorizationService"],
        components: {
            dataStore: {
                type: "gpii.tests.oauth2.authorizationService.dataStoreWithTestData"
            },
            codeGenerator: {
                type: "fluid.component"
            },
            tempPreferencesDataSource: {
                type: "fluid.emptySubcomponent"
            }
        }
    });

    gpii.tests.oauth2.runAuthorizationServiceTests = function () {

        jqUnit.module("GPII OAuth2 Authorization Service");

        jqUnit.test("getUnauthorizedClientsForUser() returns undefined for empty dataStore", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithEmptyDataStore();
            jqUnit.assertUndefined("undefined for empty dataStore", authorizationService.getUnauthorizedClientsForUser(1));
        });

        jqUnit.test("getUnauthorizedClientsForUser() returns undefined for unknown userId", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            jqUnit.assertUndefined("undefined for unknown userId", authorizationService.getUnauthorizedClientsForUser(100));
        });

        jqUnit.test("getUnauthorizedClientsForUser() returns all clients for user with no authorizations", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForUser(1);
            jqUnit.assertEquals("Expect 2 clients", 2, clients.length);
            jqUnit.assertEquals("Client A", "Client A", clients[0].clientName);
            jqUnit.assertEquals("client_id_A", "client_id_A", clients[0].oauth2ClientId);
            jqUnit.assertEquals("Client B", "Client B", clients[1].clientName);
            jqUnit.assertEquals("client_id_B", "client_id_B", clients[1].oauth2ClientId);
        });

        jqUnit.test("getUnauthorizedClientsForUser() returns unauthorized clients for user with authorization", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForUser(2);
            jqUnit.assertEquals("Expect 1 client", 1, clients.length);
            jqUnit.assertEquals("Client B", "Client B", clients[0].clientName);
            jqUnit.assertEquals("client_id_B", "client_id_B", clients[0].oauth2ClientId);
        });

        jqUnit.test("getUnauthorizedClientsForUser() returns empty list for user with all clients authorized", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForUser(3);
            jqUnit.assertEquals("Expect 0 clients", 0, clients.length);
        });

        jqUnit.test("getUnauthorizedClientsForUser() returns clients with revoked authorizations", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForUser(4);
            jqUnit.assertEquals("Expect 1 client", 1, clients.length);
            jqUnit.assertEquals("Client A", "Client A", clients[0].clientName);
            jqUnit.assertEquals("client_id_A", "client_id_A", clients[0].oauth2ClientId);
        });

    };

})();
