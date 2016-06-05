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

    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.oauth2");

    fluid.defaults("gpii.oauth2.dbDataSource", {
        gradeNames: ["kettle.dataSource.URL"],
        baseUrl: null,   // Supplied by integrators
        dbName: null,    // Supplied by integrators
        dbRequestURL: null,   // Supplied by integrators
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: ["%baseUrl/%dbName%dbRequestURL", {
                    baseUrl: "{that}.options.baseUrl",
                    dbName: "{that}.options.dbName",
                    dbRequestURL: "{that}.options.dbRequestURL"
                }]
            }
        }
    });

    fluid.defaults("gpii.oauth2.dbDataStore", {
        gradeNames: ["gpii.oauth2.dataStore"],
        // Supplied by GPII configuration to config gpii.oauth2.dbDataSource. It contains these elements:
        // 1. gradeNames: The database grade, for example, kettle.dataSource.CouchDB
        // 2. baseUrl: The URL to the server where the database is located. For example, the base URL for the local CouchDB using default port is http://localhost:5984/
        // 3. dbName: The database name
        dbDataSourceOptions: {
        },
        distributeOptions: [{
            source: "{that}.options.dbDataSourceOptions",
            target: "{that > gpii.oauth2.dbDataSource}.options"
        }],
        components: {
            findUserByIdDataSource: {
                type: "gpii.oauth2.dbDataSource",
                options: {
                    dbRequestURL: "/%userId",
                    termMap: {
                        userId: "%userId"
                    }
                }
            }
        },
        invokers: {
            findUserById: {
                funcName: "gpii.oauth2.dbDataStore.findUserById",
                args: ["{that}.findUserByIdDataSource", "{arguments}.0"]
                    // id
            }
        }
    });

    // Users
    // -----

    gpii.oauth2.dbDataStore.findUserById = function (findUserByIdDataSource, id) {
    };

})();
