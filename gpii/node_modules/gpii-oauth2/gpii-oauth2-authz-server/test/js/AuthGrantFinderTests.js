/*!
Copyright 2016 OCAD university

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

    fluid.defaults("gpii.tests.oauth2.authGrantFinder.testEnvironment", {
        gradeNames: ["gpii.tests.oauth2.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../gpii-oauth2-datastore/dbViews/views.json",
        dbName: "auth",
        components: {
            authGrantFinder: {
                type: "gpii.tests.oauth2.authGrantFinder",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.oauth2.dbDataStore.base"],
                    dbViews: "{arguments}.0"
                }
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        },
        distributeOptions: [{
            record: "gpii.oauth2.dbDataStore",
            target: "{that dataStore}.type"
        }]
    });

    // Tests with an empty data store
    fluid.defaults("gpii.tests.oauth2.authGrantFinder.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder.testEnvironment"],
        rawModules: [{
            name: "Test getGrantForAccessToken()",
            tests: [{
                name: "getGrantForAccessToken() should return undefined with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["any-token"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    // Tests with a data store having test data
    gpii.tests.oauth2.authGrantFinder.testData = [{
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
        "_id": "client-1",
        "type": "client",
        "name": "Client A",
        "oauth2ClientId": "client_id_A",
        "oauth2ClientSecret": "client_secret_A",
        "redirectUri": "http://example.com/callback_A"
    }, {
        "_id": "client-2",
        "type": "client",
        "name": "Client B",
        "oauth2ClientId": "client_id_B",
        "oauth2ClientSecret": "client_secret_B",
        "redirectUri": "http://example.com/callback_B"
    }, {
        "_id": "client-3",
        "type": "client",
        "name": "First Discovery",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "oauth2ClientSecret": "client_secret_firstDiscovery"
    }, {
        "_id": "authDecision-1",
        "type": "authDecision",
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
        "type": "authDecision",
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
        "type": "authDecision",
        "gpiiToken": "carol_gpii_token",
        "clientId": "client-2",
        "redirectUri": "",
        "accessToken": "carol_B_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "_id": "clientCredentialsToken-1",
        "type": "clientCredentialsToken",
        "clientId": "client-3",
        "accessToken": "firstDiscovery_access_token",
        "allowAddPrefs": true,
        "revoked": false
    }];

    // All expected results
    gpii.tests.oauth2.authGrantFinder.expected = {
        authCodeGrant: {
            oauth2ClientId: "client_id_A",
            userGpiiToken: "bob_gpii_token",
            selectedPreferences: { "": true }
        },
        clientCredentialsGrant: {
            oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
            allowAddPrefs: true
        }
    };

    fluid.defaults("gpii.tests.oauth2.authGrantFinder.withData", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder.testEnvironment"],
        pouchData: gpii.tests.oauth2.authGrantFinder.testData,
        rawModules: [{
            name: "Test getGrantForAccessToken()",
            tests: [{
                name: "getGrantForAccessToken() returns undefined for an unknown access token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["unknown"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received for an unknown access token", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test getGrantForAccessToken() with an access token for authorization code grant type",
            tests: [{
                name: "getGrantForAccessToken() returns the authorization info in the format for the authorization code grant type",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["bob_A_access_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The expected authorization info is returned", gpii.tests.oauth2.authGrantFinder.expected.authCodeGrant, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test getGrantForAccessToken() with an access token for client credentials grant type",
            tests: [{
                name: "getGrantForAccessToken() returns the authorization info in the format for the client credentials grant type",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["firstDiscovery_access_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The expected authorization info is returned", gpii.tests.oauth2.authGrantFinder.expected.clientCredentialsGrant, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

})();
