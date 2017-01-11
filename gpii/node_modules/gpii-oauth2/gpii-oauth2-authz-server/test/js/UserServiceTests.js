/*!
Copyright 2015 OCAD university

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

    fluid.defaults("gpii.tests.oauth2.userService.testEnvironment", {
        gradeNames: ["gpii.tests.oauth2.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../gpii-oauth2-datastore/dbViews/views.json",
        dbName: "auth",
        components: {
            userService: {
                type: "gpii.oauth2.userService",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.oauth2.dbDataStore.base"],
                    dbViews: "{arguments}.0",
                    components: {
                        dataStore: {
                            type: "gpii.oauth2.dbDataStore"
                        }
                    }
                }
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        }
    });

    // All expected results
    gpii.tests.oauth2.userService.expected = {
        invalidUser: {
            isError: true,
            msg: "Invalid user name and password combination",
            statusCode: 401
        },
        user: {
            "id": "user-1",
            "name": "alice",
            "password": "a",
            "defaultGpiiToken": "alice_gpii_token"
        }
    };

    // Tests with an empty data store
    fluid.defaults("gpii.tests.oauth2.userService.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.userService.testEnvironment"],
        rawModules: [{
            name: "Test authenticateUser()",
            tests: [{
                name: "authenticateUser() with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.authenticateUser", ["any-user", "any-password"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The invalid user error should be received", gpii.tests.oauth2.userService.expected.invalidUser, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }]
        }, {
            name: "Test gpiiTokenHasAssociatedUser()",
            tests: [{
                name: "gpiiTokenHasAssociatedUser() returns false for an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.gpiiTokenHasAssociatedUser", ["any-token"], "{that}"]
                }, {
                    listener: "jqUnit.assertFalse",
                    args: ["false should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    // Tests with a data store having test data
    gpii.tests.oauth2.userService.testData = [{
        "_id": "user-1",
        "type": "user",
        "name": "alice",
        "password": "a",
        "defaultGpiiToken": "alice_gpii_token"
    }, {
        "_id": "gpiiToken-1",
        "type": "gpiiToken",
        "gpiiToken": "alice_gpii_token",
        "userId": "user-1"
    }];

    fluid.defaults("gpii.tests.oauth2.userService.withData", {
        gradeNames: ["gpii.tests.oauth2.userService.testEnvironment"],
        pouchData: gpii.tests.oauth2.userService.testData,
        rawModules: [{
            name: "Test authenticateUser()",
            tests: [{
                name: "authenticateUser() returns invalid user error with a non-existing user",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.authenticateUser", ["non-existing", "non-existing"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The invalid user error should be received", gpii.tests.oauth2.userService.expected.invalidUser, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "authenticateUser() returns invalid user error with a wrong password",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.authenticateUser", ["alice", "wrong-password"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The invalid user error should be received", gpii.tests.oauth2.userService.expected.invalidUser, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "authenticateUser() returns user information with correct user and password",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.authenticateUser", ["alice", "a"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The user information should be received", gpii.tests.oauth2.userService.expected.user, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test gpiiTokenHasAssociatedUser()",
            tests: [{
                name: "gpiiTokenHasAssociatedUser() returns false for token without user",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.gpiiTokenHasAssociatedUser", ["token-without-user"], "{that}"]
                }, {
                    listener: "jqUnit.assertFalse",
                    args: ["false should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "gpiiTokenHasAssociatedUser() returns true for token with user",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{userService}.gpiiTokenHasAssociatedUser", ["alice_gpii_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertTrue",
                    args: ["false should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

})();
