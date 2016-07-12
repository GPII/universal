/*!
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
require("../../../gpii/node_modules/gpii-oauth2");
var gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.oauth2.resourceServer", {
    gradeNames: ["fluid.component"],
    members: {
        expressApp: {
            expander: {
                func: "gpii.oauth2.createExpressApp"
            }
        }
    },
    components: {
        dataStore: {
            type: "gpii.oauth2.dataStoreWithSampleData" // variants here
        }
    },
    listeners: {
        onCreate: {
            listener: "gpii.oauth2.resourceServer.listenApp",
            args: ["{that}.expressApp", "{that}.dataStore"]
        }
    }
});

gpii.oauth2.resourceServer.sendUnauthorized = function (res) {
    res.status(401);
    res.send("Unauthorized");
};

gpii.oauth2.resourceServer.listenApp = function (app, dataStore) {
    app.get("/settings",
        function (req, res) {
            var accessToken = gpii.oauth2.parseBearerAuthorizationHeader(req);
            if (!accessToken) {
                gpii.oauth2.resourceServer.sendUnauthorized(res);
            } else {
                var auth = dataStore.findAuthByAccessToken(accessToken);
                if (!auth) {
                    gpii.oauth2.resourceServer.sendUnauthorized(res);
                } else {
                    res.send("PREFERENCES RESPONSE GOES HERE" +
                        " gpiiToken=" + auth.userGpiiToken +
                        " oauth2ClientId=" + auth.oauth2ClientId +
                        " selectedPreferences=" + JSON.stringify(auth.selectedPreferences, null, "    "));
                }
            }
        }
    );
};
