/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global jqUnit */

var fluid = fluid || require("infusion");

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
                { id: 1, username: "alice", password: "a" },
                { id: 2, username: "bob",   password: "b" },
                { id: 3, username: "carol", password: "c" },
                { id: 4, username: "dave",  password: "d" }
            ],
            gpiiTokens: [
                {
                    gpiiToken: "alice_gpii_token",
                    userId: 1
                },
                {
                    gpiiToken: "bob_gpii_token",
                    userId: 2
                },
                {
                    gpiiToken: "carol_gpii_token",
                    userId: 3
                },
                {
                    gpiiToken: "dave_gpii_token",
                    userId: 4
                }
            ],
            authDecisions: [
                {
                    id: 1,
                    gpiiToken: "bob_gpii_token",
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "bob_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 2,
                    gpiiToken: "carol_gpii_token",
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "carol_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 3,
                    gpiiToken: "carol_gpii_token",
                    clientId: 2,
                    redirectUri: false,
                    accessToken: "carol_B_access_token",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    id: 4,
                    gpiiToken: "dave_gpii_token",
                    clientId: 1,
                    redirectUri: false,
                    accessToken: "dave_A_access_token",
                    selectedPreferences: { "": true },
                    revoked: true
                },
                {
                    id: 5,
                    gpiiToken: "dave_gpii_token",
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

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns undefined for empty dataStore", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithEmptyDataStore();
            jqUnit.assertUndefined("undefined for empty dataStore", authorizationService.getUnauthorizedClientsForGpiiToken("alice_gpii_token"));
        });

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns undefined for unknown token", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            jqUnit.assertUndefined("undefined for unknown token", authorizationService.getUnauthorizedClientsForGpiiToken("UNKNOWN"));
        });

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns all clients for user with no authorizations", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForGpiiToken("alice_gpii_token");
            jqUnit.assertEquals("Expect 2 clients", 2, clients.length);
            jqUnit.assertEquals("Client A", "Client A", clients[0].clientName);
            jqUnit.assertEquals("client_id_A", "client_id_A", clients[0].oauth2ClientId);
            jqUnit.assertEquals("Client B", "Client B", clients[1].clientName);
            jqUnit.assertEquals("client_id_B", "client_id_B", clients[1].oauth2ClientId);
        });

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns unauthorized clients for user with authorization", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForGpiiToken("bob_gpii_token");
            jqUnit.assertEquals("Expect 1 client", 1, clients.length);
            jqUnit.assertEquals("Client B", "Client B", clients[0].clientName);
            jqUnit.assertEquals("client_id_B", "client_id_B", clients[0].oauth2ClientId);
        });

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns empty list for user with all clients authorized", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForGpiiToken("carol_gpii_token");
            jqUnit.assertEquals("Expect 0 clients", 0, clients.length);
        });

        jqUnit.test("getUnauthorizedClientsForGpiiToken() returns clients with revoked authorizations", function () {
            var authorizationService = gpii.tests.oauth2.authorizationServiceWithTestData();
            var clients = authorizationService.getUnauthorizedClientsForGpiiToken("dave_gpii_token");
            jqUnit.assertEquals("Expect 1 client", 1, clients.length);
            jqUnit.assertEquals("Client A", "Client A", clients[0].clientName);
            jqUnit.assertEquals("client_id_A", "client_id_A", clients[0].oauth2ClientId);
        });

    };

})();
