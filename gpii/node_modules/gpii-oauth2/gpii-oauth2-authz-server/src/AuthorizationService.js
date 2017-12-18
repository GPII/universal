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
            // APIs for GPII App Installation Clients
            grantGpiiAppInstallationAuthorization: {
                funcName: "gpii.oauth2.authorizationService.grantGpiiAppInstallationAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1"]
                    // gpiiToken, clientId
            },

            // APIs for Web Preferences Consumer Clients
            exchangeCodeForAccessToken: {
                funcName: "gpii.oauth2.authorizationService.exchangeCodeForAccessToken",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // code, clientId, redirectUri
            },
            grantWebPrefsConsumerAuthCode: {
                funcName: "gpii.oauth2.authorizationService.grantWebPrefsConsumerAuthCode",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                // args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                    // gpiiToken, clientId, redirectUri, selectedPreferences
            },
            userHasAuthorizedWebPrefsConsumer: {
                funcName: "gpii.oauth2.authorizationService.userHasAuthorizedWebPrefsConsumer",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // gpiiToken, clientId, redirectUri
            },

            // APIs for both Web Preferences Consumer Clients and Onboarded Solution Clients
            addUserAuthorizedAuthorization: {
                funcName: "gpii.oauth2.authorizationService.addUserAuthorizedAuthorization",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // gpiiToken, clientId, selectedPreferences
            },
            getSelectedPreferences: {
                funcName: "gpii.oauth2.authorizationService.getSelectedPreferences",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
                    // userId, authorizationId
            },
            getUserAuthorizedClientsForGpiiToken: {
                func: "{dataStore}.findUserAuthorizedClientsByGpiiToken",
                args: ["{arguments}.0"]
                    // gpiiToken
            },
            getUserUnauthorizedClientsForGpiiToken: {
                funcName: "gpii.oauth2.authorizationService.getUserUnauthorizedClientsForGpiiToken",
                args: ["{that}", "{arguments}.0"]
                    // gpiiToken
            },
            revokeUserAuthorizedAuthorization: {
                func: "{dataStore}.revokeUserAuthorizedAuthorization",
                args: ["{arguments}.0", "{arguments}.1"]
                    // userId, authorizationId
            },
            setSelectedPreferences: {
                funcName: "gpii.oauth2.authorizationService.setSelectedPreferences",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // userId, authorizationId, selectedPreferences
            },

            // APIs for Privileged Preferences Creator Clients
            grantPrivilegedPrefsCreatorAuthorization: {
                funcName: "gpii.oauth2.authorizationService.grantPrivilegedPrefsCreatorAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1"]
                    // clientId, scope
            },
            revokePrivilegedPrefsCreatorAuthorization: {
                func: "{dataStore}.revokePrivilegedPrefsCreatorAuthorization"
                    // privilegedPrefsCreatorAuthorizationId
            },

            // APIs for GPII App Installation Clients, Web Preferences Consumer Clients and Privileged Preferences Creator Clients
            getAuthorizationByAccessToken: {
                func: "{dataStore}.findAuthorizationByAccessToken"
                    // accessToken
            }
        },
        events: {
            // All these events are pseudoevents rather than standard events. They are triggered by fluid.promise.fireTransformEvent().
            onGrantWebPrefsConsumerAuthCode: null,
            onAddUserAuthorizedAuthorization: null,
            onGetSelectedPreferences: null,
            onSetSelectedPreferences: null,
            onGetUserUnauthorizedClients: null
        },
        listeners: {
            onGrantWebPrefsConsumerAuthCode: [{
                listener: "gpii.oauth2.authorizationService.checkWebPrefsConsumerAuthorization",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0"],
                namespace: "checkWebPrefsConsumerAuthorization"
            }, {
                listener: "gpii.oauth2.authorizationService.doGrant",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0"],
                namespace: "doGrant",
                priority: "after:checkWebPrefsConsumerAuthorization"
            }],
            onAddUserAuthorizedAuthorization: [{
                listener: "gpii.oauth2.authorizationService.findGpiiToken",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.findClient",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findClient",
                priority: "after:findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.doAdd",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0"],
                namespace: "doAdd",
                priority: "after:findClient"
            }],
            onGetSelectedPreferences: [{
                listener: "gpii.oauth2.authorizationService.findAuthorization",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findAuthorization"
            }, {
                listener: "gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken",
                priority: "after:findAuthorization"
            }, {
                listener: "gpii.oauth2.authorizationService.doGet",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "doGet",
                priority: "after:findGpiiToken"
            }],
            onSetSelectedPreferences: [{
                listener: "gpii.oauth2.authorizationService.findAuthorization",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findAuthorization"
            }, {
                listener: "gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken",
                priority: "after:findAuthorization"
            }, {
                listener: "gpii.oauth2.authorizationService.doSet",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "doSet",
                priority: "after:findGpiiToken"
            }],
            onGetUserUnauthorizedClients: [{
                listener: "gpii.oauth2.authorizationService.findGpiiToken",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.findUserAuthorizationsByGpiiToken",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findUserAuthorizationsByGpiiToken",
                priority: "after:findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.findUnauthorizedClients",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findUnauthorizedClients",
                priority: "after:findUserAuthorizationsByGpiiToken"
            }]
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

    // APIs for Web Preferences Consumer Clients

    /**
     * Exchange for the access token. The client will be verified before the access token is returned.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param code {String} The code to be exchanged
     * @param clientId {String} A client ID
     * @param redirectUri {String} A redirect URL
     * @return {Promise} A promise object whose resolved value is the access token. If the client fails at the verification,
     * an unauthorized access token error will be returned.
     */
    gpii.oauth2.authorizationService.exchangeCodeForAccessToken = function (dataStore, code, clientId, redirectUri) {
        var promiseTogo = fluid.promise();
        var authPromise = dataStore.findWebPrefsConsumerAuthorizationByAuthCode(code);
        authPromise.then(function (auth) {
            // TODO flag an authCode after it is found to make single use
            if (auth && auth.clientId === clientId && auth.redirectUri === redirectUri) {
                promiseTogo.resolve(auth.accessToken);
            } else {
                var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedAccessToken);
                promiseTogo.reject(error);
            }
        }, function (err) {
            promiseTogo.reject(err);
        });
        return promiseTogo;
    };

    // ==== grantWebPrefsConsumerAuthCode()
    /**
     * The entry point of grantWebPrefsConsumerAuthCode() API. Fires the transforming promise workflow by triggering onGrantWebPrefsConsumerAuthCode event.
     * @param that {Component} An instance of gpii.oauth2.authorizationService
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} A client id
     * @param redirectUri {String} A redirect URI
     * @param selectedPreferences {Object} A preference set
     */
    gpii.oauth2.authorizationService.grantWebPrefsConsumerAuthCode = function (that, gpiiToken, clientId, redirectUri, selectedPreferences) {
        var input = {
            gpiiToken: gpiiToken,
            clientId: clientId,
            redirectUri: redirectUri,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onGrantWebPrefsConsumerAuthCode, input);
    };

    /**
     * The first step in the fireTransformEvent() chain for implementing grantWebPrefsConsumerAuthCode().
     * This step prepares the authorization associated with the auth code generated by grantWebPrefsConsumerAuthCode(),
     * so that upon the receiving of this auth code in exchange with an authorization access token, the pre-generated
     * authorization can be returned.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param input {Object} The Accepted input structure:
     * {
     *     gpiiToken: {String},
     *     clientId: {String},
     *     redirectUri: {String},
     *     selectedPreferences: {Object}
     * }
     * @return {Promise}: a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.checkWebPrefsConsumerAuthorization = function (dataStore, codeGenerator, input) {
        return gpii.oauth2.authorizationService.getWebPrefsConsumerAuthorization(
            dataStore,
            codeGenerator,
            input.gpiiToken,
            input.clientId,
            input.redirectUri,
            input.selectedPreferences
        );
    };

    /**
     * The last step in the fireTransformEvent() chain for implementing grantWebPrefsConsumerAuthCode()
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param authorizationInfo {Object} Accepted structure:
     * {
     *     gpiiToken: {Object},    // A GPII token record
     *     inputArgs: {
     *         gpiiToken: {String},
     *         clientId: {String},
     *         redirectUri: {String},
     *         selectedPreferences: {Object}
     *     }
     * }
     * @return {Promise} a promise object with the value of the generated authorization code
     */
    gpii.oauth2.authorizationService.doGrant = function (dataStore, codeGenerator, authorizationInfo) {
        // Generate the authorization code and record it
        var code = codeGenerator.generateAuthCode();
        var savePromise = dataStore.saveAuthCode(authorizationInfo.id, code);
        var mapper = function () {
            return code;
        };
        return fluid.promise.map(savePromise, mapper);
    };
    // ==== End of grantWebPrefsConsumerAuthCode()

    /**
     * Verify if the given client has been authorized by the user that holds the given GPII token.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} A client ID
     * @param redirectUri {String} A redirect URL
     * @return {Promise} A promise object whose resolved value is true if the client has been authorized by the user.
     * Otherwise, the resolved value is false.
     */
    gpii.oauth2.authorizationService.userHasAuthorizedWebPrefsConsumer = function (dataStore, gpiiToken, clientId, redirectUri) {
        var authorizationPromise = dataStore.findWebPrefsConsumerAuthorization(gpiiToken, clientId, redirectUri);
        var mapper = function (authorization) {
            return authorization ? true : false;
        };
        return fluid.promise.map(authorizationPromise, mapper);
    };

    // APIs for both Web Preferences Consumer Clients and Onboarded Solution Clients

    // ==== addUserAuthorizedAuthorization()
    /**
     * The entry point of addUserAuthorizedAuthorization() API. Fires the transforming promise workflow by triggering onAddUserAuthorizedAuthorization event.
     * @param that {Component} An instance of gpii.oauth2.authorizationService
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} means "solutionId" for onboarded solution clients and "oauth2ClientId" for web preferences consumer clients
     * @param selectedPreferences {Object} A preference set
     */
    gpii.oauth2.authorizationService.addUserAuthorizedAuthorization = function (that, gpiiToken, clientId, selectedPreferences) {
        var input = {
            gpiiToken: gpiiToken,
            clientId: clientId,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onAddUserAuthorizedAuthorization, input);
    };

    /** Used by addUserAuthorizedAuthorization()
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param input {Object} Accepted structure:
     * {
     *     gpiiToken: {String},
     *     clientId: {String},
     *     selectedPreferences: {Object}
     * }
     * @return {Promise} a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.findGpiiToken = function (dataStore, input) {
        var gpiiTokenPromise = dataStore.findGpiiToken(input.gpiiToken);
        var mapper = function (gpiiToken) {
            return {
                gpiiToken: gpiiToken,
                inputArgs: input
            };
        };
        return fluid.promise.map(gpiiTokenPromise, mapper);
    };

    /**
     * @dataStore {Object} An instance of gpii.oauth2.dbDataStore
     * @record {Object} Accepted structure:
     * {
     *     gpiiToken: {Object},    // A GPII token record
     *     inputArgs: {
     *         gpiiToken: {String},
     *         clientId: {String},
     *         selectedPreferences: {Object}
     *     }
     * }
     * @return {Promise} a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.findClient = function (dataStore, record) {
        var clientId = record.inputArgs.clientId;

        var onboardedSolutionPromise = dataStore.findClientBySolutionId(clientId);
        var webPrefsConsumerPromise = dataStore.findClientByOauth2ClientId(clientId);

        var sources = [onboardedSolutionPromise, webPrefsConsumerPromise];
        var promisesSequence = fluid.promise.sequence(sources);

        var promiseTogo = fluid.promise();

        promisesSequence.then(function (responses) {
            var onboardedSolution = responses[0];
            var webPrefsConsumer = responses[1];

            var result = fluid.extend({}, record, {client: onboardedSolution ? onboardedSolution : webPrefsConsumer});
            promiseTogo.resolve(result);
        });

        return promiseTogo;
    };

    /**
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} Accepted structure:
     * {
     *     gpiiToken: {Object},    // A GPII token record
     *     client: {Object},     // A client record
     *     inputArgs: {
     *         gpiiToken: {String},
     *         clientId: {String},
     *         selectedPreferences: {Object}
     *     }
     * }
     * @return {Promise} a promise object. At success, returns the promise object with the resolved value in a structure of:
     * {
     *     id: {String}
     * }
     * The returned structure may contain more fields if the promise is returned by dataStore.addWebPrefsConsumerAuthorization()
     */
    gpii.oauth2.authorizationService.doAdd = function (dataStore, codeGenerator, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.client) {
            // Check to find if there is an existing authorization. If not, add a new one.
            if (record.client.type === gpii.oauth2.docTypes.webPrefsConsumerClient) {
                promiseTogo = gpii.oauth2.authorizationService.getWebPrefsConsumerAuthorization(
                    dataStore,
                    codeGenerator,
                    record.inputArgs.gpiiToken,
                    record.client.id,
                    record.client.redirectUri,
                    record.inputArgs.selectedPreferences
                );
            } else if (record.client.type === gpii.oauth2.docTypes.onboardedSolutionClient) {
                promiseTogo = gpii.oauth2.authorizationService.getOnboardedSolutionAuthorization(
                    dataStore,
                    record.inputArgs.gpiiToken,
                    record.client.id,
                    record.inputArgs.selectedPreferences
                );
            }
        }
        return promiseTogo;
    };
    // ==== End of addUserAuthorizedAuthorization()

    /**
     * A utility function used by doAdd()
     * This function retrieves and returns an id of an onboarded solution authorization record.
     * If the authorization does not exist, this function will create one and return the created authorization id.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} A client id
     * @param selectedPreferences {Object} A preference set
     * @return {Promise} The resolved promise value is in the structure of:
     * {
     *     id: {String}
     * }
     */
    gpii.oauth2.authorizationService.getOnboardedSolutionAuthorization = function (dataStore, gpiiToken, clientId, selectedPreferences) {
        var promiseTogo = fluid.promise();
        var authorizationPromise = dataStore.findOnboardedSolutionAuthorization(gpiiToken, clientId);
        authorizationPromise.then(function (authorization) {
            if (authorization) {
                // If the authorization already exists, return its id
                promiseTogo.resolve({id: authorization.id});
            } else {
                // If not, add one
                var addOnboardedSolutionAuthorizationPromise = dataStore.addAuthorization(gpii.oauth2.docTypes.onboardedSolutionAuthorization, {
                    gpiiToken: gpiiToken,
                    clientId: clientId,
                    selectedPreferences: selectedPreferences
                });
                fluid.promise.follow(addOnboardedSolutionAuthorizationPromise, promiseTogo);
            }
        }, function (err) {
            promiseTogo.reject(err);
        });
        return promiseTogo;
    };

    /**
     * A common utility function shared by checkWebPrefsConsumerAuthorization() and doAdd()
     * This function retrieves and returns an id of an authorization record that defines the selected preferences
     * that are allowed to be accessed by the client.
     * If the authorization does not exist, this function will create one and return the created authorization id.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param gpiiToken {String} A GPII token
     * @param clientId {String} A client id
     * @param redirectUri {String} A redirect URI
     * @param selectedPreferences {Object} A preference set
     * @return {Promise} The resolved promise value is in the structure of:
     * {
     *     id: {String}
     * }
     */
    gpii.oauth2.authorizationService.getWebPrefsConsumerAuthorization = function (dataStore, codeGenerator, gpiiToken, clientId, redirectUri, selectedPreferences) {
        var promiseTogo = fluid.promise();
        var authorizationPromise = dataStore.findWebPrefsConsumerAuthorization(gpiiToken, clientId, redirectUri);

        authorizationPromise.then(function (authorization) {
            if (authorization) {
                // If the authorization already exists, return its id
                promiseTogo.resolve({id: authorization.id});
            } else {
                // If not, add one
                var accessToken = codeGenerator.generateAccessToken();

                var addWebPrefsConsumerAuthorizationPromise = dataStore.addAuthorization(gpii.oauth2.docTypes.webPrefsConsumerAuthorization, {
                    gpiiToken: gpiiToken,
                    clientId: clientId,
                    redirectUri: redirectUri,
                    accessToken: accessToken,
                    selectedPreferences: selectedPreferences
                });
                fluid.promise.follow(addWebPrefsConsumerAuthorizationPromise, promiseTogo);
            }
        }, function (err) {
            promiseTogo.reject(err);
        });
        return promiseTogo;
    };

    // ==== getSelectedPreferences()
    /**
     * The entry point of getSelectedPreferences() API. Fires the transforming promise workflow by triggering onGetSelectedPreferences event.
     * @param that {Component} An instance of gpii.oauth2.authorizationService
     * @param userId {String} A user id
     * @param authorizationId {String} An authorization id
     */
    gpii.oauth2.authorizationService.getSelectedPreferences = function (that, userId, authorizationId) {
        var input = {
            userId: userId,
            authorizationId: authorizationId
        };
        return fluid.promise.fireTransformEvent(that.events.onGetSelectedPreferences, input);
    };

    /**
     * Shared by getSelectedPreferences() and setSelectedPreferences()
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param input {Object} Accepted structure:
     * {
     *     userId: {String},
     *     authorizationId: {String},
     *     selectedPreferences: {Object}     // Only provided at setSelectedPreferences()
     * }
     * @return {Promise} a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.findAuthorization = function (dataStore, input) {
        var authorizationPromise = dataStore.findUserAuthorizedAuthorizationById(input.authorizationId);
        var mapper = function (authorization) {
            return {
                authorization: authorization,
                inputArgs: input
            };
        };
        return fluid.promise.map(authorizationPromise, mapper);
    };

    /**
     * Shared by getSelectedPreferences() and setSelectedPreferences()
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} Accepted structure:
     * {
     *     authorization: {Object}     // An object of authorization record returned by the previous processing
     *     inputArgs: {
     *         userId: {String},
     *         authorizationId: {String},
     *        selectedPreferences: {Object}     // Only provided at setSelectedPreferences()
     *     }
     * }
     * @return {Promise} a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.authorization) {
            var tokenPromise = dataStore.findGpiiToken(record.authorization.gpiiToken);
            var mapper = function (gpiiToken) {
                return fluid.extend({}, record, {gpiiToken: gpiiToken});
            };
            promiseTogo = fluid.promise.map(tokenPromise, mapper);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: "user's authorization"});
            promiseTogo.reject(error);
        }
        return promiseTogo;
    };

    /**
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} Accepted structure:
     * {
     *     authorization: {Object}     // An object of authorization record returned by the previous processing
     *     inputArgs: {
     *         userId: {String},
     *         authorizationId: {String},
     *        selectedPreferences: {Object}     // Only provided at setSelectedPreferences()
     *     }
     * }
     * @return {Promise} a promise object with value either "undefined" when the record is not found,
     * or an object with user selected preferences
     */
    gpii.oauth2.authorizationService.doGet = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.gpiiToken.userId === record.inputArgs.userId && !record.authorization.revoked) {
            promiseTogo.resolve(record.authorization.selectedPreferences);
        } else {
            // Return undefined when valid user-selected preferences are not found
            promiseTogo.resolve(undefined);
        }
        return promiseTogo;
    };
    // ==== End of getSelectedPreferences();

    // ==== setSelectedPreferences()
    /**
     * The entry point of setSelectedPreferences() API. Fires the transforming promise workflow by triggering onSetSelectedPreferences event.
     * @param that {Component} An instance of gpii.oauth2.authorizationService
     * @param userId {String} A user id
     * @param authorizationId {String} An authorization id
     * @param selectedPreferences {Object} A preference set
     */
    gpii.oauth2.authorizationService.setSelectedPreferences = function (that, userId, authorizationId, selectedPreferences) {
        var input = {
            userId: userId,
            authorizationId: authorizationId,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onSetSelectedPreferences, input);
    };

    /**
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} The same structure as the "record" parameter of gpii.oauth2.authorizationService.doGet()
     * @return {Promise} when success, returns a promise object returned by dataStore.updateUserAuthorizedAuthorization(),
     * otherwise, returns a promise object with error message
     * or an object with user selected preferences
     */
    gpii.oauth2.authorizationService.doSet = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.gpiiToken.userId === record.inputArgs.userId) {
            var authorization = fluid.extend({}, record.authorization, {selectedPreferences: record.inputArgs.selectedPreferences});
            promiseTogo = dataStore.updateUserAuthorizedAuthorization(record.inputArgs.userId, authorization);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedUser, {userId: record.inpurArgs.userId});
            promiseTogo.reject(error);
        }
        return promiseTogo;
    };
    // ==== End of setSelectedPreferences()

    // ==== getUserUnauthorizedClientsForGpiiToken()
    /**
     * The entry point of getUserUnauthorizedClientsForGpiiToken() API. Fires the transforming promise workflow by triggering onGetUserUnauthorizedClients event.
     * @param that {Component} An instance of gpii.oauth2.authorizationService
     * @param gpiiToken {String} A GPII token
     */
    gpii.oauth2.authorizationService.getUserUnauthorizedClientsForGpiiToken = function (that, gpiiToken) {
        var input = {
            gpiiToken: gpiiToken
        };
        return fluid.promise.fireTransformEvent(that.events.onGetUserUnauthorizedClients, input);
    };

    /**
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} Accepted structure:
     * {
     *     gpiiToken: {},    * An object of gpiiToken record returned by the previous processing
     *     inputArgs: {
     *         gpiiToken: gpiiToken    * The initial gpiiToken argument received at gpii.oauth2.authorizationService.getUserUnauthorizedClientsForGpiiToken()
     *     }
     * }
     * @return {Promise} a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.findUserAuthorizationsByGpiiToken = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken === undefined) {
            promiseTogo.resolve(undefined);
        } else {
            var authorizationsPromise = dataStore.findUserAuthorizationsByGpiiToken(record.inputArgs.gpiiToken);
            var mapper = function (authorizations) {
                var authorizedClientIds = {};
                fluid.each(authorizations, function (authorization) {
                    authorizedClientIds[authorization.clientId] = true;
                });
                return fluid.extend({}, record, {authorizedClientIds: authorizedClientIds});
            };
            promiseTogo = fluid.promise.map(authorizationsPromise, mapper);
        }
        return promiseTogo;
    };

    /**
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param record {Object} Accepted structure:
     * {
     *     gpiiToken: {},    // An object of gpiiToken record returned by the previous processing
     *     authorizedClientIds: {   // An object of all authorized client ids
     *         {clientId}: true/false
     *     },
     *     inputArgs: {
     *         gpiiToken: gpiiToken    // The initial gpiiToken argument received at gpii.oauth2.authorizationService.getUserUnauthorizedClientsForGpiiToken()
     *     }
     * }
     * @return {Promise} a promise object with a value in this structure:
     * {
     *     "webPrefsConsumerClient": [{
     *         clientName: {String},
     *         oauth2ClientId: {String}
     *     },
     *     ...],
     *     "onboardedSolutionClient": [{
     *         clientName: {String},
     *         solutionId: {String}
     *     },
     *     ...]
     * }
     */
    gpii.oauth2.authorizationService.findUnauthorizedClients = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record === undefined) {
            promiseTogo.resolve(undefined);
        } else {
            var allClientsPromise = dataStore.findUserAuthorizableClients();
            var mapper = function (allClients) {
                var unauthorizedClients = {};

                fluid.each(allClients, function (client) {
                    if (!record.authorizedClientIds.hasOwnProperty(client.id)) {
                        var unauthorizedClientInfo;

                        if (client.type === gpii.oauth2.docTypes.onboardedSolutionClient) {
                            unauthorizedClientInfo = {
                                clientName: client.name,
                                solutionId: client.solutionId
                            };
                        } else if (client.type === gpii.oauth2.docTypes.webPrefsConsumerClient) {
                            unauthorizedClientInfo = {
                                clientName: client.name,
                                oauth2ClientId: client.oauth2ClientId
                            };
                        }
                        if (!unauthorizedClients[client.type]) {
                            fluid.set(unauthorizedClients, client.type, []);
                        }
                        unauthorizedClients[client.type].push(unauthorizedClientInfo);
                    }
                });

                return unauthorizedClients;
            };
            promiseTogo = fluid.promise.map(allClientsPromise, mapper);
        }
        return promiseTogo;
    };
    // ==== End of getUserUnauthorizedClientsForGpiiToken()

    // APIs for Privileged Preferences Creator Clients

    /**
     * @param promiseTogo {Object} Modified by the function with objects to be resolved or to fail
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param clientId {String} an unique client id
     * @return: none. The first argument of promiseTogo contains returned values
     */
    gpii.oauth2.authorizationService.createPrivilegedPrefsCreatorAuthorization = function (promiseTogo, dataStore, codeGenerator, clientId) {
        var accessToken = codeGenerator.generateAccessToken();
        var addPrivilegedPrefsCreatorAuthorizationPromise = dataStore.addAuthorization(gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization, {
            clientId: clientId,
            accessToken: accessToken
        });

        var mapper = function () {
            // The created access token is resolved for promiseTogo eventually
            return accessToken;
        };
        var accessTokenPromise = fluid.promise.map(addPrivilegedPrefsCreatorAuthorizationPromise, mapper);
        fluid.promise.follow(accessTokenPromise, promiseTogo);
    };

    /**
     * Grant a privileged prefs creator access token. The client and the scope will be verified before the access token is returned.
     * @param dataStore {Component} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {Component} An instance of gpii.oauth2.codeGenerator
     * @param clientId {String} An instance of gpii.oauth2.codeGenerator
     * @param scope {Array} Must have the value ["add_preferences"]
     * @return {Promise} A promise object whose resolved value is the access token. An error will be returned if:
     * 1. the client is not allowed to add preference sets
     * 2. the scope doesn't match a value of ["add_preferences"]
     * 3. the privileged prefs creator is not found
     */
    gpii.oauth2.authorizationService.grantPrivilegedPrefsCreatorAuthorization = function (dataStore, codeGenerator, clientId, scope) {
        var clientPromise = dataStore.findClientById(clientId);
        var privilegedPrefsCreatorAuthorizationPromise = dataStore.findPrivilegedPrefsCreatorAuthorizationByClientId(clientId);

        // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
        var sources = [clientPromise, privilegedPrefsCreatorAuthorizationPromise];
        var promisesSequence = fluid.promise.sequence(sources);

        var promiseTogo = fluid.promise();

        promisesSequence.then(function (responses) {
            var client = responses[0];
            var privilegedPrefsCreatorAuthorization = responses[1];

            if (!scope || scope[0] !== "add_preferences" || !client || client.type !== gpii.oauth2.docTypes.privilegedPrefsCreatorClient) {
                fluid.log("authorizationService, granting privileged prefs creator access token: invalid client ID - ", clientId);
                var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorized);
                promiseTogo.reject(error);
            } else if (!privilegedPrefsCreatorAuthorization) {
                gpii.oauth2.authorizationService.createPrivilegedPrefsCreatorAuthorization(promiseTogo, dataStore, codeGenerator, clientId);
            } else {
                // Return the existing token
                promiseTogo.resolve(privilegedPrefsCreatorAuthorization.accessToken);
            }
        });

        return promiseTogo;
    };

})();
