/*
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion");

fluid.defaults("gpii.oauth2.dataStore.acceptanceData", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore", "autoInit"],
    model: {
        users: [ // this model is rewritten on startup to hold the token of the fixture's current user
            { id: 1, username: "bob", password: "b", gpiiToken: "placeholder_token" },
            { id: 2, username: "alice", password: "a", gpiiToken: "alice_gpii_token" }
        ],
        clients: [
            {
                id: 1,
                name: "Cloud4Chrome",
                oauth2ClientId: "org.chrome.cloud4chrome",
                oauth2ClientSecret: "client_secret_chrome",
                redirectUri: "http://org.chrome.cloud4chrome/the-client%27s-uri/"
            },
            {
                id: 2,
                name: "Easit4all",
                oauth2ClientId: "com.bdigital.easit4all",
                oauth2ClientSecret: "client_secret_easit4all",
                redirectUri: "http://com.bdigital.easit4all/the-client%27s-uri/"
            },
            {
                id: 3,
                name: "First Discovery",
                oauth2ClientId: "client_first_discovery",
                oauth2ClientSecret: "client_secret_firstDiscovery",
                allowDirectGpiiTokenAccess: false,
                allowAddPrefs: true
            }
        ],
        authDecisionsIdSeq: 2,
        authDecisions: [
            {
                id: 1,
                userId: 2,
                clientId: 2,
                redirectUri: false,
                accessToken: "alice_easit_access_token",
                selectedPreferences: { "": true },
                revoked: false
            }
        ],
        credentialClientTokensIdSeq: 2,
        credentialClientTokens: [
            {
                id: 1,
                clientId: 3,
                accessToken: "first_discovery_access_token",
                revoked: false,
                allowAddPrefs: true
            }
        ]
    }
});
