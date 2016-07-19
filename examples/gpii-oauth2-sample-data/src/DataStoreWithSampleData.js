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

var fluid = require("infusion");
var util = require("util");
var config = require("../../oauth2SamplesConfig");

fluid.defaults("gpii.oauth2.dataStoreWithSampleData", {
    gradeNames: ["gpii.oauth2.inMemoryDataStore"],
    model: {
        users: [
            { id: 1, username: "alice", password: "a", gpiiToken: "alice_gpii_token" },
            { id: 2, username: "bob", password: "b", gpiiToken: "bob_gpii_token" }
        ],
        clients: [
            {
                id: 1,
                name: "Service A",
                oauth2ClientId: "client_id_1",
                oauth2ClientSecret: "client_secret_1",
                redirectUri: util.format("http://localhost:%d/authorize_callback", config.clientPort)
            },
            {
                id: 2,
                name: "Service Passport Client",
                oauth2ClientId: "client_id_pp",
                oauth2ClientSecret: "client_secret_pp",
                redirectUri: util.format("http://localhost:%d/authorize_callback", config.passportClientPort)
            }
        ]
    }
});
