/*
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/


"use strict";

var fluid = require("infusion");

fluid.defaults("gpii.oauth2.dataStore.acceptanceData", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore"],
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
                redirectUri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 2,
                name: "Easit4all",
                oauth2ClientId: "com.bdigital.easit4all",
                oauth2ClientSecret: "client_secret_easit4all",
                redirectUri: "http://com.bdigital.easit4all/the-client%27s-uri/",
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 3,
                name: "GNOME Magnifier",
                oauth2ClientId: "org.gnome.desktop.a11y.magnifier",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 4,
                name: "GNOME Desktop",
                oauth2ClientId: "org.gnome.desktop.interface",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 5,
                name: "First Discovery",
                oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
                oauth2ClientSecret: "client_secret_firstDiscovery",
                allowDirectGpiiTokenAccess: false,
                allowAddPrefs: true
            },
            {
                id: 6,
                name: "Cloud4ClientCredentials",
                oauth2ClientId: "client_for_client_credentials",
                oauth2ClientSecret: "client_secret_for_client_credentials",
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
        clientCredentialsTokensIdSeq: 3,
        clientCredentialsTokens: [
            {
                id: 1,
                clientId: 99,
                accessToken: "non_existent_client",
                revoked: false,
                allowAddPrefs: true
            },
            {
                id: 2,
                clientId: 6,
                accessToken: "not_allowed_to_add_prefs",
                revoked: false,
                allowAddPrefs: false
            }
        ]
    }
});
