/*
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

fluid.defaults("gpii.oauth2.dataStore.acceptanceData", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore", "autoInit"],
    model: {
        users: [
            { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" },
            { id: 2, username: "bob", password: "b", gpiiToken: "bob_gpii_token" }
        ],
        clients: [
            {
                id: 1,
                name: "Cloud4Chrome",
                oauth2ClientId: "org.chrome.cloud4chrome",
                oauth2ClientSecret: "client_secret_chrome",
                redirectUri: "http://the-client%27s-uri/"
            },
            {
                id: 2,
                name: "Smart Houses",
                oauth2ClientId: "net.gpii.smarthouses",
                oauth2ClientSecret: "client_secret_smarthouses",
                redirectUri: "/authorize_callback"
            }
        ]
    }
});
