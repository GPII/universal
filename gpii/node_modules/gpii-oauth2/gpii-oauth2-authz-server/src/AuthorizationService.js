/*!
Copyright 2014 OCAD university

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
            grantAuthorizationCode: {
                funcName: "gpii.oauth2.authorizationService.grantAuthorizationCode",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                // args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
                    // gpiiToken, clientId, redirectUri, selectedPreferences
            },
            addAuthorization: {
                funcName: "gpii.oauth2.authorizationService.addAuthorization",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // gpiiToken, clientId, selectedPreferences
            },
            userHasAuthorized: {
                funcName: "gpii.oauth2.authorizationService.userHasAuthorized",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // gpiiToken, clientId, redirectUri
            },
            exchangeCodeForAccessToken: {
                funcName: "gpii.oauth2.authorizationService.exchangeCodeForAccessToken",
                args: ["{dataStore}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // code, clientId, redirectUri
            },
            getSelectedPreferences: {
                funcName: "gpii.oauth2.authorizationService.getSelectedPreferences",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
                    // userId, authDecisionId
            },
            setSelectedPreferences: {
                funcName: "gpii.oauth2.authorizationService.setSelectedPreferences",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
                    // userId, authDecisionId, selectedPreferences
            },
            getUnauthorizedClientsForGpiiToken: {
                funcName: "gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken",
                args: ["{that}", "{arguments}.0"]
                    // gpiiToken
            },
            getAuthorizedClientsForGpiiToken: {
                func: "{dataStore}.findAuthorizedClientsByGpiiToken",
                args: ["{arguments}.0"]
                    // gpiiToken
            },
            revokeAuthorization: {
                func: "{dataStore}.revokeAuthDecision",
                args: ["{arguments}.0", "{arguments}.1"]
                    // userId, authDecisionId
            },
            getAuthForAccessToken: {
                func: "{dataStore}.findAuthByAccessToken"
                    // accessToken
            },
            getAuthByClientCredentialsAccessToken: {
                func: "{dataStore}.findAuthByClientCredentialsAccessToken"
                    // accessToken
            },
            grantClientCredentialsAccessToken: {
                funcName: "gpii.oauth2.authorizationService.grantClientCredentialsAccessToken",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0", "{arguments}.1"]
                    // clientId, scope
            },
            revokeClientCredentialsToken: {
                func: "{dataStore}.revokeClientCredentialsToken"
                    // clientCredentialsTokenId
            }
        },
        events: {
            // All these events are pseudoevents rather than standard events. They are triggered by fluid.promise.fireTransformEvent().
            onGrantAuthorizationCode: null,
            onAddAuthorization: null,
            onGetSelectedPreferences: null,
            onSetSelectedPreferences: null,
            onGetUnauthorizedClients: null
        },
        listeners: {
            onGrantAuthorizationCode: [{
                listener: "gpii.oauth2.authorizationService.checkAuthDecision",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0"],
                namespace: "checkAuthDecision"
            }, {
                listener: "gpii.oauth2.authorizationService.doGrant",
                args: ["{dataStore}", "{codeGenerator}", "{arguments}.0"],
                namespace: "doGrant",
                priority: "after:checkAuthDecision"
            }],
            onAddAuthorization: [{
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
                listener: "gpii.oauth2.authorizationService.findAuthDecision",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findAuthDecision"
            }, {
                listener: "gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken",
                priority: "after:findAuthDecision"
            }, {
                listener: "gpii.oauth2.authorizationService.doGet",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "doGet",
                priority: "after:findGpiiToken"
            }],
            onSetSelectedPreferences: [{
                listener: "gpii.oauth2.authorizationService.findAuthDecision",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findAuthDecision"
            }, {
                listener: "gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken",
                priority: "after:findAuthDecision"
            }, {
                listener: "gpii.oauth2.authorizationService.doSet",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "doSet",
                priority: "after:findGpiiToken"
            }],
            onGetUnauthorizedClients: [{
                listener: "gpii.oauth2.authorizationService.findGpiiToken",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.findAuthDecisionsByGpiiToken",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findAuthDecisionsByGpiiToken",
                priority: "after:findGpiiToken"
            }, {
                listener: "gpii.oauth2.authorizationService.findUnauthorizedClients",
                args: ["{dataStore}", "{arguments}.0"],
                namespace: "findUnauthorizedClients",
                priority: "after:findAuthDecisionsByGpiiToken"
            }]
        }
    });

    // ==== grantAuthorizationCode()
    gpii.oauth2.authorizationService.grantAuthorizationCode = function (that, gpiiToken, clientId, redirectUri, selectedPreferences) {
        var input = {
            gpiiToken: gpiiToken,
            clientId: clientId,
            redirectUri: redirectUri,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onGrantAuthorizationCode, input);
    };

    /*
     * Shared by getSelectedPreferences() and setSelectedPreferences()
     * @param dataStore {Object} An instance of gpii.oauth2.dbDataStore
     * @param codeGenerator {codeGenerator} An instance of gpii.oauth2.codeGenerator
     * @param input {Object} The Accepted input structure:
     * {
     *     gpiiToken: {String},
     *     clientId: {String},
     *     redirectUri: {String},
     *     selectedPreferences: {Object}
     * }
     * @return {Promise}: a promise object to be passed to the next processing function
     */
    gpii.oauth2.authorizationService.checkAuthDecision = function (dataStore, codeGenerator, input) {
        return gpii.oauth2.authorizationService.getAuthDecision(
            dataStore,
            codeGenerator,
            input.gpiiToken,
            input.clientId,
            input.redirectUri,
            input.selectedPreferences
        );
    };

    // @dataStore (Object): A data store instance
    // @record (Object): Acceps this structure:
    // {
    //     gpiiToken: {Object},   // A GPII token record
    //     inputArgs: {
    //         gpiiToken: (String),
    //         clientId: (String),
    //         redirectUri: (String),
    //         selectedPreferences: (Object)
    //     }
    // }
    // @return (Promise): a promise object with the value of the generated authorization code
    gpii.oauth2.authorizationService.doGrant = function (dataStore, codeGenerator, authDecisionInfo) {
        // Generate the authorization code and record it
        var code = codeGenerator.generateAuthCode();
        var savePromise = dataStore.saveAuthCode(authDecisionInfo.id, code);
        var mapper = function () {
            return code;
        };
        return fluid.promise.map(savePromise, mapper);
    };
    // ==== End of grantAuthorizationCode()

    // ==== addAuthorization()
    gpii.oauth2.authorizationService.addAuthorization = function (that, gpiiToken, oauth2ClientId, selectedPreferences) {
        var input = {
            gpiiToken: gpiiToken,
            oauth2ClientId: oauth2ClientId,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onAddAuthorization, input);
    };

    // Shared by getSelectedPreferences() and setSelectedPreferences()
    // @dataStore (Object): a data store instance
    // @input (Object): Acceps this structure:
    // {
    //     gpiiToken: (String),
    //     oauth2ClientId: (String),
    //     selectedPreferences: (Object)
    // }
    // @return (Promise): a promise object to be passed to the next processing function
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

    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     gpiiToken: {Object},   // A GPII token record
    //     inputArgs: {
    //         gpiiToken: (String),
    //         oauth2ClientId: (String),
    //         selectedPreferences: (Object)
    //     }
    // }
    // @return (Promise): a promise object to be passed to the next processing function
    gpii.oauth2.authorizationService.findClient = function (dataStore, record) {
        var clientPromise = dataStore.findClientByOauth2ClientId(record.inputArgs.oauth2ClientId);
        var mapper = function (client) {
            return fluid.extend({}, record, {client: client});
        };
        return fluid.promise.map(clientPromise, mapper);
    };

    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     gpiiToken: {Object},   // A GPII token record
    //     client: {Object},    // A client record
    //     inputArgs: {
    //         gpiiToken: (String),
    //         oauth2ClientId: (String),
    //         selectedPreferences: (Object)
    //     }
    // }
    // @return (Promise): a promise object. At success, returns the promise object with value in this structure:
    // {
    //     id: (String)
    // }
    // The returned structure may contain more fields if the promise is returned by dataStore.addAuthDecision()
    gpii.oauth2.authorizationService.doAdd = function (dataStore, codeGenerator, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.client) {
            // Check to see if we have an existing authorization
            promiseTogo = gpii.oauth2.authorizationService.getAuthDecision(
                dataStore,
                codeGenerator,
                record.inputArgs.gpiiToken,
                record.client.id,
                record.client.redirectUri,
                record.inputArgs.selectedPreferences
            );
        }
        return promiseTogo;
    };
    // ==== End of addAuthorization()

    gpii.oauth2.authorizationService.userHasAuthorized = function (dataStore, gpiiToken, clientId, redirectUri) {
        var authDecisionPromise = dataStore.findAuthDecision(gpiiToken, clientId, redirectUri);
        var mapper = function (authDecision) {
            return authDecision ? true : false;
        };
        return fluid.promise.map(authDecisionPromise, mapper);
    };

    gpii.oauth2.authorizationService.exchangeCodeForAccessToken = function (dataStore, code, clientId, redirectUri) {
        var promiseTogo = fluid.promise();
        var authPromise = dataStore.findAuthByCode(code);
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

    // ==== getSelectedPreferences()
    gpii.oauth2.authorizationService.getSelectedPreferences = function (that, userId, authDecisionId) {
        var input = {
            userId: userId,
            authDecisionId: authDecisionId
        };
        return fluid.promise.fireTransformEvent(that.events.onGetSelectedPreferences, input);
    };

    // Shared by getSelectedPreferences() and setSelectedPreferences()
    // @dataStore (Object): a data store instance
    // @input (Object): Acceps this structure:
    // {
    //     userId: (String),
    //     authDecisionId: (String),
    //     selectedPreferences: (Object)    // Only provided at setSelectedPreferences()
    // }
    // @return (Promise): a promise object to be passed to the next processing function
    gpii.oauth2.authorizationService.findAuthDecision = function (dataStore, input) {
        var authDecisionPromise = dataStore.findAuthDecisionById(input.authDecisionId);
        var mapper = function (authDecision) {
            return {
                authDecision: authDecision,
                inputArgs: input
            };
        };
        return fluid.promise.map(authDecisionPromise, mapper);
    };

    // Shared by getSelectedPreferences() and setSelectedPreferences()
    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     authDecision: {Object}    // An object of authDecision record returned by the previous processing
    //     inputArgs: {
    //         userId: (String),
    //         authDecisionId: (String),
    //        selectedPreferences: (Object)    // Only provided at setSelectedPreferences()
    //     }
    // }
    // @return (Promise): a promise object to be passed to the next processing function
    gpii.oauth2.authorizationService.findGpiiTokenForSelectedPrefs = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.authDecision) {
            var tokenPromise = dataStore.findGpiiToken(record.authDecision.gpiiToken);
            var mapper = function (gpiiToken) {
                return fluid.extend({}, record, {gpiiToken: gpiiToken});
            };
            promiseTogo = fluid.promise.map(tokenPromise, mapper);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {docName: "user's authorization decision"});
            promiseTogo.reject(error);
        }
        return promiseTogo;
    };

    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     authDecision: {Object}    // An object of authDecision record returned by the previous processing
    //     inputArgs: {
    //         userId: (String),
    //         authDecisionId: (String),
    //        selectedPreferences: (Object)    // Only provided at setSelectedPreferences()
    //     }
    // }
    // @return (Promise): a promise object with value either "undefined" when the record is not found,
    // or an object with user selected preferences
    gpii.oauth2.authorizationService.doGet = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.gpiiToken.userId === record.inputArgs.userId && !record.authDecision.revoked) {
            promiseTogo.resolve(record.authDecision.selectedPreferences);
        } else {
            // Return undefined when valid user-selected preferences are not found
            promiseTogo.resolve(undefined);
        }
        return promiseTogo;
    };
    // ==== End of getSelectedPreferences();

    // ==== setSelectedPreferences()
    gpii.oauth2.authorizationService.setSelectedPreferences = function (that, userId, authDecisionId, selectedPreferences) {
        var input = {
            userId: userId,
            authDecisionId: authDecisionId,
            selectedPreferences: selectedPreferences
        };
        return fluid.promise.fireTransformEvent(that.events.onSetSelectedPreferences, input);
    };

    // @dataStore (Object): a data store instance
    // @record (Object): The same structure as the "record" parameter of gpii.oauth2.authorizationService.doGet()
    // @return (Promise): when success, returns a promise object returned by dataStore.updateAuthDecision(),
    // otherwise, returns a promise object with error message
    // or an object with user selected preferences
    gpii.oauth2.authorizationService.doSet = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken && record.gpiiToken.userId === record.inputArgs.userId) {
            var authDecision = fluid.extend({}, record.authDecision, {selectedPreferences: record.inputArgs.selectedPreferences});
            promiseTogo = dataStore.updateAuthDecision(record.inputArgs.userId, authDecision);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedUser, {userId: record.inpurArgs.userId});
            promiseTogo.reject(error);
        }
        return promiseTogo;
    };
    // ==== End of setSelectedPreferences()

    // ==== getUnauthorizedClientsForGpiiToken()
    gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken = function (that, gpiiToken) {
        var input = {
            gpiiToken: gpiiToken
        };
        return fluid.promise.fireTransformEvent(that.events.onGetUnauthorizedClients, input);
    };

    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     gpiiToken: {},   // An object of gpiiToken record returned by the previous processing
    //     inputArgs: {
    //         gpiiToken: gpiiToken   // The initial gpiiToken argument received at gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken()
    //     }
    // }
    // @return (Promise): a promise object to be passed to the next processing function
    gpii.oauth2.authorizationService.findAuthDecisionsByGpiiToken = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record.gpiiToken === undefined) {
            promiseTogo.resolve(undefined);
        } else {
            var authDecisionsPromise = dataStore.findAuthDecisionsByGpiiToken(record.inputArgs.gpiiToken);
            var mapper = function (authorizations) {
                var authorizedClientIds = {};
                fluid.each(authorizations, function (authorization) {
                    authorizedClientIds[authorization.clientId] = true;
                });
                return fluid.extend({}, record, {authorizedClientIds: authorizedClientIds});
            };
            promiseTogo = fluid.promise.map(authDecisionsPromise, mapper);
        }
        return promiseTogo;
    };

    // @dataStore (Object): a data store instance
    // @record (Object): Acceps this structure:
    // {
    //     gpiiToken: {},   // An object of gpiiToken record returned by the previous processing
    //     authorizedClientIds: {  // An object of all authorized client ids
    //         {clientId}: true/false
    //     },
    //     inputArgs: {
    //         gpiiToken: gpiiToken   // The initial gpiiToken argument received at gpii.oauth2.authorizationService.getUnauthorizedClientsForGpiiToken()
    //     }
    // }
    // @return (Promise): a promise object with value in this structure:
    // [{
    //     clientName: (String),
    //     oauth2ClientId: (String)
    // }]
    gpii.oauth2.authorizationService.findUnauthorizedClients = function (dataStore, record) {
        var promiseTogo = fluid.promise();
        if (record === undefined) {
            promiseTogo.resolve(undefined);
        } else {
            var allClientsPromise = dataStore.findAllClients();
            var mapper = function (allClients) {
                var unauthorizedClients = [];
                fluid.each(allClients, function (client) {
                    if (!record.authorizedClientIds.hasOwnProperty(client.id)) {
                        unauthorizedClients.push({
                            clientName: client.name,
                            oauth2ClientId: client.oauth2ClientId
                        });
                    }
                });
                return unauthorizedClients;
            };
            promiseTogo = fluid.promise.map(allClientsPromise, mapper);
        }
        return promiseTogo;
    };
    // ==== End of getUnauthorizedClientsForGpiiToken()

    /*
     * @promiseTogo: Modified by the function with objects to be resolved or to fail
     * @dataStore (Object): a data store instance
     * @codeGenerator (Object): a code generator
     * @clientId (String): an unique client id
     * @return: none. The first argument of promiseTogo contains return values
     */
    gpii.oauth2.authorizationService.createClientCredentialsToken = function (promiseTogo, dataStore, codeGenerator, clientId) {
        var accessToken = codeGenerator.generateAccessToken();
        var addClientCredentialsTokenPromise = dataStore.addClientCredentialsToken({
            clientId: clientId,
            accessToken: accessToken,
            allowAddPrefs: true
        });

        var mapper = function () {
            // The created access token is resolved for promiseTogo eventually
            return accessToken;
        };
        var accessTokenPromise = fluid.promise.map(addClientCredentialsTokenPromise, mapper);
        fluid.promise.follow(accessTokenPromise, promiseTogo);
    };

    gpii.oauth2.authorizationService.grantClientCredentialsAccessToken = function (dataStore, codeGenerator, clientId, scope) {
        var clientPromise = dataStore.findClientById(clientId);
        var clientCredentialsTokenPromise = dataStore.findClientCredentialsTokenByClientId(clientId);

        // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
        var sources = [clientPromise, clientCredentialsTokenPromise];
        var promisesSequence = fluid.promise.sequence(sources);

        var promiseTogo = fluid.promise();

        promisesSequence.then(function (responses) {
            var client = responses[0];
            var clientCredentialsToken = responses[1];

            if (!scope || scope[0] !== "add_preferences" || !client.allowAddPrefs) {
                var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedClient);
                promiseTogo.reject(error);
            } else if (!clientCredentialsToken) {
                gpii.oauth2.authorizationService.createClientCredentialsToken(promiseTogo, dataStore, codeGenerator, clientId);
            } else {
                // Return the existing token
                promiseTogo.resolve(clientCredentialsToken.accessToken);
            }
        });

        return promiseTogo;
    };

    // An utility function used by checkAuthDecision() and doAdd()
    gpii.oauth2.authorizationService.getAuthDecision = function (dataStore, codeGenerator, gpiiToken, clientId, redirectUri, selectedPreferences) {
        var promiseTogo = fluid.promise();
        var authDecisionPromise = dataStore.findAuthDecision(gpiiToken, clientId, redirectUri);
        authDecisionPromise.then(function (authDecision) {
            if (authDecision) {
                // If the auth decision already exists, return its id
                promiseTogo.resolve({id: authDecision.id});
            } else {
                // If not, add one
                var accessToken = codeGenerator.generateAccessToken();
                var addAuthDecisionPromise = dataStore.addAuthDecision({
                    gpiiToken: gpiiToken,
                    clientId: clientId,
                    redirectUri: redirectUri,
                    accessToken: accessToken,
                    selectedPreferences: selectedPreferences,
                    revoked: false
                });
                fluid.promise.follow(addAuthDecisionPromise, promiseTogo);
            }
        }, function (err) {
            promiseTogo.reject(err);
        });
        return promiseTogo;
    };

})();
