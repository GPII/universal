/*!
GPII CouchDB OAuth 2 Data Store

Copyright 2016-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/*
 * gpii.oauth2.dbDataStore provides APIs for the authorization server to communicate with the backend
 * data storage using CouchDB/PouchDB. CouchDB is used when GPII runs in the production configuration
 * and PouchDB is used for the development configuration.
 *
 * This DB data store is a re-writing of the initial synchronized in memory data store. It now uses
 * async promise API to satisfy the async database operations. However, the in memory data store continues
 * to serve as a good reference with an much simpler logic. It can be found at:
 * https://github.com/GPII/universal/blob/820e4919907e56f6412b2e3bab18675d5388b00b/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/src/InMemoryDataStore.js
 */

"use strict";

var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.oauth2.dbDataSource", {
    gradeNames: ["kettle.dataSource.URL", "kettle.dataSource.CouchDB"],
    baseUrl: null,   // Supplied by integrators
    port: null,   // Supplied by integrators
    dbName: null,   // Supplied by integrators
    requestUrl: null,   // Supplied by integrators
    termMap: {
        baseUrl: "noencode:%baseUrl",
        port: "%port",
        dbName: "%dbName"
    },
    directModel: {
        baseUrl: "{that}.options.baseUrl",
        port: "{that}.options.port",
        dbName: "{that}.options.dbName"
    },
    notFoundIsEmpty: true,
    rules: {
        writePayload: {
            "": ""
        },
        readPayload: {
            "": ""
        }
    },
    // requestUrl needs to be resolved upfront because it contains more string templates that need to be replaced at the
    // next round when kettle.dataSource.URL kicks in to compose the actual URL.
    // An example of requestUrl is "/%id", in which case the expected url should be "%baseUrl:%port/%dbName/%id" instead
    // of having "%requestUrl" embedded. The expander below is to prepare the url that's sensible to kettle.dataSource.
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["%baseUrl:%port/%dbName%requestUrl", {
                requestUrl: "{that}.options.requestUrl"
            }]
        }
    }
});

fluid.defaults("gpii.oauth2.dbDataSource.writable", {
    gradeNames: ["gpii.oauth2.dbDataSource", "kettle.dataSource.CouchDB.writable"],
    writable: true,
    writeMethod: "PUT"
});

fluid.defaults("gpii.oauth2.dbDataStore", {
    gradeNames: ["gpii.oauth2.dataStore"],
    // Supplied by GPII configuration to config all gpii.oauth2.dbDataSource instances.
    // It contains these elements:
    // 1. gradeNames: The mixin grade
    // 2. baseUrl: The base URL to where the database is located. For example, a default locally installed CouchDB uses http://127.0.1.1
    // 3. port: The port where the database is located. For example, a default locally installed CouchDB uses port 5984
    // 4. dbName: The database name
    dataSourceConfig: {
    },
    distributeOptions: {
        "dbDataStore.dataSourceConfig": {
            source: "{that}.options.dataSourceConfig",
            target: "{that > gpii.oauth2.dbDataSource}.options"
        }
    },
    components: {
        findByIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/%id",
                termMap: {
                    id: "%id"
                }
            }
        },
        findGpiiTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findGpiiToken?key=\"%gpiiToken\"",
                termMap: {
                    gpiiToken: "%gpiiToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findClientByOauth2ClientIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findClientByOauth2ClientId?key=\"%oauth2ClientId\"",
                termMap: {
                    oauth2ClientId: "%oauth2ClientId"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        saveDataSource: {
            type: "gpii.oauth2.dbDataSource.writable",
            options: {
                requestUrl: "/%id",
                termMap: {
                    id: "%id"
                }
            }
        },
        findAuthorizationByAccessTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findAuthorizationByAccessToken?key=%22%accessToken%22&include_docs=true",
                termMap: {
                    accessToken: "%accessToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0"
                    }
                }
            }
        }
    },
    invokers: {
        findById: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findByIdDataSource",
                {
                    id: "{arguments}.0"
                },
                "id"
            ]
            // id
        },
        findGpiiToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findGpiiTokenDataSource",
                {
                    gpiiToken: "{arguments}.0"
                },
                "gpiiToken"
            ]
            // gpiiToken
        },
        findClientById: {
            func: "{that}.findById"
            // clientId
        },
        findClientByOauth2ClientId: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findClientByOauth2ClientIdDataSource",
                {
                    oauth2ClientId: "{arguments}.0"
                },
                "oauth2ClientId"
            ]
            // oauth2ClientId
        },
        findAuthorizationByAccessToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findAuthorizationByAccessTokenDataSource",
                {
                    accessToken: "{arguments}.0"
                },
                "accessToken",
                gpii.oauth2.dbDataStore.findAuthorizationByAccessTokenPostProcess
            ]
            // accessToken
        },
        addAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.addAuthorization",
            args: [
                "{that}.saveDataSource",
                "{arguments}.0",
                "{arguments}.1"
            ]
            // authorizationType, authorizationData
        },
        findGpiiAppInstallationAuthorizationById: {
            func: "{that}.findById"
            // gpiiAppInstallationAuthorizationId
        }
    }
});
