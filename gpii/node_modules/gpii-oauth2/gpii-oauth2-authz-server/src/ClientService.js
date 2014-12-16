"use strict";

var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.clientService", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    components: {
        dataStore: {
            type: "gpii.oauth2.dataStore"
        }
    },
    invokers: {
        authenticateClient: {
            funcName: "gpii.oauth2.clientService.authenticateClient",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
            //                    oauth2ClientId, oauth2ClientSecret
        },
        checkClientRedirectUri: {
            funcName: "gpii.oauth2.clientService.checkClientRedirectUri",
            args: ["{dataStore}", "{arguments}.0", "{arguments}.1"]
            //                    oauth2ClientId, redirectUri
        },
        getClientById: {
            func: "{dataStore}.findClientById"
        }
    }
});

gpii.oauth2.clientService.authenticateClient = function (dataStore, oauth2ClientId, oauth2ClientSecret) {
    var client = dataStore.findClientByOauth2ClientId(oauth2ClientId);
    if (client && client.oauth2ClientSecret === oauth2ClientSecret) {
        return client;
    }
    return false;
};

gpii.oauth2.clientService.checkClientRedirectUri = function (dataStore, oauth2ClientId, redirectUri) {
    var client = dataStore.findClientByOauth2ClientId(oauth2ClientId);
    if (client && client.redirectUri === redirectUri) {
        return client;
    }
    return false;
};
