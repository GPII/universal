/*!
Copyright 2014-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var bodyParser = require("body-parser");
var oauth2orize = require("oauth2orize");
var passportModule = require("passport");
var ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;

var fluid = require("infusion");

require("../../gpii-oauth2-utilities");
require("./AuthorizationService");
require("./AuthGrantFinder");
require("./ClientService");
require("./CodeGenerator");

var gpii = fluid.registerNamespace("gpii");

// gpii.oauth2.oauth2orizeServer
// -----------------------------

gpii.oauth2.createOauth2orizeServer = function () {
    return oauth2orize.createServer();
};

fluid.defaults("gpii.oauth2.oauth2orizeServer", {
    gradeNames: ["fluid.component"],
    members: {
        oauth2orizeServer: {
            expander: {
                func: "gpii.oauth2.createOauth2orizeServer"
            }
        }
    },
    listeners: {
        "onCreate.listenOauth2orize": {
            listener: "gpii.oauth2.oauth2orizeServer.listenOauth2orize",
            args: ["{that}.oauth2orizeServer", "{clientService}", "{authorizationService}"]
        }
    }
});

gpii.oauth2.oauth2orizeServer.listenOauth2orize = function (oauth2orizeServer, clientService, authorizationService) {
    oauth2orizeServer.serializeClient(function (client, done) {
        return done(null, client.id);
    });

    oauth2orizeServer.deserializeClient(function (id, done) {
        var clientPromise = clientService.getClientById(id);
        gpii.oauth2.oauth2orizeServer.promiseToDone(clientPromise, done);
    });

    /**
     * Processes OAuth2 resource owner GPII key grant requests.
     * @param {Object} clientInfo - The structure is {
     *     client: {Object},  // all fields from "client" document for this client
     *     clientCredentialId: {String}  // The internal "id" value from "clientCredential" document that associates with
     *                                   // the client credential used in this authorization request.
     * }
     * @param {String} username - The username value in the grant request.
     * @param {String} password - The password value in the grant request.
     * @param {String} scope - The scope value in the grant request.
     * @param {Function} done - The oauth2orizeServer endpoint function to grant or reject when a client requests authorization.
     * @return {Object} The result of gpii.oauth2.oauth2orizeServer.promiseToDone() that contains the response to the grant request.
     */
    oauth2orizeServer.exchange(oauth2orize.exchange.password(function (clientInfo, username, password, scope, body, authInfo, done) {
        var ip = authInfo.req.headers['x-forwarded-for'] || authInfo.req.connection.remoteAddress || authInfo.req.socket.remoteAddress;
        var isIPAllowed = gpii.oauth2.isIPINRange(ip, clientInfo.clientCredential.allowedIPBlocks);

        if (isIPAllowed) {
            var passwordPromise = authorizationService.grantGpiiAppInstallationAuthorization(username, clientInfo.client.id, clientInfo.clientCredential.id);

            var authorizationMapper = function (authorization) {
                return authorization.accessToken;
            };

            var paramsMapper = function (params) {
                // extra parameters to be included in the `oauth2orizeServer` response except `accessToken`
                return fluid.censorKeys(params, "accessToken");
            };

            var authorizationPromise = fluid.promise.map(passwordPromise, authorizationMapper);
            var paramsPromise = fluid.promise.map(passwordPromise, paramsMapper);

            gpii.oauth2.oauth2orizeServer.promiseToDone(authorizationPromise, done, paramsPromise);
        } else {
            fluid.log("authServer, /access_token request handler: IP of the incoming request (" + ip + ") is not within the allowed IP blocks: " + clientInfo.clientCredential.allowedIPBlocks);
            gpii.oauth2.oauth2orizeServer.promiseToDone(fluid.promise().reject(gpii.dbOperation.errors.unauthorized), done);
        }
    }));

};

// gpii.oauth2.passport
// --------------------

gpii.oauth2.createPassport = function () {
    return new passportModule.Passport();
};

fluid.defaults("gpii.oauth2.passport", {
    gradeNames: ["fluid.component"],
    members: {
        passport: {
            expander: {
                func: "gpii.oauth2.createPassport"
            }
        }
    },
    listeners: {
        onCreate: {
            listener: "gpii.oauth2.passport.listenPassport",
            args: ["{that}.passport", "{clientService}"]
        }
    }
});

// TODO what name here?
gpii.oauth2.passport.listenPassport = function (passport, clientService) {
    // ClientPasswordStrategy reads the client_id and client_secret from the
    // request body. Can also use a BasicStrategy for HTTP Basic authentication.
    passport.use(new ClientPasswordStrategy(
        function (oauth2ClientId, oauth2ClientSecret, done) {
            var clientPromise = clientService.authenticateClient(oauth2ClientId, oauth2ClientSecret);
            gpii.oauth2.oauth2orizeServer.promiseToDone(clientPromise, done);
        }
    ));
};

