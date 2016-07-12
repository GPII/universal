/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.oauth2");

    fluid.defaults("gpii.oauth2.userService", {
        gradeNames: "fluid.component",
        components: {
            dataStore: {
                type: "gpii.oauth2.dataStore"
            }
        },
        invokers: {
            authenticateUser: {
                funcName: "gpii.oauth2.userService.authenticateUser",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
                    // username, password
            },
            getAuthorizedClientsByGpiiToken: {
                func: "{dataStore}.findAuthorizedClientsByGpiiToken"
            },
            getUserById: {
                func: "{dataStore}.findUserById"
            },
            gpiiTokenHasAssociatedUser: {
                funcName: "gpii.oauth2.userService.gpiiTokenHasAssociatedUser",
                args: ["{dataStore}", "{arguments}.0"]
                    // gpiiToken
            }
        }
    });

    gpii.oauth2.userService.authenticateUser = function (dataStore, username, password) {
        var user = dataStore.findUserByUsername(username);
        // TODO store passwords securely
        if (user && user.password === password) {
            return user;
        }
        return false;
    };

    gpii.oauth2.userService.gpiiTokenHasAssociatedUser = function (dataStore, gpiiToken) {
        return dataStore.findUserByGpiiToken(gpiiToken) ? true : false;
    };

})();
