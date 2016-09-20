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

(function () {

    "use strict";

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
                type: "gpii.tests.oauth2.baseTestCaseHolder"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.userService.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.userService.testEnvironment"],
        rawModules: [{
            name: "Test with an empty data store",
            tests: [{
                name: "gpiiTokenHasAssociatedUser() returns false for empty dataStore",
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

    fluid.defaults("gpii.tests.oauth2.userService.withData", {
        gradeNames: ["gpii.tests.oauth2.userService.testEnvironment"],
        pouchData: [{
            "_id": "user-1",
            "type": "user",
            "name": "alice",
            "password": "a",
            "defaultGpiiToken": "alice_gpii_token"
        },
        {
            "_id": "gpiiToken-1",
            "type": "gpiiToken",
            "gpiiToken": "alice_gpii_token",
            "userId": "user-1"
        }],
        rawModules: [{
            name: "Test with test data",
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