// gpii.oauth2.authServer
// ----------------------

// An empty grade to guide resolution of IoC expressions onto a suitable gpii.dbOperation.dataStore
fluid.defaults("gpii.oauth2.dataStoreHolder", {
    gradeNames: ["fluid.component"]
});

fluid.defaults("gpii.oauth2.authServer", {
    gradeNames: ["fluid.component", "gpii.oauth2.dataStoreHolder"],
    members: {
        expressApp: {
            expander: {
                func: "gpii.oauth2.createExpressApp"
            }
        }
    },
    components: {
        oauth2orizeServer: {
            type: "gpii.oauth2.oauth2orizeServer"
        },
        passport: {
            type: "gpii.oauth2.passport"
        },
        dataStore: {
            type: "gpii.dbOperation.dataStore" // variants here
        },
        authorizationService: {
            type: "gpii.oauth2.authorizationService",
            options: {
                components: {
                    dataStore: "{gpii.oauth2.dataStoreHolder}.dataStore"
                }
            }
        },
        clientService: {
            type: "gpii.oauth2.clientService",
            options: {
                components: {
                    dataStore: "{gpii.oauth2.dataStoreHolder}.dataStore"
                }
            }
        }
    },
    events: {
        onContributeRouteHandlers: null
    },
    listeners: {
        onContributeRouteHandlers: {
            listener: "gpii.oauth2.authServer.contributeRouteHandlers",
            args: ["{that}", "{that}.oauth2orizeServer.oauth2orizeServer",
                "{that}.passport.passport"]
        },
        "onCreate.registerBodyParser": "gpii.oauth2.authServer.registerBodyParser"
    }
});

gpii.oauth2.authServer.registerBodyParser = function (that) {
    that.expressApp.use(gpii.oauth2.jsonBodyParser());
    that.expressApp.use(gpii.oauth2.urlencodedBodyParser());
};

fluid.defaults("gpii.oauth2.authServer.standalone", {
    gradeNames: ["gpii.oauth2.authServer"],
    listeners: {
        "onCreate.onContributeRouteHandlers": {
            priority: "after:registerBodyParser",
            func: "{that}.events.onContributeRouteHandlers.fire"
        }
    }
});

gpii.oauth2.jsonBodyParser = function () {
    return bodyParser.json({
        // Increase the limit of the request body to 50MB instead of the default 100KB.
        // This solves the error "request entity too large" when the responded lifecycle
        // instruction payload is larger than 100KB.
        // See: https://github.com/expressjs/body-parser#limit-1
        // and https://stackoverflow.com/questions/19917401/error-request-entity-too-large
        limit: 52428800
    });
};

gpii.oauth2.urlencodedBodyParser = function () {
    return bodyParser.urlencoded({
        // See the comment above for bodyParser.json() about the necessity to increase the limit.
        limit: 52428800,
        extended: true
    });
};

gpii.oauth2.authServer.contributeRouteHandlers = function (that, oauth2orizeServer, passport) {
    that.expressApp.post("/access_token",
        passport.authenticate("oauth2-client-password", { session: false }),
        // A suggested workaround to get node "request" variable passed into oauth2orize supported exchanges:
        // https://github.com/jaredhanson/oauth2orize/issues/182#issuecomment-253571341
        function(req, res, next) {
            req.authInfo.req = req;
            next();
        },
        oauth2orizeServer.token(),
        oauth2orizeServer.errorHandler()
    );
};

/**
 * An utility function to parse a promise object to determine whether to grant or reject an authorization. The grant occurs in the promise resolve callback while
 * the reject occurs in the promise reject callback.
 * @param {Promise} promise - The promise object to determine the grant or reject an authorization.
 * @param {Function} done - The oauth2orizeServer endpoint function to grant or reject when a client requests authorization.
 * @param {Object} paramsPromise - Contains additional parameters to be included in the success response.
 *  See [oauth2orize in github](https://github.com/jaredhanson/oauth2orize) for more information
 */
gpii.oauth2.oauth2orizeServer.promiseToDone = function (promise, done, paramsPromise) {
    promise.then(function (data) {
        if (paramsPromise) {
            paramsPromise.then(function (params) {
                done(null, data, null, params);
            });
        } else {
            done(null, data);
        }
    }, function (error) {
        var responseError = new oauth2orize.OAuth2Error(error.message, null, null, error.statusCode);
        done(responseError, false);
    });
};
