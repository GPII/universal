/**
GPII DB Data Store Tests

Copyright 2016-2017 OCAD University

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

gpii.tests.dbDataStore.verifyFetchedGpiiAppInstallationAuthorization = function (response, expected) {
    gpii.tests.dbDataStore.verifyFetched(response, expected);
    jqUnit.assertFalse("The \"revoked\" value has been set to false", response.revoked);
    jqUnit.assertNotUndefined("The \"timestampCreated\" value has been created", response.timestampCreated);
    jqUnit.assertNull("The \"timestampRevoked\" value has been set to null", response.timestampRevoked);
};

gpii.tests.dbDataStore.testData = {
    user1: {
        "id": "user-1",
        "type": "user",
        "name": "chromehc",
        "password": "chromehc_password",
        "defaultGpiiToken": "chrome_high_contrast"
    },
    tokenChromehcDefault: {
        "id": "gpiiToken-1",
        "type": "gpiiToken",
        "userId": "user-1",
        "gpiiToken": "chrome_high_contrast"
    },
    anonymousToken: {
        "id": "gpiiToken-anonymous",
        "type": "gpiiToken",
        "userId": null,
        "gpiiToken": "anonymous_gpii_token"
    },
    client1: {
        "id": "client-1",
        "type": "webPrefsConsumerClient",
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback"
    },
    client3: {
        "id": "client-3",
        "type": "onboardedSolutionClient",
        "name": "Windows Magnifier",
        "solutionId": "net.gpii.windows.magnifier"
    },
    allClients: [{
        "id": "client-1",
        "type": "webPrefsConsumerClient",
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback"
    }, {
        "id": "client-3",
        "type": "onboardedSolutionClient",
        "name": "Windows Magnifier",
        "solutionId": "net.gpii.windows.magnifier"
    }],
    authorization1: {
        "id": "webPrefsConsumerAuthorization-1",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    },
    authorization2: {
        "id": "onboardedSolutionAuthorization-1",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-3",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    },
    webPrefsConsumerAuthorizationToCreate: {
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "client2_new_access_token",
        "selectedPreferences": {
            "textFont": 2
        },
        "revoked": false
    },
    webPrefsConsumerAuthorizationToUpdate: {
        "id": "webPrefsConsumerAuthorization-1",
        "type": "webPrefsConsumerAuthorization",
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
    onboardedSolutionAuthorizationToCreate: {
        "gpiiToken": "chrome_high_contrast_dark",
        "clientId": "client-3",
        "selectedPreferences": {
            "": true
        }
    },
    revokedAuthorization1: {
        "id": "webPrefsConsumerAuthorization-1",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": true
    },
    UserAuthorizationsByGpiiToken: [{
        "id": "onboardedSolutionAuthorization-1",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-3",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }, {
        "id": "webPrefsConsumerAuthorization-1",
        "type": "webPrefsConsumerAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
        "accessToken": "chrome_high_contrast_access_token",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }],
    UserAuthorizationsByGpiiTokenAfterRevoke: [{
        "id": "onboardedSolutionAuthorization-1",
        "type": "onboardedSolutionAuthorization",
        "gpiiToken": "chrome_high_contrast",
        "clientId": "client-3",
        "selectedPreferences": {
            "": true
        },
        "revoked": false
    }],
    findWebPrefsConsumerAuthorizationByAuthCode1: {
        "clientId": "client-1",
        "redirectUri": "http://org.chrome.cloud4chrome/the-client%27s-uri/",
        "accessToken": "chrome_high_contrast_access_token"
    },
    findWebPrefsConsumerAuthorizationByAuthCodeNew: {
        "clientId": "client-2",
        "redirectUri": false,
        "accessToken": "client2_new_access_token"
    },
    findUserAuthorizedClientsByGpiiToken: {
        "webPrefsConsumerClient": [{
            "authorizationId": "webPrefsConsumerAuthorization-1",
            "oauth2ClientId": "org.chrome.cloud4chrome",
            "clientName": "Service A",
            "selectedPreferences": {
                "": true
            }
        }],
        "onboardedSolutionClient": [{
            "authorizationId": "onboardedSolutionAuthorization-1",
            "solutionId": "net.gpii.windows.magnifier",
            "clientName": "Windows Magnifier",
            "selectedPreferences": {
                "": true
            }
        }]
    },
    findUserAuthorizedClientsByGpiiTokenAfterRevoke: {
        "onboardedSolutionClient": [{
            "authorizationId": "onboardedSolutionAuthorization-1",
            "solutionId": "net.gpii.windows.magnifier",
            "clientName": "Windows Magnifier",
            "selectedPreferences": {
                "": true
            }
        }]
    },
    findWebPrefsConsumerAuthorizationByAccessToken: {
        accessToken: "chrome_high_contrast_access_token",
        client: {
            id: "client-1",
            type: "webPrefsConsumerClient",
            name: "Service A",
            oauth2ClientId: "org.chrome.cloud4chrome",
            oauth2ClientSecret: "client_secret_1",
            redirectUri: "http://localhost:3002/authorize_callback"
        },
        authorization: {
            id: "webPrefsConsumerAuthorization-1",
            type: "webPrefsConsumerAuthorization",
            gpiiToken: "chrome_high_contrast",
            clientId: "client-1",
            redirectUri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
            accessToken: "chrome_high_contrast_access_token",
            selectedPreferences: { "": true },
            revoked: false
        }
    },
    privilegedPrefsCreatorAuthorization1: {
        "id": "privilegedPrefsCreatorAuthorization-1",
        "type": "privilegedPrefsCreatorAuthorization",
        "clientId": "client-2",
        "accessToken": "firstDiscovery_access_token",
        "revoked": false
    },
    privilegedPrefsCreatorAuthorizationAfterRevoke1: {
        "id": "privilegedPrefsCreatorAuthorization-1",
        "type": "privilegedPrefsCreatorAuthorization",
        "clientId": "client-2",
        "accessToken": "firstDiscovery_access_token",
        "revoked": true
    },
    privilegedPrefsCreatorAuthorizationToCreate: {
        "clientId": "client-5",
        "accessToken": "chrome_client_credentials_access_token"
    },
    findPrivilegedPrefsCreatorAuthorizationByAccessToken: {
        "accessToken": "firstDiscovery_access_token",
        "client": {
            "id": "client-2",
            "type": "privilegedPrefsCreatorClient",
            "name": "First Discovery",
            "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
            "oauth2ClientSecret": "client_secret_firstDiscovery"
        },
        "authorization": {
            "id": "privilegedPrefsCreatorAuthorization-1",
            "type": "privilegedPrefsCreatorAuthorization",
            "clientId": "client-2",
            "accessToken": "firstDiscovery_access_token",
            "revoked": false
        }
    },
    gpiiAppInstallationAuthorization1: {
        "id": "gpiiAppInstallationAuthorization-1",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-4",
        "gpiiToken": "chrome_high_contrast",
        "accessToken": "gpii-app-installation-token-1",
        "revoked": false,
        "timestampCreated": "2017-05-29T17:54:00.000Z",
        "timestampRevoked": null,
        "timestampExpires": "3020-05-30T17:54:00.000Z"
    },
    gpiiAppInstallationAuthorizationToCreate: {
        "clientId": "client-1",
        "gpiiToken": "chrome_high_contrast",
        "accessToken": "gpii-app-installation-token-1",
        "timestampExpires": "3020-05-29T17:54:00.000Z"
    },
    findGpiiAppInstallationAuthorizationByAccessToken: {
        "accessToken": "gpii-app-installation-token-1",
        "client": {
            "id": "client-4",
            "type": "gpiiAppInstallationClient",
            "name": "AJC-Bakersfield",
            "oauth2ClientId": "net.gpii.ajc.bakersfield",
            "oauth2ClientSecret": "client_secret_ajc_bakersfield",
            "userId": "user-1"
        },
        "authorization": {
            "id": "gpiiAppInstallationAuthorization-1",
            "type": "gpiiAppInstallationAuthorization",
            "clientId": "client-4",
            "gpiiToken": "chrome_high_contrast",
            "accessToken": "gpii-app-installation-token-1",
            "revoked": false,
            "timestampCreated": "2017-05-29T17:54:00.000Z",
            "timestampRevoked": null,
            "timestampExpires": "3020-05-30T17:54:00.000Z"
        }
    }
};
