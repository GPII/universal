/*!
Copyright 2016-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.oauth2.authGrantFinder", {
        gradeNames: ["fluid.component"],
        components: {
            authorizationService: {
                type: "gpii.oauth2.authorizationService"
            }
        },
        invokers: {
            getGrantForAccessToken: {
                funcName: "gpii.oauth2.authGrantFinder.getGrantForAccessToken",
                args: ["{that}.authorizationService", "{arguments}.0"]
                    // accessToken
            }
        }
    });

    // Return a promise object that contains the granted privilege for the access token.
    // This function looks up access tokens granted for GPII app installations to find the match.
    gpii.oauth2.authGrantFinder.getGrantForAccessToken = function (authorizationService, accessToken) {
        var promiseTogo = fluid.promise();
        var authorizationPromise = authorizationService.getAuthorizationByAccessToken(accessToken);
        var grant;

        authorizationPromise.then(function (authRecord) {
            if (authRecord) {
                if (authRecord.authorization.type === gpii.oauth2.docTypes.gpiiAppInstallationAuthorization &&
                    gpii.oauth2.getExpiresIn(new Date(), authRecord.authorization.timestampExpires) > 0) {
                    grant = {
                        accessToken: accessToken,
                        gpiiToken: authRecord.authorization.gpiiToken,
                        allowUntrustedSettingsGet: true,
                        allowUntrustedSettingsPut: true
                    };
                }
            }
            promiseTogo.resolve(grant);
        });

        return promiseTogo;
    };
})();
