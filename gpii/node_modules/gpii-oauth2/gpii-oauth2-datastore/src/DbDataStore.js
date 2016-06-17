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
        gpii = fluid.registerNamespace("gpii"),
        $ = fluid.registerNamespace("jQuery");

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
            }
        }
    });

    // Utils
    gpii.oauth2.dbDataStore.errors = {
        missingInput: {
            msg: "The value of field \"%fieldName\" for getting document is undefined",   // Supplied by integrators
            statusCode: 400,
            isError: true
        }
    };

    gpii.oauth2.dbDataStore.findRecord = function (dataSource, termMap, valueNotEmpty) {
        console.log("in findRecord, valueNotEmpty", valueNotEmpty, "; termMap[valueNotEmpty]", termMap[valueNotEmpty]);
        var promiseTogo = fluid.promise();

        if (!termMap[valueNotEmpty]) {
            var error = fluid.copy(gpii.oauth2.dbDataStore.errors.missingInput);
            error.msg = fluid.stringTemplate(error.msg, {fieldName: valueNotEmpty});
            promiseTogo.reject(error);
        } else {
            console.log("in findRecord, termMap", termMap);
            var promise = dataSource.get(termMap);
            promise.then(function (data) {
                console.log("findRecord, initial received data", data);
                if (data && data.type) {
                    delete data.type;
                }
                console.log("findRecord, after deleting type field", data);

                // $.isEmptyObject() is to work around the issue when fetching data
                // using pouch/couch DB views and records are not found, instead of
                // returning a 404 status code, it returns this object:
                // { total_rows: 1, offset: 0, rows: [] }
                // Note the "rows" value is an empty array.
                // This behavior prevents "kettle.dataSource.CouchDB" -> "notFoundIsEmpty"
                // option from returning "undefined". Instead, an empty object {}
                // is returned. This work around is to make sure "undefined" is returned
                // when an empty object is received.
                promiseTogo.resolve($.isEmptyObject(data) ? undefined : data);
            }, function (error) {
                console.log("findRecord, error", error);
                promiseTogo.reject(error);
            });
        }

        return promiseTogo;
    };

})();
