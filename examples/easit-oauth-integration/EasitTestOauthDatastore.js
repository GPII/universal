/*
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.easitSampleDataStore", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore", "autoInit"],
    listeners: {
        onCreate: "gpii.oauth2.logEasitStartup"
    },
    model: {
        users: [
            { id: 1, username: "chromehc", password: "chromehc", gpiiToken: "review3_chrome_high_contrast" },
            { id: 2, username: "bob", password: "b", gpiiToken: "bob_gpii_token" },
            { id: 3, username: "test31", password: "test12", gpiiToken: "u2v00s7c3celq836ffmbf48q8u" },
            { id: 4, username: "test32", password: "test12", gpiiToken: "dsjs5c95k3q8oj3o9vopdathlr" },
            { id: 5, username: "test33", password: "test12", gpiiToken: "68574tivtoemmm174gof9rf3pe" }
        ],
        clients: [
            {
                id: 1,
                name: "Service A",
                oauth2ClientId: "org.chrome.cloud4chrome",
                oauth2ClientSecret: "client_secret_1",
                redirectUri: "http://localhost:3002/authorize_callback"
            },
            {
                id: 2,
                name: "Service Passport Client",
                oauth2ClientId: "client_id_pp",
                oauth2ClientSecret: "client_secret_pp",
                redirectUri: "http://localhost:3003/authorize_callback"
            },
            {
                id: 3,
                name: "Easit4all",
                oauth2ClientId: "client_easit4all",
                oauth2ClientSecret: "client_secret_easit4all",
                redirectUri: "http://localhost:8080/asit/oauth_signin/authorize_callback"
            }
        ]
    }
});

gpii.oauth2.logEasitStartup = function (that) {
    var instantiator = fluid.getInstantiator(that);
    console.log("Easit datastore starting up at path " + instantiator.idToPath(that.id));
};