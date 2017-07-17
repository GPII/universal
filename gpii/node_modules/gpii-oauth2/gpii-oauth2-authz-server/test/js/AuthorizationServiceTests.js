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
            name: "Test getUnauthorizedClientsForGpiiToken()",
            tests: [{
                name: "getUnauthorizedClientsForGpiiToken() returns undefined with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["alice_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received with an empty data store", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "findValidGpiiAppInstallationAuthorization() returns undefined with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: [gpii.oauth2.authorizationService.findValidGpiiAppInstallationAuthorization, ["{authorizationService}.dataStore", "alice_gpii_token", "client-1"], "{that}"]
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
        "_id": "authDecision-1",
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
        "_id": "authDecision-2",
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
        "_id": "authDecision-3",
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
        "_id": "authDecision-4",
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
        "_id": "authDecision-5",
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
        "_id": "gpiiAppInstallationAuthorization-1",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "gpii-app-installation-token-1",
        "expiresIn": 3600,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    }, {
        "_id": "gpiiAppInstallationAuthorization-2",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "gpii-app-installation-token-2",
        "expiresIn": 120,
        "revoked": false,
        "expired": false,
        "timestampCreated": new Date(new Date().getTime() - 60 * 1000).toString(),
        "timestampRevoked": null
    }, {
        "_id": "gpiiAppInstallationAuthorization-3",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-3",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "gpii-app-installation-token-3",
        "expiresIn": 3600,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 2016 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": "Mon May 29 2016 15:54:00 GMT-0400 (EDT)"
    }];

    // All expected results
    gpii.tests.oauth2.authorizationService.expected = {
        invalidUser: {
            isError: true,
            msg: "Invalid user name and password combination",
            statusCode: 401
        },
        clientsForAlice: [{
            "clientName": "Client A",
            "oauth2ClientId": "client_id_A"
        }, {
            "clientName": "Client B",
            "oauth2ClientId": "client_id_B"
        }],
        unauthorizedClientsForBob: [{
            "clientName": "Client B",
            "oauth2ClientId": "client_id_B"
        }],
        revokedClientsForDave: [{
            "clientName": "Client A",
            "oauth2ClientId": "client_id_A"
        }],
        findValidGpiiAppInstallationAuthorizationSetExpired: {
            "id": "gpiiAppInstallationAuthorization-1",
            "clientId": "client-3",
            "gpiiToken": "gpiiToken-1",
            "accessToken": "gpii-app-installation-token-1",
            "expiresIn": 3600,
            "revoked": false,
            "expired": true,
            "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
            "timestampRevoked": null
        },
        findValidGpiiAppInstallationAuthorization: {
            "accessToken": "gpii-app-installation-token-2",
            "expiresIn": 120
        }
    };

    fluid.defaults("gpii.tests.oauth2.authorizationService.withData", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        pouchData: gpii.tests.oauth2.authorizationService.testData,
        rawModules: [{
            name: "Test getUnauthorizedClientsForGpiiToken()",
            tests: [{
                name: "getUnauthorizedClientsForGpiiToken() returns undefined for unknown token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["unknown"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received with an empty data store", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUnauthorizedClientsForGpiiToken() returns all clients for user with no authorizations",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["alice_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["2 client information should be received", gpii.tests.oauth2.authorizationService.expected.clientsForAlice, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUnauthorizedClientsForGpiiToken() returns unauthorized clients for user with authorization",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["bob_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The unauthorized client information should be received", gpii.tests.oauth2.authorizationService.expected.unauthorizedClientsForBob, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUnauthorizedClientsForGpiiToken() returns empty list for user with all clients authorized",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["carol_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["An empty array should be received", [], "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "getUnauthorizedClientsForGpiiToken() returns clients with revoked authorizations",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.getUnauthorizedClientsForGpiiToken", ["dave_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The revoked client information should be received", gpii.tests.oauth2.authorizationService.expected.revokedClientsForDave, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test gpii.oauth2.authorizationService.findValidGpiiAppInstallationAuthorization()",
            tests: [{
                name: "findValidGpiiAppInstallationAuthorization() sets expired for expired access tokens and returns unexpired access token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: [gpii.oauth2.authorizationService.findValidGpiiAppInstallationAuthorization, ["{authorizationService}.dataStore", "gpiiToken-1", "client-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["unexpired access token should be returned", gpii.tests.oauth2.authorizationService.expected.findValidGpiiAppInstallationAuthorization, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }, {
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.dataStore.findGpiiAppInstallationAuthorizationById", ["gpiiAppInstallationAuthorization-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["expired access token should have been set to expired", gpii.tests.oauth2.authorizationService.expected.findValidGpiiAppInstallationAuthorizationSetExpired, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "findValidGpiiAppInstallationAuthorization() returns undefined for nonexistent record",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: [gpii.oauth2.authorizationService.findValidGpiiAppInstallationAuthorization, ["{authorizationService}.dataStore", "nonexistent-token", "nonexistent-client"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received for nonexistent record", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "findValidGpiiAppInstallationAuthorization() returns undefined when all existing access tokens have expired",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: [gpii.oauth2.authorizationService.findValidGpiiAppInstallationAuthorization, ["{authorizationService}.dataStore", "gpiiToken-1", "client-2"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received when all existing access tokens have expired", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

})();
