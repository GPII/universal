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
    gpii = fluid.registerNamespace("gpii");

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
                path: "/gpiiOauth/_design/views/_view/findAllClients"  // findAllClients
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
    var promise = producerFunc.apply(null, args);
    promise.then(function (response) {
        that.events.onResponse.fire(response);
    }, function (err) {
        that.events.onError.fire(err);
    });
};

gpii.tests.dbDataStore.expected = {
    user1: {
        "name": "chromehc",
        "password": "chromehc",
        "defaultGpiiToken": "chrome_high_contrast"
    },
    tokenChromehcDefault: {
        "userId": "user-1",
        "gpiiToken": "chrome_high_contrast"
    },
    client1: {
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback",
        "allowDirectGpiiTokenAccess": false
    },
    allClients: [{
        "name": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "oauth2ClientSecret": "client_secret_1",
        "redirectUri": "http://localhost:3002/authorize_callback",
        "allowDirectGpiiTokenAccess": false
    }, {
        "name": "First Discovery",
        "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
        "oauth2ClientSecret": "client_secret_firstDiscovery",
        "allowDirectGpiiTokenAccess": false,
        "allowAddPrefs": true
    }]
};
