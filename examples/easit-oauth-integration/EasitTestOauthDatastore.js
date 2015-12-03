/*
 * Copyright 2014 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.easitSampleDataStore", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore"],
    listeners: {
        onCreate: "gpii.oauth2.logEasitStartup"
    },
    model: {
        users: [
            { id: 1, username: "chromehc", password: "chromehc", gpiiToken: "review3_chrome_high_contrast" },
            { id: 2, username: "bob", password: "b", gpiiToken: "bob_gpii_token" },
            { id: 3, username: "review3_user_1", password: "test1234", gpiiToken: "review3_user_1" },
            { id: 4, username: "review3_user_2", password: "test1234", gpiiToken: "review3_user_2" },
            { id: 5, username: "review3_user_3", password: "test1234", gpiiToken: "review3_user_3" },
            { id: 6, username: "review3_user_4", password: "test1234", gpiiToken: "review3_user_4" },
            { id: 7, username: "ma1", password: "ma1", gpiiToken: "review3_ma1" },
            { id: 8, username: "ma2", password: "ma2", gpiiToken: "review3_ma2" },
            { id: 9, username: "chris", password: "chris", gpiiToken: "chris" },
            { id: 10, username: "li", password: "li", gpiiToken: "li" }
        ],
        clients: [
            {
                id: 1,
                name: "Service A",
                oauth2ClientId: "org.chrome.cloud4chrome",
                oauth2ClientSecret: "client_secret_1",
                redirectUri: "http://localhost:3002/authorize_callback",
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 2,
                name: "Service Passport Client",
                oauth2ClientId: "client_id_pp",
                oauth2ClientSecret: "client_secret_pp",
                redirectUri: "http://localhost:3003/authorize_callback",
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 3,
                name: "Easit4all",
                oauth2ClientId: "com.bdigital.easit4all",
                oauth2ClientSecret: "client_secret_easit4all",
                redirectUri: "http://www.easit4all.com/oauth_signin/authorize_callback",
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 4,
                name: "Mobile Accessibility",
                oauth2ClientId: "es.codefactory.android.app.ma",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: true
            },
            {
                id: 5,
                name: "GNOME Magnifier",
                oauth2ClientId: "org.gnome.desktop.a11y.magnifier",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 6,
                name: "First Discovery",
                oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
                oauth2ClientSecret: "client_secret_firstDiscovery",
                allowDirectGpiiTokenAccess: false,
                allowAddPrefs: true
            }
        ],
        authDecisionsIdSeq: 6,
        authDecisions: [
            {
                id: 1,
                userId: 7,
                clientId: 4,
                redirectUri: false,
                accessToken: "ma1_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                id: 2,
                userId: 8,
                clientId: 4,
                redirectUri: false,
                accessToken: "ma2_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                id: 3,
                userId: 9,
                clientId: 4,
                redirectUri: false,
                accessToken: "ma_chris_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                id: 4,
                userId: 10,
                clientId: 4,
                redirectUri: false,
                accessToken: "ma_li_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                id: 5,
                userId: 10,
                clientId: 5,
                redirectUri: false,
                accessToken: "li_magnifier_access_token",
                selectedPreferences: { "": true },
                revoked: false
            }
        ],
        clientCredentialsTokensIdSeq: 1
    }
});

gpii.oauth2.logEasitStartup = function (that) {
    var instantiator = fluid.getInstantiator(that);
    console.log("Easit datastore starting up at path " + instantiator.idToPath(that.id));
};
