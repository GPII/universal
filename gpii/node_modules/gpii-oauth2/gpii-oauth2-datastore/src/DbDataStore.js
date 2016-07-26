/*!
GPII CouchDB OAuth 2 Data Store

Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var fluid = fluid || require("infusion"),
        gpii = fluid.registerNamespace("gpii");

    require("./DbDataStoreUtils.js");

    fluid.defaults("gpii.oauth2.dbDataSource", {
        gradeNames: ["kettle.dataSource.URL", "kettle.dataSource.CouchDB"],
        baseUrl: null,   // Supplied by integrators
        termMap: {
            dbName: null    // Supplied by integrators
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
        // Add baseUrl value into url template since baseUrl (an example baseUrl value: http://localhost:5984/)
        // should not be passed into the "termMap" option because those termMap values will be encoded to
        // compose the url.
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: ["%baseUrl:%port/%dbName%requestUrl", {
                    baseUrl: "{that}.options.baseUrl",
                    port: "{that}.options.port",
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
        // 4. termMap: {
        //        dbName: The database name
        //    }
        dataSourceConfig: {
        },
        distributeOptions: [{
            source: "{that}.options.dataSourceConfig",
            target: "{that > gpii.oauth2.dbDataSource}.options"
        }],
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
            findAllClientsDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAllClients",
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
            findAuthDecisionsByGpiiTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthByGpiiToken?key=\"%gpiiToken\"",
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
            findAuthDecisionDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthDecision?key=[\"%gpiiToken\",\"%clientId\",\"%redirectUri\"]",
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
            findAuthByCodeDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthDecisionByAuthCode?key=%22%code%22&include_docs=true",
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
            findAuthorizedClientsByGpiiTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthorizedClientsByGpiiToken?key=%22%gpiiToken%22&include_docs=true",
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
            findAuthByAccessTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthByAccessToken?key=%22%accessToken%22&include_docs=true",
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
            findAuthDecisionByGpiiTokenAndClientIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthDecisionByGpiiTokenAndClientId?key=[\"%gpiiToken\",\"%clientId\"]",
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
            findClientCredentialsTokenByClientIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findClientCredentialsTokenByClientId?key=\"%clientId\"",
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
            findClientCredentialsTokenByAccessTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findClientCredentialsTokenByAccessToken?key=\"%accessToken\"",
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
            findAuthByClientCredentialsAccessTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/_design/views/_view/findAuthByClientCredentialsAccessToken?key=%22%accessToken%22&include_docs=true",
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
            findAllClients: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAllClientsDataSource",
                    {},
                    null,
                    gpii.oauth2.dbDataStore.handleMultipleRecords
                ]
            },
            // TODO in this implementation, there is a one-to-one correspondence between
            // recorded user 'authorization decisions' and access tokens. We may want to
            // rethink this and give them different lifetimes.
            // TODO: make sure there's only one active access token for one client
            addAuthDecision: {
                funcName: "gpii.oauth2.dbDataStore.addRecord",
                args: [
                    "{that}.saveDataSource",
                    gpii.oauth2.dbDataStore.docTypes.authDecision,
                    "id",
                    "{arguments}.0"
                ]
                // authDecision
            },
            updateAuthDecision: {
                funcName: "gpii.oauth2.dbDataStore.updateAuthDecision",
                args: [
                    "{that}",
                    "{arguments}.0",
                    "{arguments}.1"
                ]
                // userId, authDecisionData
            },
            revokeAuthDecision: {
                funcName: "gpii.oauth2.dbDataStore.revokeAuthDecision",
                args: [
                    "{that}",
                    gpii.oauth2.dbDataStore.setRevoke,
                    "{arguments}.0",
                    "{arguments}.1"
                ]
                // userId, authDecisionId
            },
            findAuthDecisionById: {
                func: "{that}.findById"
                // authDecisionId
            },
            findAuthDecisionsByGpiiToken: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthDecisionsByGpiiTokenDataSource",
                    {
                        gpiiToken: "{arguments}.0"
                    },
                    "gpiiToken",
                    gpii.oauth2.dbDataStore.handleMultipleRecords
                ]
                // gpiiToken
            },
            findAuthDecision: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthDecisionDataSource",
                    {
                        gpiiToken: "{arguments}.0",
                        clientId: "{arguments}.1",
                        redirectUri: "{arguments}.2"
                    },
                    ["gpiiToken", "clientId", "redirectUri"]
                ]
                // gpiiToken, clientId, redirectUri
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
                // authDecisionId, code
            },
            findAuthByCode: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthByCodeDataSource",
                    {
                        code: "{arguments}.0"
                    },
                    "code",
                    gpii.oauth2.dbDataStore.findAuthByCodePostProcess
                ]
                // code
            },
            // Note: With the In Memory Data Store, this function returns an empty array when no clients are found.
            // However, with the DB Data Store, "undefined" is returned.
            findAuthorizedClientsByGpiiToken: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthorizedClientsByGpiiTokenDataSource",
                    {
                        gpiiToken: "{arguments}.0"
                    },
                    "gpiiToken",
                    gpii.oauth2.dbDataStore.findAuthorizedClientsByGpiiTokenPostProcess
                ]
                // gpiiToken
            },
            findAuthByAccessToken: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthByAccessTokenDataSource",
                    {
                        accessToken: "{arguments}.0"
                    },
                    "accessToken",
                    gpii.oauth2.dbDataStore.findAuthByAccessTokenPostProcess
                ]
                // accessToken
            },
            // TODO: The concept of allowDirectGpiiTokenAccess flag was added to integrate Mobile Accessibility
            // for the January 2015 review. It needs to be reassessed.
            findAccessTokenByOAuth2ClientIdAndGpiiToken: {
                funcName: "gpii.oauth2.dbDataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
                // oauth2ClientId, gpiiToken
            },
            findClientCredentialsTokenById: {
                func: "{that}.findById"
                // clientCredentialsTokenId
            },
            findClientCredentialsTokenByClientId: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findClientCredentialsTokenByClientIdDataSource",
                    {
                        clientId: "{arguments}.0"
                    },
                    "clientId"
                ]
                // clientId
            },
            findClientCredentialsTokenByAccessToken: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findClientCredentialsTokenByAccessTokenDataSource",
                    {
                        accessToken: "{arguments}.0"
                    },
                    "accessToken"
                ]
                // accessToken
            },
            // TODO: make sure there's only one non-revoked client credentials token for the given client
            addClientCredentialsToken: {
                funcName: "gpii.oauth2.dbDataStore.addClientCredentialsToken",
                args: [
                    "{that}.saveDataSource",
                    "{arguments}.0"
                ]
                // clientCredentialsTokenData
            },
            revokeClientCredentialsToken: {
                funcName: "gpii.oauth2.dbDataStore.revokeClientCredentialsToken",
                args: [
                    "{that}",
                    "{arguments}.0"
                ]
                // clientCredentialsTokenId
            },
            findAuthByClientCredentialsAccessToken: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthByClientCredentialsAccessTokenDataSource",
                    {
                        accessToken: "{arguments}.0"
                    },
                    "accessToken",
                    gpii.oauth2.dbDataStore.findAuthByClientCredentialsAccessTokenPostProcess
                ]
                // accessToken
            }
        },
        events: {
            onUpdateAuthDecision: null,
            onRevokeAuthDecision: null,
            onFindAccessTokenByOAuth2ClientIdAndGpiiToken: null,
            onRevokeClientCredentialsToken: null
        },
        listeners: {
            onUpdateAuthDecision: [{
                listener: "gpii.oauth2.dbDataStore.authDecisionExists",
                args: ["{that}.findAuthDecisionById", "{arguments}.0"],
                namespace: "authDecisionExists",
                priority: "first"
            }, {
                listener: "gpii.oauth2.dbDataStore.validateGpiiToken",
                args: ["{that}.findGpiiToken", "{arguments}.0"],
                namespace: "validateGpiiToken",
                priority: "after:authDecisionExists"
            }, {
                listener: "gpii.oauth2.dbDataStore.doUpdate",
                args: ["{that}.saveDataSource", "{arguments}.0"],
                namespace: "doUpdate",
                priority: "after:validateGpiiToken"
            }],
            onRevokeAuthDecision: [{
                listener: "gpii.oauth2.dbDataStore.authDecisionExists",
                args: ["{that}.findAuthDecisionById", "{arguments}.0"],
                namespace: "authDecisionExists",
                priority: "first"
            }, {
                listener: "gpii.oauth2.dbDataStore.validateGpiiToken",
                args: ["{that}.findGpiiToken", "{arguments}.0"],
                namespace: "validateGpiiToken",
                priority: "after:authDecisionExists"
            }, {
                listener: "gpii.oauth2.dbDataStore.doUpdate",
                args: ["{that}.saveDataSource", "{arguments}.0"],
                namespace: "doUpdate",
                priority: "after:validateGpiiToken"
            }],
            onFindAccessTokenByOAuth2ClientIdAndGpiiToken: [{
                listener: "gpii.oauth2.dbDataStore.findClient",
                args: ["{that}.findClientByOauth2ClientId", "{arguments}.0"],
                namespace: "findClient",
                priority: "first"
            }, {
                listener: "gpii.oauth2.dbDataStore.findAccessToken",
                args: ["{that}.findAuthDecisionByGpiiTokenAndClientIdDataSource", "{arguments}.0"],
                namespace: "findAccessToken",
                priority: "after:findClient"
            }],
            onRevokeClientCredentialsToken: [{
                listener: "{that}.findClientCredentialsTokenById",
                namespace: "findClientCredentialsToken",
                priority: "first"
            }, {
                listener: "gpii.oauth2.dbDataStore.doRevokeClientCredentialsToken",
                args: ["{that}.saveDataSource", "{arguments}.0"],
                namespace: "doRevokeClientCredentialsToken",
                priority: "after:findClientCredentialsToken"
            }]
        }
    });

})();
