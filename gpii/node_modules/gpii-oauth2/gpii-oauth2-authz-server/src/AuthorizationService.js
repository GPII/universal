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
                type: "gpii.dbOperation.dataStore"
            },
            codeGenerator: {
                type: "gpii.oauth2.codeGenerator"
            }
        },
        invokers: {
            grantGpiiAppInstallationAuthorization: {
                funcName: "gpii.oauth2.authorizationService.grantGpiiAppInstallationAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                                                         // gpiiKey, clientId, clientCredentialId
            },
            getAuthorizationByAccessToken: {
                func: "{dataStore}.findAuthorizationByAccessToken"
                    // accessToken
            }
        }
    });

    // APIs for GPII App Installation clients

    /**
     * Grant an authorization for the give GPII app installation. The gpii key will be verified before the access token is returned.
     * @param {Component} dataStore - An instance of gpii.dbOperation.dbDataStore.
     * @param {Component} codeGenerator - An instance of gpii.oauth2.codeGenerator.
     * @param {String} gpiiKey - A GPII key.
     * @param {String} clientId - A client id.
     * @param {String} clientCredentialId - A client credential id.
     * @return {Promise} A promise object whose resolved value is the access token. An error will be returned if the GPII key is not found.
     */
    gpii.oauth2.authorizationService.grantGpiiAppInstallationAuthorization = function (dataStore, codeGenerator, gpiiKey, clientId, clientCredentialId) {
        var promiseTogo = fluid.promise();

        if (!gpiiKey || !clientId || !clientCredentialId) {
            var error = gpii.dbOperation.composeError(gpii.dbOperation.errors.missingInput, {fieldName: "GPII key, client ID or client credential ID"});
            promiseTogo.reject(error);
        } else {
            var gpiiKeyPromise = dataStore.findGpiiKey(gpiiKey);
            var clientPromise = dataStore.findClientById(clientId);
            var clientCredentialPromise = dataStore.findClientCredentialById(clientCredentialId);

            // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
            var sources = [gpiiKeyPromise, clientPromise, clientCredentialPromise];
            var promisesSequence = fluid.promise.sequence(sources);

            promisesSequence.then(function (responses) {
                var gpiiKeyRec = responses[0];
                var clientRec = responses[1];
                var clientCredentialRec = responses[2];

                var error;

                if (!gpiiKeyRec) {
                    fluid.log("authorizationService, granting GPII app installation authorization: invalid GPII key - ", gpiiKey);
                    error = gpii.dbOperation.composeError(gpii.dbOperation.errors.unauthorized);
                    promiseTogo.reject(error);
                } else if (!clientRec || clientRec.type !== gpii.dbOperation.docTypes.gpiiAppInstallationClient) {
                    fluid.log("authorizationService, granting GPII app installation authorization: invalid client or the type of the client with the client id (" + clientId + ") is not \"" + gpii.dbOperation.docTypes.gpiiAppInstallationClient + "\"");
                    error = gpii.dbOperation.composeError(gpii.dbOperation.errors.unauthorized);
                    promiseTogo.reject(error);
                } else if (!clientCredentialRec || clientCredentialRec.type !== gpii.dbOperation.docTypes.clientCredential) {
                    fluid.log("authorizationService, granting GPII app installation authorization: invalid client credential or the type of the client credential with id (" + clientCredentialId + ") is not \"" + gpii.dbOperation.docTypes.clientCredential + "\"");
                    error = gpii.dbOperation.composeError(gpii.dbOperation.errors.unauthorized);
                    promiseTogo.reject(error);
                } else if (clientCredentialRec.clientId !== clientId) {
                    fluid.log("authorizationService, granting GPII app installation authorization: the client id (" + clientCredentialRec.clientId + ") that the client credential belongs to does not match the client id (" + clientId + ") that requests the authorization");
                    error = gpii.dbOperation.composeError(gpii.dbOperation.errors.unauthorized);
                    promiseTogo.reject(error);
                } else {
                    // Re-issue a new access token every time. In the case that multiple requests were made for the same "client credential + GPII key"
                    // combination, the access token would be different for each request in the audit log. In the case that one request was detected to
                    // be from an attacker, invoking the associating access token would not affect other access tokens or the real user.
                    gpii.oauth2.authorizationService.createGpiiAppInstallationAuthorization(promiseTogo, dataStore, codeGenerator, gpiiKey, clientId, clientCredentialId, gpii.oauth2.defaultTokenLifeTimeInSeconds);
                }
            });
        }

        return promiseTogo;
    };

    /**
     * @param {Promise} promiseTogo - Modified by the function with objects to be resolved or to fail.
     * @param {Component} dataStore - An instance of gpii.dbOperation.dbDataStore.
     * @param {Component} codeGenerator - An instance of gpii.oauth2.codeGenerator.
     * @param {String} gpiiKey - A GPII key.
     * @param {String} clientId - An unique client id.
     * @param {String} clientCredentialId - An unique client credential id.
     * @param {String} expiresIn - The lifetime in seconds of the access token.
     *
     * If promiseTogo is fired, the first argument will be the returned values.
     */
    gpii.oauth2.authorizationService.createGpiiAppInstallationAuthorization = function (promiseTogo, dataStore, codeGenerator, gpiiKey, clientId, clientCredentialId, expiresIn) {
        var accessToken = codeGenerator.generateAccessToken();

        var addGpiiAppInstallationAuthorizationPromise = dataStore.addAuthorization({
            clientId: clientId,
            gpiiKey: gpiiKey,
            clientCredentialId: clientCredentialId,
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
