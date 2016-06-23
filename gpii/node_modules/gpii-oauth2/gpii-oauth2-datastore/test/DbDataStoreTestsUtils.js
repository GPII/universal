/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit");

fluid.defaults("gpii.tests.dbDataStore.environment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    pouchConfig: {
        databases: {
            gpiiOauth: {
                data: [
                    "%gpiiOauth2/gpii-oauth2-datastore/test/data/gpiiAuthTestData.json",
                    "%gpiiOauth2/gpii-oauth2-datastore/dbViews/views.json"
                ]
            }
        }
    },
    components: {
        testCaseHolder: {
            type: "gpii.tests.dbDataStore.baseTestCaseHolder"
        }
    },
    distributeOptions: {
        source: "{that}.options.rawModules",
        target: "{that > testCaseHolder}.options.rawModules"
    },
    mergePolicy: {
        rawModules: "noexpand"
    }
});

fluid.defaults("gpii.tests.dbDataStore.baseTestCaseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    events: {
        onResponse: null,
        onError: null
    },
    components: {
        dbDataStore: {
            type: "gpii.oauth2.dbDataStore",
            options: {
                dataSourceConfig: {
                    baseUrl: {
                        expander: {
                            funcName: "fluid.stringTemplate",
                            args: ["http://localhost:%port", {
                                port: "{gpii.tests.dbDataStore.environment}.options.port"
                            }]
                        }
                    },
                    termMap: {
                        dbName: "gpiiOauth"
                    }
                }
            }
        },
        // TODO: remove when all API functions are tested
        massiveRequest: {
            type: "gpii.test.pouch.basic.request",
            options: {
                // path: "/gpiiOauth/user-1"  // findUserById
                // path: "/gpiiOauth/_design/views/_view/findUserByName?key=%22chromehc%22"  // findUserByUsername
                // path: "/gpiiOauth/_design/views/_view/findUserByGpiiToken?key=%22chrome_high_contrast%22&include_docs=true"  // findUserByGpiiToken
                // path: "/gpiiOauth/_design/views/_view/findGpiiToken?key=%22chrome_high_contrast%22"  // findGpiiToken
                // path: "/gpiiOauth/client-1"  // findClientById
                // path: "/gpiiOauth/_design/views/_view/findClientByOauth2ClientId?key=%22org.chrome.cloud4chrome%22"  // findClientByOauth2ClientId
                // path: "/gpiiOauth/_design/views/_view/findAllClients"  // findAllClients
                // path: "/gpiiOauth/_design/views/_view/findAuthByGpiiToken?key=%22chrome_high_contrast%22"  // findAuthDecisionsByGpiiToken
                path: "/gpiiOauth/_design/views/_view/findAuthDecision?key=%5B%22chrome_high_contrast%22,%22client-1%22,false%5D"  // findAuthDecision
            }
        }
    }
});

// TODO: remove when all API functions are tested
fluid.defaults("gpii.test.pouch.basic.request", {
    gradeNames: ["kettle.test.request.http"],
    port:       "{gpii.tests.dbDataStore.environment}.options.port",
    method:     "GET"
});

gpii.tests.dbDataStore.invokePromiseProducer = function (producerFunc, args, that) {
    console.log("invokePromiseProducer", producerFunc, args);
    var promise = producerFunc.apply(null, args);
    console.log("after invokePromiseProducer");
    promise.then(function (response) {
        that.events.onResponse.fire(response);
    }, function (err) {
        that.events.onError.fire(err);
    });
};

gpii.tests.dbDataStore.saveAndInvokeFetch = function (fetchDataSource, id, that) {
    gpii.tests.dbDataStore.lastSavedId = id;
    gpii.tests.dbDataStore.invokePromiseProducer(fetchDataSource, [id], that);
};

gpii.tests.dbDataStore.verifyFetched = function (response, expected) {
    jqUnit.assertEquals("The fetched document id matches the saved record", gpii.tests.dbDataStore.lastSavedId, response.id);
    jqUnit.assertLeftHand("The data is saved successfully", expected, response);
};

gpii.tests.dbDataStore.testData = {
    user1: {
        "id": "user-1",
        "name": "chromehc",
        "password": "chromehc",
        "defaultGpiiToken": "chrome_high_contrast"
    },
    tokenChromehcDefault: {
        "id": "gpiiToken-1",
        "userId": "user-1",
        "gpiiToken": "chrome_high_contrast"
    },
    client1: {
        "id": "client-1",
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback",
        "allowDirectGpiiTokenAccess": false
    },
    allClients: [{
        "id": "client-1",
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback",
        "allowDirectGpiiTokenAccess": false
    }, {
        "id": "client-2",
        "name": "First Discovery",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "oauth2ClientSecret": "client_secret_firstDiscovery",
        "allowDirectGpiiTokenAccess": false,
        "allowAddPrefs": true
    }],
    authDecision1: {
        "id": "authDecision-1",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": false,
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    },
    authDecisionToCreate: {
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "client2_new_access_token",
        "selectedPreferences": {
            "textFont": 2
        },
        "revoked": false
    },
    authDecisionToUpdate: {
        "id": "authDecision-1",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": "a test url",
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "contrast": "bw",
            "toc": true
        },
        "revoked": false
    },
    revokedAuthDecision1: {
        "id": "authDecision-1",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": false,
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": true
    },
    AuthDecisionsByGpiiToken: [{
        "id": "authDecision-1",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": false,
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "id": "authDecision-2",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "chrome_high_contrast_access_token_client_2",
        "selectedPreferences": {
            "textFont": "arial"
        },
        "revoked": false
    }],
    AuthDecisionsByGpiiTokenAfterRevoke: [{
        "id": "authDecision-2",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "chrome_high_contrast_access_token_client_2",
        "selectedPreferences": {
            "textFont": "arial"
        },
        "revoked": false
    }]
};
