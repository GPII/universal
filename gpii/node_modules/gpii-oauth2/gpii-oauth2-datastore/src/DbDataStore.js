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
        // Add baseUrl value into url template since baseUrl (an example baseUrl value: http://localhost:5984/)
        // should not be passed into the "termMap" option because those termMap values will be encoded to
        // compose the url.
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: ["%baseUrl/%dbName%requestUrl", {
                    baseUrl: "{that}.options.baseUrl",
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
        // 2. baseUrl: The URL to where the database is located. For example, the base URL for the local CouchDB using default port is http://localhost:5984/
        // 3. termMap: {
        //        dbName: The database name
        //    }
        dataSourceConfig: {
        },
        distributeOptions: [{
            source: "{that}.options.dataSourceConfig",
            target: "{that > gpii.oauth2.dbDataSource}.options"
        }],
        components: {
            findUserByIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/%userId",
                    termMap: {
                        userId: "%userId"
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
                            "": "rows.0.value.value"
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
                            "": "rows.0.doc.value"
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
                            "": "rows.0.value.value"
                        }
                    }
                }
            },
            findClientByIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/%clientId",
                    termMap: {
                        clientId: "%clientId"
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
                            "": "rows.0.value.value"
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
            addAuthDecisionDataSource: {
                type: "gpii.oauth2.dbDataSource.writable",
                options: {
                    requestUrl: "/%authDecisionId",
                    termMap: {
                        authDecisionId: "%authDecisionId"
                    }
                }
            },
            findAuthDecisionByIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    requestUrl: "/%authDecisionId",
                    termMap: {
                        authDecisionId: "%authDecisionId"
                    }
                }
            }
        },
        invokers: {
            findUserById: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findUserByIdDataSource",
                    {
                        userId: "{arguments}.0"
                    },
                    "userId"
                ]
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
                // funcName: "gpii.oauth2.dbDataStore.findGpiiToken",
                // args: ["{that}.findGpiiTokenDataSource", "{arguments}.0"]
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
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findClientByIdDataSource",
                    {
                        clientId: "{arguments}.0"
                    },
                    "clientId"
                ]
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
                    gpii.oauth2.dbDataStore.findAllClients
                ]
            },
            addAuthDecision: {
                funcName: "gpii.oauth2.dbDataStore.addRecord",
                args: [
                    "{that}.addAuthDecisionDataSource",
                    "authDecisionId",
                    "{arguments}.0"
                ]
                // authDecision
            },
            findAuthDecisionById: {
                funcName: "gpii.oauth2.dbDataStore.findRecord",
                args: [
                    "{that}.findAuthDecisionByIdDataSource",
                    {
                        authDecisionId: "{arguments}.0"
                    },
                    "authDecisionId"
                ]
                // authDecisionId
            }
        }
    });

})();
