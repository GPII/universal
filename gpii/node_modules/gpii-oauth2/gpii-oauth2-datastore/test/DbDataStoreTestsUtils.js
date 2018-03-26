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
    tokenChromehcDefault: {
        "id": "gpiiToken-1",
        "type": "gpiiToken",
        "gpiiToken": "chrome_high_contrast"
    },
    client1: {
        "id": "client-1",
        "type": "gpiiAppInstallationClient",
        "name": "AJC-Bakersfield",
        "oauth2ClientId": "net.gpii.ajc.bakersfield",
        "oauth2ClientSecret": "client_secret_ajc_bakersfield"
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
            "id": "client-1",
            "type": "gpiiAppInstallationClient",
            "name": "AJC-Bakersfield",
            "oauth2ClientId": "net.gpii.ajc.bakersfield",
            "oauth2ClientSecret": "client_secret_ajc_bakersfield"
        },
        "authorization": {
            "id": "gpiiAppInstallationAuthorization-1",
            "type": "gpiiAppInstallationAuthorization",
            "clientId": "client-1",
            "gpiiToken": "chrome_high_contrast",
            "accessToken": "gpii-app-installation-token-1",
            "revoked": false,
            "timestampCreated": "2017-05-29T17:54:00.000Z",
            "timestampRevoked": null,
            "timestampExpires": "3020-05-30T17:54:00.000Z"
        }
    }
};
