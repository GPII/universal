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

    var gpii = fluid.registerNamespace("gpii"),
        kettle = require("kettle");

    fluid.registerNamespace("gpii.oauth2");

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

    fluid.defaults("gpii.oauth2.dbDataStore", {
        gradeNames: ["gpii.oauth2.dataStore"],
        // Supplied by GPII configuration to config gpii.oauth2.dbDataSource. It contains these elements:
        // 1. gradeNames: The database grade, for example, kettle.dataSource.CouchDB
        // 2. baseUrl: The URL to the server where the database is located. For example, the base URL for the local CouchDB using default port is http://localhost:5984/
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
                    url: "/_design/views/_view/findUserByName?key=%22%username%22",
                    termMap: {
                        username: "%username"
                    }
                }
            },
            findUserByGpiiTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    url: "/_design/views/_view/findUserByGpiiToken?key=%22%gpiiToken%22&include_docs=true",
                    termMap: {
                        gpiiToken: "%gpiiToken"
                    }
                }
            },
            findGpiiTokenDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    url: "/_design/views/_view/findGpiiToken?key=%22%gpiiToken%22",
                    termMap: {
                        gpiiToken: "%gpiiToken"
                    }
                }
            },
            findClientByIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    url: "/_design/views/_view/findClientById?key=%22%gpiiToken%22",
                    termMap: {
                        clientId: "%clientId"
                    }
                }
            },
            findClientByOauth2ClientIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    url: "/_design/views/_view/findClientByOauth2ClientId?key=%22%oauth2ClientId%22",
                    termMap: {
                        oauth2ClientId: "%oauth2ClientId"
                    }
                }
            }
        },
        invokers: {
            findUserById: {
                funcName: "gpii.oauth2.dbDataStore.findUserById",
                args: ["{that}.findUserByIdDataSource", "{arguments}.0"]
                    // userId
            },
            findUserByUsername: {
                funcName: "gpii.oauth2.dbDataStore.findUserByUsername",
                args: ["{that}.findUserByUsernameDataSource", "{arguments}.0"]
                    // userName
            },
            findUserByGpiiToken: {
                funcName: "gpii.oauth2.dbDataStore.findUserByGpiiToken",
                args: ["{that}.findUserByGpiiTokenDataSource", "{arguments}.0"]
                    // gpiiToken
            },
            findGpiiToken: {
                funcName: "gpii.oauth2.dbDataStore.findGpiiToken",
                args: ["{that}.findGpiiTokenDataSource", "{arguments}.0"]
                    // gpiiToken
            },
            findClientById: {
                funcName: "gpii.oauth2.dbDataStore.findClientById",
                args: ["{that}.findClientByIdDataSource", "{arguments}.0"]
                    // userId
            },
            findClientByOauth2ClientId: {
                funcName: "gpii.oauth2.dbDataStore.findClientByOauth2ClientId",
                args: ["{that}.findClientByOauth2ClientIdDataSource", "{arguments}.0"]
                    // oauth2ClientId
            }
        }
    });

    // Users
    // -----

    gpii.oauth2.dbDataStore.findUserById = function (findUserByIdDataSource, userId) {
        var processResponseFunc = function (data) {
            console.log("findUserById", data);
            return !data ? data : {
                name: data.name,
                password: data.password,
                defaultGpiiToken: data.defaultGpiiToken
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findUserByIdDataSource, processResponseFunc, {userId: userId}, "userId");
    };

    gpii.oauth2.dbDataStore.findUserByUsername = function (findUserByUsernameDataSource, username) {
        var processResponseFunc = function (data) {
            return !data ? data : {
                name: data.rows[0].value.name,
                password: data.rows[0].value.password,
                defaultGpiiToken: data.rows[0].value.defaultGpiiToken
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findUserByUsernameDataSource, processResponseFunc, {username: username}, "username");
    };

    gpii.oauth2.dbDataStore.findUserByGpiiToken = function (findUserByGpiiTokenDataSource, gpiiToken) {
        var processResponseFunc = function (data) {
            return !data ? data : {
                name: data.rows[0].doc.name,
                password: data.rows[0].doc.password,
                defaultGpiiToken: data.rows[0].doc.defaultGpiiToken
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findUserByGpiiTokenDataSource, processResponseFunc, {gpiiToken: gpiiToken}, "gpiiToken");
    };

    gpii.oauth2.dbDataStore.findGpiiToken = function (findGpiiTokenDataSource, gpiiToken) {
        var processResponseFunc = function (data) {
            return !data ? data : {
                gpiiToken: data.rows[0].value.gpiiToken,
                userId: data.rows[0].value.userId
                // TODO: add "revoke" field when revoking GPII tokens is supported
                // revoke: data.rows[0].value.revoke
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findGpiiTokenDataSource, processResponseFunc, {gpiiToken: gpiiToken}, "gpiiToken");
    };

    gpii.oauth2.dbDataStore.findClientById = function (findClientByIdDataSource, clientId) {
        var processResponseFunc = function (data) {
            return !data ? data : {
                name: data.name,
                oauth2ClientId: data.oauth2ClientId,
                oauth2ClientSecret: data.oauth2ClientSecret,
                redirectUri: data.redirectUri,
                allowDirectGpiiTokenAccess: data.allowDirectGpiiTokenAccess
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findClientByIdDataSource, processResponseFunc, {clientId: clientId}, "clientId");
    };

    gpii.oauth2.dbDataStore.findClientByOauth2ClientId = function (findClientByOauth2ClientIdDataSource, oauth2ClientId) {
        var processResponseFunc = function (data) {
            return !data ? data : {
                name: data.rows[0].value.name,
                oauth2ClientId: data.rows[0].value.oauth2ClientId,
                oauth2ClientSecret: data.rows[0].value.oauth2ClientSecret,
                redirectUri: data.rows[0].value.redirectUri,
                allowDirectGpiiTokenAccess: data.rows[0].value.allowDirectGpiiTokenAccess
            };
        };

        return gpii.oauth2.dbDataStore.findRecord(findClientByOauth2ClientIdDataSource, processResponseFunc, {oauth2ClientId: oauth2ClientId}, "oauth2ClientId");
    };

    // Utils
    gpii.oauth2.dbDataStore.findRecord = function (dataSource, processResponseFunc, termMap, valueNotEmpty) {
        var promiseTogo = fluid.promise();

        if (!termMap[valueNotEmpty]) {
            promiseTogo.resolve(false);
        } else {
            var promise = dataSource.get(termMap);
            promise.then(function (data) {
                var result = processResponseFunc(data);
                promiseTogo.resolve(result);
            }, function (err) {
                promiseTogo.reject(err);
            });
        }

        return promiseTogo;
    };

})();
