/*!
Copyright 2014-2017 OCAD university

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

    fluid.defaults("gpii.oauth2.authorizationService", {
        gradeNames: ["fluid.component"],
        components: {
            dataStore: {
                type: "gpii.oauth2.dataStore"
            },
            codeGenerator: {
                type: "gpii.oauth2.codeGenerator"
            }
        },
        invokers: {
            grantGpiiAppInstallationAuthorization: {
                funcName: "gpii.oauth2.authorizationService.grantGpiiAppInstallationAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1"]
                    // gpiiToken, clientId
            },
            getAuthorizationByAccessToken: {
                func: "{dataStore}.findAuthorizationByAccessToken"
                    // accessToken
            }
        }
    });

    // APIs for GPII App Installation clients

    /**
     * Grant an authorization for the give GPII app installation. The gpii token will be verified before the access token is returned.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} A client id
     * @return {Promise} A promise object whose resolved value is the access token. An error will be returned if the gpii token is not found.
     */
    gpii.oauth2.authorizationService.grantGpiiAppInstallationAuthorization = function (dataStore, codeGenerator, gpiiToken, clientId) {
        var promiseTogo = fluid.promise();

        if (!gpiiToken || !clientId) {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: "GPII token or client ID"});
            promiseTogo.reject(error);
        } else {
            var gpiiTokenPromise = dataStore.findGpiiToken(gpiiToken);
            var clientPromise = dataStore.findClientById(clientId);

            // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
            var sources = [gpiiTokenPromise, clientPromise];
            var promisesSequence = fluid.promise.sequence(sources);

            promisesSequence.then(function (responses) {
                var gpiiTokenRec = responses[0];
                var clientRec = responses[1];

                var error;

                if (!gpiiTokenRec) {
                    fluid.log("authorizationService, granting GPII app installation authorization: invalid GPII token - ", gpiiToken);
                    error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorized);
                    promiseTogo.reject(error);
                } else if (!clientRec || clientRec.type !== gpii.oauth2.docTypes.gpiiAppInstallationClient) {
                    fluid.log("authorizationService, granting GPII app installation authorization: invalid client or the type of the client with the client id (" + clientId + ") is not \"" + gpii.oauth2.docTypes.gpiiAppInstallationClient + "\"");
                    error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorized);
                    promiseTogo.reject(error);
                } else {
                    // Re-issue a new access token every time. In the case that multiple requests were made for the same "client credential + gpii token"
                    // combination, the access token would be different for each request in the audit log. In the case that one request was detected to
                    // be from an attacker, invoking the associating access token would not affect other access tokens or the real user.
                    gpii.oauth2.authorizationService.createGpiiAppInstallationAuthorization(promiseTogo, dataStore, codeGenerator, gpiiToken, clientId, gpii.oauth2.defaultTokenLifeTimeInSeconds);
                }
            });
        }

        return promiseTogo;
    };

    /**
     * @param promiseTogo {Object} Modified by the function with objects to be resolved or to fail
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param gpiiToken {String} a GPII token
     * @param clientId {String} an unique client id
     * @param expiresIn {String} the lifetime in seconds of the access token
     * @return: none. The first argument of promiseTogo contains returned values
     */
    gpii.oauth2.authorizationService.createGpiiAppInstallationAuthorization = function (promiseTogo, dataStore, codeGenerator, gpiiToken, clientId, expiresIn) {
        var accessToken = codeGenerator.generateAccessToken();

        var addGpiiAppInstallationAuthorizationPromise = dataStore.addAuthorization(gpii.oauth2.docTypes.gpiiAppInstallationAuthorization, {
            clientId: clientId,
            gpiiToken: gpiiToken,
            accessToken: accessToken,
            timestampExpires: gpii.oauth2.getTimestampExpires(new Date(), expiresIn)
        });

        var mapper = function () {
            // The created access token is resolved for promiseTogo eventually
            return {
                accessToken: accessToken,
                expiresIn: expiresIn
            };
        };
        var authorizationPromise = fluid.promise.map(addGpiiAppInstallationAuthorizationPromise, mapper);
        fluid.promise.follow(authorizationPromise, promiseTogo);
    };

})();
