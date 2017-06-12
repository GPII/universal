/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit");

require("./js/DataStoreTestsUtils.js");

fluid.defaults("gpii.tests.dbDataStore.environment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    pouchConfig: {
        databases: {
            auth: {
                data: [
                    "%gpii-oauth2/gpii-oauth2-datastore/test/data/gpiiAuthTestData.json",
                    "%gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
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
                    baseUrl: "http://localhost",
                    port: "{gpii.tests.dbDataStore.environment}.options.port",
                    dbName: "auth"
                }
            }
        }
    },
    sequenceEnd: [{
        func: "{gpii.tests.dbDataStore.environment}.events.onCleanup.fire"
    }, {
        event:    "{gpii.tests.dbDataStore.environment}.events.onCleanupComplete",
        listener: "fluid.log",
        args:     ["Database cleanup complete"]
    }]
});

gpii.tests.dbDataStore.saveAndInvokeFetch = function (fetchDataSource, id, that) {
    gpii.tests.dbDataStore.lastSavedId = id;
    gpii.tests.oauth2.invokePromiseProducer(fetchDataSource, [id], that);
};

gpii.tests.dbDataStore.verifyFetched = function (response, expected) {
    jqUnit.assertEquals("The fetched document id matches the saved record", gpii.tests.dbDataStore.lastSavedId, response.id);
    jqUnit.assertLeftHand("The data is saved successfully", expected, response);
};

gpii.tests.dbDataStore.verifyFetchedResourceOwnerToken = function (response, dataToSave) {
    gpii.tests.dbDataStore.verifyFetched(response, dataToSave);
    jqUnit.assertFalse("The \"expired\" value has been set to false", response.expired);
    jqUnit.assertFalse("The \"revoked\" value has been set to false", response.revoked);
    jqUnit.assertNotUndefined("The \"timestampCreated\" value has been created", response.timestampCreated);
    jqUnit.assertNull("The \"timestampRevoked\" value has been set to null", response.timestampRevoked);
};

gpii.tests.dbDataStore.testData = {
    user1: {
        "id": "user-1",
        "name": "chromehc",
        "password": "chromehc_password",
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
        "oauth2ClientType": "webApp",
        "redirectUri": "http://localhost:3002/authorize_callback"
    },
    allClients: [{
        "id": "client-1",
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "oauth2ClientType": "webApp",
        "redirectUri": "http://localhost:3002/authorize_callback"
    }, {
        "id": "client-2",
        "name": "First Discovery",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "oauth2ClientSecret": "client_secret_firstDiscovery",
        "oauth2ClientType": "clientCredentialsApp",
        "allowAddPrefs": true
    }, {
        "id": "client-3",
        "name": "Windows Magnifier",
        "oauth2ClientId": "net.gpii.windows.magnifier",
        "oauth2ClientSecret": "client_secret_windows_magnifier",
        "oauth2ClientType": "thirdPartyApp"
    }],
    authDecision1: {
        "id": "authDecision-1",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
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
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
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
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
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
    }],
    findAuthByCode1: {
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
        "accessToken": "chrome_high_contrast_access_token"
    },
    findAuthByCodeNew: {
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "client2_new_access_token"
    },
    findAuthorizedClientsByGpiiToken: [{
        "authDecisionId": "authDecision-1",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "clientName": "Service A",
        "selectedPreferences": {
            "": true
        }
    }, {
        "authDecisionId": "authDecision-2",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "clientName": "First Discovery",
        "selectedPreferences": {
            "textFont": "arial"
        }
    }],
    findAuthorizedClientsByGpiiTokenAfterRevoke: [{
        "authDecisionId": "authDecision-2",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "clientName": "First Discovery",
        "selectedPreferences": {
            "textFont": "arial"
        }
    }],
    findAuthByAccessToken: {
        userGpiiToken: "chrome_high_contrast",
        oauth2ClientId: "org.chrome.cloud4chrome",
        selectedPreferences: {
            "": true
        }
    },
    clientCredentialsToken1: {
        "id": "clientCredentialsToken-1",
        "clientId": "client-2",
        "accessToken": "firstDiscovery_access_token",
        "allowAddPrefs": true,
        "revoked": false
    },
    clientCredentialsTokenAfterRevoke1: {
        "id": "clientCredentialsToken-1",
        "clientId": "client-2",
        "accessToken": "firstDiscovery_access_token",
        "allowAddPrefs": true,
        "revoked": true
    },
    clientCredentialsTokenToCreate: {
        "clientId": "client-1",
        "accessToken": "chrome_client_credentials_access_token",
        "allowAddPrefs": true
    },
    findAuthByClientCredentialsAccessToken: {
        oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
        allowAddPrefs: true
    },
    resourceOwnerToken1: {
        "id": "resourceOwnerToken-1",
        "clientId": "client-1",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "native-gpii-app-token-1",
        "expiresIn": 3600,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    },
    findResourceOwnerTokenByGpiiTokenAndClientId: [{
        "id": "resourceOwnerToken-1",
        "accessToken": "native-gpii-app-token-1",
        "expiresIn": 3600,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    },
    {
        "id": "resourceOwnerToken-2",
        "accessToken": "native-gpii-app-token-2",
        "expiresIn": 360000000000,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 3020 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    }],
    findResourceOwnerTokenByGpiiTokenAndClientIdAfterExpire: [{
        "id": "resourceOwnerToken-2",
        "accessToken": "native-gpii-app-token-2",
        "expiresIn": 360000000000,
        "revoked": false,
        "expired": false,
        "timestampCreated": "Mon May 29 3020 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    }],
    resourceOwnerTokenToCreate: {
        "clientId": "client-1",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "native-gpii-app-token-1",
        "expiresIn": 3600
    },
    resourceOwnerToken1AfterExpired: {
        "id": "resourceOwnerToken-1",
        "clientId": "client-1",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "native-gpii-app-token-1",
        "expiresIn": 3600,
        "revoked": false,
        "expired": true,
        "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    },
    resourceOwnerToken1AfterRevoked: {
        "id": "resourceOwnerToken-1",
        "clientId": "client-1",
        "gpiiToken": "gpiiToken-1",
        "accessToken": "native-gpii-app-token-1",
        "expiresIn": 3600,
        "revoked": true,
        "expired": false,
        "timestampCreated": "Mon May 29 2017 13:54:00 GMT-0400 (EDT)",
        "timestampRevoked": null
    }
};
