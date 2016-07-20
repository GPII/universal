/*!
Copyright 2016 OCAD university

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

    fluid.defaults("gpii.tests.oauth2.authorizationService", {
        gradeNames: ["gpii.oauth2.authorizationService"],
        components: {
            codeGenerator: {
                type: "fluid.emptySubcomponent"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.authGrantFinder", {
        gradeNames: ["gpii.oauth2.authGrantFinder"],
        components: {
            authorizationService: {
                type: "gpii.tests.oauth2.authorizationService"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.authGrantFinderWithEmptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder"],
        distributeOptions: [{
            record: "gpii.oauth2.inMemoryDataStore",
            target: "{that dataStore}.type"
        }]
    });

    fluid.defaults("gpii.tests.oauth2.authGrantFinder.dataStoreWithTestData", {
        gradeNames: ["gpii.oauth2.inMemoryDataStore"],
        model: {
            users: [
                { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" },
                { id: 2, username: "bob",   password: "b", gpiiToken: "bob_gpii_token" },
                { id: 3, username: "carol", password: "c", gpiiToken: "carol_gpii_token" }
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
                    name: "First Discovery",
                    oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
                    oauth2ClientSecret: "client_secret_firstDiscovery",
                    allowDirectGpiiTokenAccess: false,
                    allowAddPrefs: true
                }
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
                    revoked: true
                }
            ],
            clientCredentialsTokens: [
                {
                    id: 1,
                    clientId: 3,
                    accessToken: "firstDiscovery_access_token",
                    allowAddPrefs: true,
                    revoked: false
                }
            ]
        }
    });

    fluid.defaults("gpii.tests.oauth2.authGrantFinderWithTestData", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder"],
        distributeOptions: [{
            record: "gpii.tests.oauth2.authGrantFinder.dataStoreWithTestData",
            target: "{that dataStore}.type"
        }]
    });

    gpii.tests.oauth2.runAuthGrantFinderTests = function () {

        jqUnit.module("GPII OAuth2 Authorization Grant Finder");

        jqUnit.test("getGrantForAccessToken() returns undefined for empty dataStore", function () {
            var authGrantFinder = gpii.tests.oauth2.authGrantFinderWithEmptyDataStore();
            jqUnit.assertUndefined("undefined for empty dataStore", authGrantFinder.getGrantForAccessToken("1"));
        });

        jqUnit.test("getGrantForAccessToken() returns undefined for unknown access token", function () {
            var authGrantFinder = gpii.tests.oauth2.authGrantFinderWithTestData();
            jqUnit.assertUndefined("undefined for unknown access token", authGrantFinder.getGrantForAccessToken(100));
        });

        jqUnit.test("Authorization code grant, getGrantForAccessToken() returns authorization info", function () {
            var authGrantFinder = gpii.tests.oauth2.authGrantFinderWithTestData();
            var expected = {
                oauth2ClientId: "client_id_A",
                userGpiiToken: "bob_gpii_token",
                selectedPreferences: { "": true }
            };
            var info = authGrantFinder.getGrantForAccessToken("bob_A_access_token");
            jqUnit.assertDeepEq("The returned authorization info is expected", expected, info);
        });

        jqUnit.test("Client credentials grant, getGrantForAccessToken() returns authorization info", function () {
            var authGrantFinder = gpii.tests.oauth2.authGrantFinderWithTestData();
            var expected = {
                oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
                allowAddPrefs: true
            };
            var info = authGrantFinder.getGrantForAccessToken("firstDiscovery_access_token");
            jqUnit.assertDeepEq("The returned authorization info is expected", expected, info);
        });
    };

})();
