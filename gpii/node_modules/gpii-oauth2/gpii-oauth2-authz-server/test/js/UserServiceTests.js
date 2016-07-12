/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global jqUnit, fluid */

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.tests.oauth2.userServiceWithEmptyDataStore", {
        gradeNames: "gpii.oauth2.userService",
        components: {
            dataStore: {
                type: "gpii.oauth2.inMemoryDataStore"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.userService.dataStoreWithTestData", {
        gradeNames: "gpii.oauth2.inMemoryDataStore",
        model: {
            users: [
                { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" }
            ]
        }
    });

    fluid.defaults("gpii.tests.oauth2.userServiceWithTestData", {
        gradeNames: "gpii.oauth2.userService",
        components: {
            dataStore: {
                type: "gpii.tests.oauth2.userService.dataStoreWithTestData"
            }
        }
    });

    gpii.tests.oauth2.runUserServiceTests = function () {

        jqUnit.module("GPII OAuth2 User Service");

        jqUnit.test("gpiiTokenHasAssociatedUser() returns false for empty dataStore", function () {
            var userService = gpii.tests.oauth2.userServiceWithEmptyDataStore();
            jqUnit.assertFalse("false for any-token", userService.gpiiTokenHasAssociatedUser("any-token"));
        });

        jqUnit.test("gpiiTokenHasAssociatedUser() returns false for token without user", function () {
            var userService = gpii.tests.oauth2.userServiceWithTestData();
            jqUnit.assertFalse("false for token-without-user", userService.gpiiTokenHasAssociatedUser("token-without-user"));
        });

        jqUnit.test("gpiiTokenHasAssociatedUser() returns true for token with user", function () {
            var userService = gpii.tests.oauth2.userServiceWithTestData();
            jqUnit.assertTrue("true for alice_gpii_token", userService.gpiiTokenHasAssociatedUser("alice_gpii_token"));
        });

    };

})();
