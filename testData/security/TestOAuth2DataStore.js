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

fluid.defaults("gpii.oauth2.testDataStore", {
    gradeNames: "gpii.oauth2.inMemoryDataStore",
    listeners: {
        onCreate: "gpii.oauth2.logTestDataStoreStartup"
    },
    model: {
        users: [
            { id: 1, username: "chromehc", password: "chromehc", gpiiToken: "review3_chrome_high_contrast" },
            { id: 2, username: "ma1", password: "ma1", gpiiToken: "review3_ma1" },
            { id: 3, username: "ma2", password: "ma2", gpiiToken: "review3_ma2" },
            { id: 4, username: "review3_user_1", password: "test1234", gpiiToken: "review3_user_1" },
            { id: 5, username: "review3_user_2", password: "test1234", gpiiToken: "review3_user_2" },
            { id: 6, username: "review3_user_3", password: "test1234", gpiiToken: "review3_user_3" },
            { id: 7, username: "review3_user_4", password: "test1234", gpiiToken: "review3_user_4" },
            { id: 8, username: "li", password: "li", gpiiToken: "li" }
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
                name: "Windows Magnifier",
                oauth2ClientId: "com.microsoft.windows.magnifier",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 7,
                name: "NVDA Screen Reader",
                oauth2ClientId: "org.nvda-project",
                oauth2ClientSecret: false,
                redirectUri: false,
                allowDirectGpiiTokenAccess: false
            },
            {
                id: 8,
                name: "First Discovery",
                oauth2ClientId: "net.gpii.prefsEditors.firstDiscovery",
                oauth2ClientSecret: "client_secret_firstDiscovery",
                allowDirectGpiiTokenAccess: false,
                allowAddPrefs: true
            }
        ],
        authDecisionsIdSeq: 1,
        authDecisions: [ ]
    }
});

gpii.oauth2.logTestDataStoreStartup = function (that) {
    var instantiator = fluid.getInstantiator(that);
    fluid.log("OAuth2 test dataStore starting up at path " + instantiator.idToPath(that.id));
};
