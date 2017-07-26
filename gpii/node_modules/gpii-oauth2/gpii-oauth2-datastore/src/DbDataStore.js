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
 * to serve as a good reference with an almost identical but much simpler logic. It can be found at:
 * https://github.com/GPII/universal/blob/820e4919907e56f6412b2e3bab18675d5388b00b/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/src/InMemoryDataStore.js
 */

"use strict";

var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

if (!gpii.oauth2.dbDataStore) {
    require("./DbDataStoreUtils.js");
}

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
        findUserByUsernameDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserByName?key=\"%username\"",
                termMap: {
                    username: "%username"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findUserByGpiiTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserByGpiiToken?key=\"%gpiiToken\"&include_docs=true",
                termMap: {
                    gpiiToken: "%gpiiToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.doc"
                    }
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
        findClientBySolutionIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findClientBySolutionId?key=\"%solutionId\"",
                termMap: {
                    solutionId: "%solutionId"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findUserAuthorizableClientsDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserAuthorizableClients",
                rules: {
                    readPayload: {
                        "": "rows"
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
        findUserAuthorizationsByGpiiTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserAuthorizationsByGpiiToken?key=\"%gpiiToken\"",
                termMap: {
                    gpiiToken: "%gpiiToken"
                },
                rules: {
                    readPayload: {
                        "": "rows"
                    }
                }
            }
        },
        findWebPrefsConsumerAuthorizationDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findWebPrefsConsumerAuthorization?key=[\"%gpiiToken\",\"%clientId\",\"%redirectUri\"]",
                termMap: {
                    gpiiToken: "%gpiiToken",
                    clientId: "%clientId",
                    redirectUri: "%redirectUri"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findOnboardedSolutionAuthorizationDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findOnboardedSolutionAuthorization?key=[\"%gpiiToken\",\"%clientId\"]",
                termMap: {
                    gpiiToken: "%gpiiToken",
                    clientId: "%clientId"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findWebPrefsConsumerAuthorizationByAuthCodeDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findWebPrefsConsumerAuthorizationByAuthCode?key=%22%code%22&include_docs=true",
                termMap: {
                    code: "%code"
                },
                rules: {
                    readPayload: {
                        "": "rows.0"
                    }
                }
            }
        },
        findUserAuthorizedAuthorizationByIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserAuthorizedAuthorizationById?key=%22%id%22",
                termMap: {
                    id: "%id"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findUserAuthorizedClientsByGpiiTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findUserAuthorizedClientsByGpiiToken?key=%22%gpiiToken%22&include_docs=true",
                termMap: {
                    gpiiToken: "%gpiiToken"
                },
                rules: {
                    readPayload: {
                        "": "rows"
                    }
                }
            }
        },
        findWebPrefsConsumerAuthorizationByAccessTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findWebPrefsConsumerAuthorizationByAccessToken?key=%22%accessToken%22&include_docs=true",
                termMap: {
                    accessToken: "%accessToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0"
                    }
                }
            }
        },
        findPrivilegedPrefsCreatorAuthorizationByIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findPrivilegedPrefsCreatorAuthorizationById?key=%22%id%22",
                termMap: {
                    id: "%id"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findPrivilegedPrefsCreatorAuthorizationByClientIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findPrivilegedPrefsCreatorAuthorizationByClientId?key=\"%clientId\"",
                termMap: {
                    clientId: "%clientId"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findPrivilegedPrefsCreatorAuthorizationByAccessTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findPrivilegedPrefsCreatorAuthorizationByAccessToken?key=\"%accessToken\"",
                termMap: {
                    accessToken: "%accessToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0.value"
                    }
                }
            }
        },
        findAuthorizationByPrivilegedPrefsCreatorAccessTokenDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findAuthorizationByPrivilegedPrefsCreatorAccessToken?key=%22%accessToken%22&include_docs=true",
                termMap: {
                    accessToken: "%accessToken"
                },
                rules: {
                    readPayload: {
                        "": "rows.0"
                    }
                }
            }
        },
        findGpiiAppInstallationAuthorizationByGpiiTokenAndClientIdDataSource: {
            type: "gpii.oauth2.dbDataSource",
            options: {
                requestUrl: "/_design/views/_view/findGpiiAppInstallationAuthorizationByGpiiTokenAndClientId?key=[\"%gpiiToken\",\"%clientId\"]",
                termMap: {
                    gpiiToken: "%gpiiToken",
                    clientId: "%clientId"
                },
                rules: {
                    readPayload: {
                        "": "rows"
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
        findUserById: {
            func: "{that}.findById"
            // userId
        },
        findUserByUsername: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserByUsernameDataSource",
                {
                    username: "{arguments}.0"
                },
                "username"
            ]
            // userName
        },
        findUserByGpiiToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserByGpiiTokenDataSource",
                {
                    gpiiToken: "{arguments}.0"
                },
                "gpiiToken"
            ]
            // gpiiToken
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
        findClientBySolutionId: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findClientBySolutionIdDataSource",
                {
                    solutionId: "{arguments}.0"
                },
                "solutionId"
            ]
            // SolutionId
        },
        findUserAuthorizableClients: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserAuthorizableClientsDataSource",
                {},
                null,
                gpii.oauth2.dbDataStore.handleMultipleRecords
            ]
        },
        updateUserAuthorizedAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.updateUserAuthorizedAuthorization",
            args: [
                "{that}",
                "{arguments}.0",
                "{arguments}.1"
            ]
            // userId, authorizationData
        },
        revokeUserAuthorizedAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.revokeUserAuthorizedAuthorization",
            args: [
                "{that}",
                gpii.oauth2.dbDataStore.setRevoke,
                "{arguments}.0",
                "{arguments}.1"
            ]
            // userId, authorizationId
        },
        findUserAuthorizedAuthorizationById: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserAuthorizedAuthorizationByIdDataSource",
                {
                    id: "{arguments}.0"
                },
                "id"
            ]
            // onboardedSolutionAuthorizationId or webPrefsConsumerAuthorizationId
        },
        findUserAuthorizationsByGpiiToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserAuthorizationsByGpiiTokenDataSource",
                {
                    gpiiToken: "{arguments}.0"
                },
                "gpiiToken",
                gpii.oauth2.dbDataStore.handleMultipleRecords
            ]
            // gpiiToken
        },
        findWebPrefsConsumerAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findWebPrefsConsumerAuthorizationDataSource",
                {
                    gpiiToken: "{arguments}.0",
                    clientId: "{arguments}.1",
                    redirectUri: "{arguments}.2"
                },
                ["gpiiToken", "clientId", "redirectUri"]
            ]
            // gpiiToken, clientId, redirectUri
        },
        findOnboardedSolutionAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findOnboardedSolutionAuthorizationDataSource",
                {
                    gpiiToken: "{arguments}.0",
                    clientId: "{arguments}.1"
                },
                ["gpiiToken", "clientId"]
            ]
            // gpiiToken, clientId
        },
        // TODO make authCodes active only for a limited period of time
        // TODO make authCodes single use
        saveAuthCode: {
            funcName: "gpii.oauth2.dbDataStore.saveAuthCode",
            args: [
                "{that}.saveDataSource",
                "{arguments}.0",
                "{arguments}.1"
            ]
            // authorizationId, code
        },
        findWebPrefsConsumerAuthorizationByAuthCode: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findWebPrefsConsumerAuthorizationByAuthCodeDataSource",
                {
                    code: "{arguments}.0"
                },
                "code",
                gpii.oauth2.dbDataStore.findWebPrefsConsumerAuthorizationByAuthCodePostProcess
            ]
            // code
        },
        // Note: With the In Memory Data Store, this function returns an empty array when no clients are found.
        // However, with the DB Data Store, "undefined" is returned.
        findUserAuthorizedClientsByGpiiToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findUserAuthorizedClientsByGpiiTokenDataSource",
                {
                    gpiiToken: "{arguments}.0"
                },
                "gpiiToken",
                gpii.oauth2.dbDataStore.findUserAuthorizedClientsByGpiiTokenPostProcess
            ]
            // gpiiToken
        },
        findWebPrefsConsumerAuthorizationByAccessToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findWebPrefsConsumerAuthorizationByAccessTokenDataSource",
                {
                    accessToken: "{arguments}.0"
                },
                "accessToken",
                gpii.oauth2.dbDataStore.findWebPrefsConsumerAuthorizationByAccessTokenPostProcess
            ]
            // accessToken
        },
        // TODO in this implementation, there is a one-to-one correspondence between
        // recorded user 'authorizations' and access tokens. We may want to
        // rethink this and give them different lifetimes.
        // TODO: make sure there's only one active access token for one client
        // addWebPrefsConsumerAuthorization: {
        //     funcName: "gpii.oauth2.dbDataStore.addRecord",
        //     args: [
        //         "{that}.saveDataSource",
        //         gpii.oauth2.docTypes.webPrefsConsumerAuthorization,
        //         "id",
        //         "{arguments}.0"
        //     ]
        //     // webPrefsConsumerAuthorization
        // },
        addAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.addAuthorization",
            args: [
                "{that}.saveDataSource",
                "{arguments}.0",
                "{arguments}.1"
            ]
            // authorizationType, authorizationData
        },
        findPrivilegedPrefsCreatorAuthorizationById: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findPrivilegedPrefsCreatorAuthorizationByIdDataSource",
                {
                    id: "{arguments}.0"
                },
                "id"
            ]
            // privilegedPrefsCreatorAuthorizationId
        },
        findPrivilegedPrefsCreatorAuthorizationByClientId: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findPrivilegedPrefsCreatorAuthorizationByClientIdDataSource",
                {
                    clientId: "{arguments}.0"
                },
                "clientId"
            ]
            // clientId
        },
        findPrivilegedPrefsCreatorAuthorizationByAccessToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findPrivilegedPrefsCreatorAuthorizationByAccessTokenDataSource",
                {
                    accessToken: "{arguments}.0"
                },
                "accessToken"
            ]
            // accessToken
        },
        // TODO: make sure there's only one non-revoked privileged prefs creator for the given client
        // addPrivilegedPrefsCreatorAuthorization: {
        //     funcName: "gpii.oauth2.dbDataStore.addPrivilegedPrefsCreatorAuthorization",
        //     args: [
        //         "{that}.saveDataSource",
        //         "{arguments}.0"
        //     ]
        //     // privilegedPrefsCreatorAuthorizationData
        // },
        revokePrivilegedPrefsCreatorAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.revokePrivilegedPrefsCreatorAuthorization",
            args: [
                "{that}",
                "{arguments}.0"
            ]
            // privilegedPrefsCreatorAuthorizationId
        },
        findAuthorizationByPrivilegedPrefsCreatorAccessToken: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findAuthorizationByPrivilegedPrefsCreatorAccessTokenDataSource",
                {
                    accessToken: "{arguments}.0"
                },
                "accessToken",
                gpii.oauth2.dbDataStore.findAuthorizationByPrivilegedPrefsCreatorAccessTokenPostProcess
            ]
            // accessToken
        },
        findGpiiAppInstallationAuthorizationById: {
            func: "{that}.findById"
            // gpiiAppInstallationAuthorizationId
        },
        findGpiiAppInstallationAuthorizationByGpiiTokenAndClientId: {
            funcName: "gpii.oauth2.dbDataStore.findRecord",
            args: [
                "{that}.findGpiiAppInstallationAuthorizationByGpiiTokenAndClientIdDataSource",
                {
                    gpiiToken: "{arguments}.0",
                    clientId: "{arguments}.1"
                },
                ["gpiiToken", "clientId"],
                gpii.oauth2.dbDataStore.findGpiiAppInstallationAuthorizationByGpiiTokenAndClientIdPostProcess
            ]
            // gpiiToken, clientId
        },
        // Note: Before adding a new GPII app installation authroization: authorizationService.findValidGpiiAppInstallationAuthorization()
        // should have been called to ensure there is NOT any non-revoked or unexpired existing access tokens for the given
        // GPII token and the client ID. See authorizationService.js
        // addGpiiAppInstallationAuthorization: {
        //     funcName: "gpii.oauth2.dbDataStore.addGpiiAppInstallationAuthorization",
        //     args: [
        //         "{that}.saveDataSource",
        //         "{arguments}.0"
        //     ]
        //     // gpiiAppInstallationAuthorizationData
        // },
        expireGpiiAppInstallationAuthorization: {
            funcName: "gpii.oauth2.dbDataStore.expireGpiiAppInstallationAuthorization",
            args: [
                "{that}",
                "{arguments}.0"
            ]
            // gpiiAppInstallationAuthorizationId
        }
    },
    events: {
        onUpdateUserAuthorizedAuthorization: null,
        onRevokeUserAuthorizedAuthorization: null,
        onRevokePrivilegedPrefsCreatorAuthorization: null,
        onExpireGpiiAppInstallationAuthorization: null
    },
    listeners: {
        onUpdateUserAuthorizedAuthorization: [{
            listener: "gpii.oauth2.dbDataStore.authorizationExists",
            args: ["{that}.findUserAuthorizedAuthorizationById", "{arguments}.0"],
            namespace: "authorizationExists"
        }, {
            listener: "gpii.oauth2.dbDataStore.validateGpiiToken",
            args: ["{that}.findGpiiToken", "{arguments}.0"],
            namespace: "validateGpiiToken",
            priority: "after:authorizationExists"
        }, {
            listener: "gpii.oauth2.dbDataStore.doUpdateUserAuthorizedAuthorization",
            args: ["{that}.saveDataSource", "{arguments}.0"],
            namespace: "doUpdateUserAuthorizedAuthorization",
            priority: "after:validateGpiiToken"
        }],
        onRevokeUserAuthorizedAuthorization: [{
            listener: "gpii.oauth2.dbDataStore.authorizationExists",
            args: ["{that}.findUserAuthorizedAuthorizationById", "{arguments}.0"],
            namespace: "authorizationExists"
        }, {
            listener: "gpii.oauth2.dbDataStore.validateGpiiToken",
            args: ["{that}.findGpiiToken", "{arguments}.0"],
            namespace: "validateGpiiToken",
            priority: "after:authorizationExists"
        }, {
            listener: "gpii.oauth2.dbDataStore.doUpdateUserAuthorizedAuthorization",
            args: ["{that}.saveDataSource", "{arguments}.0"],
            namespace: "doUpdateUserAuthorizedAuthorization",
            priority: "after:validateGpiiToken"
        }],
        onRevokePrivilegedPrefsCreatorAuthorization: [{
            listener: "{that}.findPrivilegedPrefsCreatorAuthorizationById",
            namespace: "findPrivilegedPrefsCreatorAuthorization"
        }, {
            listener: "gpii.oauth2.dbDataStore.doRevokePrivilegedPrefsCreatorAuthorization",
            args: ["{that}.saveDataSource", "{arguments}.0"],
            namespace: "doRevokePrivilegedPrefsCreatorAuthorization",
            priority: "after:findPrivilegedPrefsCreatorAuthorization"
        }],
        onExpireGpiiAppInstallationAuthorization: [{
            listener: "{that}.findGpiiAppInstallationAuthorizationById",
            namespace: "findGpiiAppInstallationAuthorization"
        }, {
            listener: "gpii.oauth2.dbDataStore.doUpdateGpiiAppInstallationAuthorization",
            args: ["{that}.saveDataSource", "expired", "{arguments}.0"],
            namespace: "doUpdateGpiiAppInstallationAuthorization",
            priority: "after:findGpiiAppInstallationAuthorization"
        }]
    }
});
