"use strict";

var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.userService", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    components: {
        dataStore: {
            type: "gpii.oauth2.dataStore"
        }
    },
    invokers: {
        authenticateUser: {
            funcName: "gpii.oauth2.userService.authenticateUser",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
            //                    username, password
        },
        getUserById: {
            func: "{dataStore}.findUserById"
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
