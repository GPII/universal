/*!
Copyright 2016 OCAD university

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
    // This function looks up access tokens granted for both authorization code grant
    // and the client credentials grant to find the match. The different data structure
    // can be returned based on the grant type.
    gpii.oauth2.authGrantFinder.getGrantForAccessToken = function (authorizationService, accessToken) {
        var authCodePrmoise = authorizationService.getAuthForAccessToken(accessToken);
        var clientCredentialsPromise = authorizationService.getAuthByClientCredentialsAccessToken(accessToken);

        // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
        var sources = [authCodePrmoise, clientCredentialsPromise];
        var promisesSequence = fluid.promise.sequence(sources);

        var promiseTogo = fluid.promise();

        promisesSequence.then(function (responses) {
            var authCodeResult = responses[0];
            var clientCredentialsResult = responses[1];

            promiseTogo.resolve(authCodeResult ? authCodeResult : clientCredentialsResult);
        });

        return promiseTogo;
    };

})();
