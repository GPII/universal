/*!
Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function () {

    var gpii = fluid.registerNamespace("gpii");

    var pouchData = [{
        "_id": "user1",
        "type": "user",
        "name": "alice",
        "token": "alice_gpii_token"
    }];

    var dbViews = [{
        "_id": "_design/views",
        "views": {
            "findUserByName": {
                "map": "function(doc) {if (doc.type === 'user') emit(doc.name, doc)}"
            }
        }
    }];

    fluid.defaults("gpii.tests.dataSourcePouchDB.testEnvironment", {
        gradeNames: ["gpii.tests.inBrowserPouchDB.testEnvironment"],
        pouchData: pouchData,
        dataSourceOptions: {
            dbViews: dbViews
        },
        dbName: "testDb",
        components: {
            dataSource: {
                type: "gpii.dataSource.pouchDB",
                createOnEvent: "onFixturesConstructed"
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        },
        distributeOptions: {
            "dataSourceOptions": {
                source: "{that}.options.dataSourceOptions",
                target: "{that > dataSource}.options"
            }
        }
    });

    // All expected results
    gpii.tests.dataSourcePouchDB.expected = {
        user1: {
            "type": "user",
            "name": "alice",
            "token": "alice_gpii_token"
        },
        missingError: {
            error: true,
            message: "missing",
            name: "not_found",
            status: 404
        },
        newRecord: {
            "type": "new",
            "data": {
                "new": "random"
            }
        },
        setResponse: {
            "ok": true,
            "id": "newRecord"
        }
    };

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByExisingId", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/user1"
        },
        rawModules: [{
            name: "Query PouchDB by an existing document id",
            tests: [{
                name: "Querying by an existing document id returns the expected record",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["The expected record should be received", gpii.tests.dataSourcePouchDB.expected.user1, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByExisingIdWithModel", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/%id",
            termMap: {
                id: "%id"
            }
        },
        rawModules: [{
            name: "Query PouchDB by an existing document id using term map and direct model",
            tests: [{
                name: "Querying by an existing document id using term map and direct model returns the expected record",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{id: "user1"}], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["The expected record should be received", gpii.tests.dataSourcePouchDB.expected.user1, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByNonexistentId", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/%id",
            termMap: {
                id: "%id"
            }
        },
        rawModules: [{
            name: "Query PouchDB by an non-existent id",
            tests: [{
                name: "Querying by an non-existent id returns 404",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{id: "nonexistent-id"}], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["404 error should be received", gpii.tests.dataSourcePouchDB.expected.missingError, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByNonexistentId-notFoundIsEmpty", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/%id",
            termMap: {
                id: "%id"
            },
            notFoundIsEmpty: true
        },
        rawModules: [{
            name: "Query PouchDB by an non-existent id with \"notFoundIsEmpty\" option being set to true",
            tests: [{
                name: "Querying by an non-existent id with \"notFoundIsEmpty\" being true returns undefined",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{id: "nonexistent-id"}], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByView", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/_design/views/_view/findUserByName?key=\"%username\"",
            termMap: {
                username: "%username"
            }
        },
        rawModules: [{
            name: "Query PouchDB by a view",
            tests: [{
                name: "Querying by a view returns expected record",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{username: "alice"}], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["The expected record should be received", gpii.tests.dataSourcePouchDB.expected.user1, "{arguments}.0.rows.0.value"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.getByViewWithUnmatchedRec", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/_design/views/_view/findUserByName?key=\"%username\"",
            termMap: {
                username: "%username"
            }
        },
        rawModules: [{
            name: "Query PouchDB by a view",
            tests: [{
                name: "Querying by a view returns an empty \"rows\" array",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{username: "nonexistent-user"}], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["An empty \"rows\" array should be received", [], "{arguments}.0.rows"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.dataSourcePouchDB.set", {
        gradeNames: ["gpii.tests.dataSourcePouchDB.testEnvironment"],
        dataSourceOptions: {
            requestUrl: "/%id",
            termMap: {
                id: "%id"
            }
        },
        distributeOptions: {
            "distributeWritable": {
                record: true,
                target: "{that > dataSource}.options.writable"
            }
        },
        rawModules: [{
            name: "Save into PouchDB by a document id",
            tests: [{
                name: "Saving by a document id",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.set", [{id: "newRecord"}, gpii.tests.dataSourcePouchDB.expected.newRecord], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["A success response should be received", gpii.tests.dataSourcePouchDB.expected.setResponse, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }, {
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{dataSource}.get", [{id: "newRecord"}], "{that}"]
                }, {
                    listener: "jqUnit.assertLeftHand",
                    args: ["A success response should be received", gpii.tests.dataSourcePouchDB.expected.newRecord, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    fluid.test.runTests([
        "gpii.tests.dataSourcePouchDB.getByExisingId",
        "gpii.tests.dataSourcePouchDB.getByExisingIdWithModel",
        "gpii.tests.dataSourcePouchDB.getByNonexistentId",
        "gpii.tests.dataSourcePouchDB.getByNonexistentId-notFoundIsEmpty",
        "gpii.tests.dataSourcePouchDB.getByView",
        "gpii.tests.dataSourcePouchDB.getByViewWithUnmatchedRec",
        "gpii.tests.dataSourcePouchDB.set"
    ]);
})();
