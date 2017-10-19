/*!
Copyright 2015-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function () {

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.tests.oauth2.authorizationService.testEnvironment", {
        gradeNames: ["gpii.tests.oauth2.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../gpii-oauth2-datastore/dbViews/views.json",
        dbName: "auth",
        components: {
            authorizationService: {
                type: "gpii.oauth2.authorizationService",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.oauth2.dbDataStore.base"],
                    dbViews: "{arguments}.0",
                    components: {
                        dataStore: {
                            type: "gpii.oauth2.dbDataStore"
                        },
                        codeGenerator: {
                            type: "fluid.component"
                        }
                    }
                }
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        }
    });

    // Tests with an empty data store
    fluid.defaults("gpii.tests.oauth2.authorizationService.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        rawModules: [{
            name: "Test getUserUnauthorizedClientsForGpiiToken()",
            tests: [{
                name: "getUserUnauthorizedClientsForGpiiToken() returns undefined with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["alice_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received with an empty data store", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    // Tests with a data store having test data
    gpii.tests.oauth2.authorizationService.testData = [{
        "_id": "user-1",
        "type": "user",
        "name": "alice",
        "password": "a",
        "defaultGpiiToken": "alice_gpii_token"
    }, {
        "_id": "user-2",
        "type": "user",
        "name": "bob",
        "password": "b",
        "defaultGpiiToken": "bob_gpii_token"
    }, {
        "_id": "user-3",
        "type": "user",
        "name": "carol",
        "password": "c",
        "defaultGpiiToken": "carol_gpii_token"
    }, {
        "_id": "user-4",
        "type": "user",
        "name": "dave",
        "password": "d",
        "defaultGpiiToken": "dave_gpii_token"
    }, {
        "_id": "gpiiToken-1",
        "type": "gpiiToken",
        "gpiiToken": "alice_gpii_token",
        "userId": "user-1"
    }, {
        "_id": "gpiiToken-2",
        "type": "gpiiToken",
        "gpiiToken": "bob_gpii_token",
        "userId": "user-2"
    }, {
        "_id": "gpiiToken-3",
        "type": "gpiiToken",
        "gpiiToken": "carol_gpii_token",
        "userId": "user-3"
    }, {
        "_id": "gpiiToken-4",
        "type": "gpiiToken",
        "gpiiToken": "dave_gpii_token",
        "userId": "user-4"
    }, {
        "_id": "client-1",
        "type": "webPrefsConsumerClient",
        "name": "Client A",
        "oauth2ClientId": "client_id_A",
        "oauth2ClientSecret": "client_secret_A",
        "redirectUri": "http://example.com/callback_A"
    }, {
        "_id": "client-2",
        "type": "webPrefsConsumerClient",
        "name": "Client B",
        "oauth2ClientId": "client_id_B",
        "oauth2ClientSecret": "client_secret_B",
        "redirectUri": "http://example.com/callback_B"
    }, {
        "_id": "client-3",
        "type": "gpiiAppInstallationClient",
        "name": "AJC1",
        "oauth2ClientId": "client_id_AJC1",
        "oauth2ClientSecret": "client_secret_AJC1",
        "userId": "user-1"
    }, {
        "_id": "client-4",
        "type": "onboardedSolutionClient",
        "name": "Windows Magnifier",
        "solutionId": "net.gpii.windows.magnifier"
    }, {
        "_id": "client-5",
        "type": "onboardedSolutionClient",
        "name": "Jaws",
        "solutionId": "net.gpii.jaws"
    }, {
        "_id": "auth-1",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "bob_gpii_token",
        "clientId": "client-1",
        "redirectUri": "",
        "accessToken": "bob_A_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-2",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "carol_gpii_token",
        "clientId": "client-1",
        "redirectUri": "",
        "accessToken": "carol_A_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-3",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "carol_gpii_token",
        "clientId": "client-2",
        "redirectUri": "",
        "accessToken": "carol_B_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-4",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "dave_gpii_token",
        "clientId": "client-1",
        "redirectUri": "",
        "accessToken": "dave_A_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": true
    }, {
        "_id": "auth-5",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "dave_gpii_token",
        "clientId": "client-2",
        "redirectUri": "",
        "accessToken": "dave_B_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-6",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "carol_gpii_token",
        "clientId": "client-4",
        "redirectUri": "",
        "accessToken": "carol_C_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-7",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "carol_gpii_token",
        "clientId": "client-5",
        "redirectUri": "",
        "accessToken": "carol_D_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-8",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "bob_gpii_token",
        "clientId": "client-4",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "auth-9",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "dave_gpii_token",
        "clientId": "client-5",
        "selectedPreferences": {
            "": true
        },
        "revoked": true
    }, {
        "_id": "auth-10",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "alice_gpii_token",
        "accessToken": "gpii-app-installation-token-2",
        "revoked": false,
        "timestampCreated": new Date(new Date().getTime() - 60 * 1000).toISOString(),
        "timestampRevoked": null,
        "timestampExpires": new Date(new Date().getTime() + 40 * 1000).toISOString()
    }, {
        "_id": "auth-11",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "alice_gpii_token",
        "accessToken": "gpii-app-installation-token-3",
        "revoked": false,
        "timestampCreated": "2017-05-29T17:54:00.000Z",
        "timestampRevoked": "2017-05-29T19:54:00.000Z",
        "timestampExpires": "2017-05-29T20:54:00.000Z"
    }, {
        "_id": "auth-12",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "alice_gpii_token",
        "accessToken": "gpii-app-installation-token-1",
        "revoked": false,
        "timestampCreated": "2017-05-29T17:54:00.000Z",
        "timestampRevoked": null,
        "timestampExpires": "2017-05-30T17:54:00.000Z"
    }];

    // All expected results
    gpii.tests.oauth2.authorizationService.expected = {
        invalidUser: {
            isError: true,
            msg: "Invalid user name and password combination",
            statusCode: 401
        },
        clientsForAlice: {
            "webPrefsConsumerClient": [{
                "clientName": "Client A",
                "oauth2ClientId": "client_id_A"
            }, {
                "clientName": "Client B",
                "oauth2ClientId": "client_id_B"
            }],
            "onboardedSolutionClient": [{
                "clientName": "Windows Magnifier",
                "solutionId": "net.gpii.windows.magnifier"
            }, {
                "clientName": "Jaws",
                "solutionId": "net.gpii.jaws"
            }]
        },
        unauthorizedClientsForBob: {
            "webPrefsConsumerClient": [{
                "clientName": "Client B",
                "oauth2ClientId": "client_id_B"
            }],
            "onboardedSolutionClient": [{
                "clientName": "Jaws",
                "solutionId": "net.gpii.jaws"
            }]
        },
        revokedClientsForDave: {
            "webPrefsConsumerClient": [{
                "clientName": "Client A",
                "oauth2ClientId": "client_id_A"
            }],
            "onboardedSolutionClient": [{
                "clientName": "Windows Magnifier",
                "solutionId": "net.gpii.windows.magnifier"
            }, {
                "clientName": "Jaws",
                "solutionId": "net.gpii.jaws"
            }]
        }
    };

    fluid.defaults("gpii.tests.oauth2.authorizationService.withData.getUserUnauthorizedClientsForGpiiToken", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        pouchData: gpii.tests.oauth2.authorizationService.testData,
        rawModules: [{
            name: "Test getUserUnauthorizedClientsForGpiiToken()",
            tests: [{
                name: "getUserUnauthorizedClientsForGpiiToken() returns undefined for unknown token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["unknown"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received with an empty data store", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUserUnauthorizedClientsForGpiiToken() returns all clients for user with no authorizations",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["alice_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["2 client information should be received", gpii.tests.oauth2.authorizationService.expected.clientsForAlice, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUserUnauthorizedClientsForGpiiToken() returns unauthorized clients for user with authorization",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["bob_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The unauthorized client information should be received", gpii.tests.oauth2.authorizationService.expected.unauthorizedClientsForBob, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUserUnauthorizedClientsForGpiiToken() returns empty list for user with all clients authorized",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["carol_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["An empty object should be received", {}, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUserUnauthorizedClientsForGpiiToken() returns clients with revoked authorizations",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUserUnauthorizedClientsForGpiiToken", ["dave_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The revoked client information should be received", gpii.tests.oauth2.authorizationService.expected.revokedClientsForDave, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

})();
