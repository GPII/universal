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

require("../../gpii-oauth2-datastore");
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
        onCreate: {
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

    oauth2orizeServer.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
        var passwordPromise = authorizationService.grantGpiiAppInstallationAuthorization(username, client.id);

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

// An empty grade to guide resolution of IoC expressions onto a suitable gpii.oauth2.dataStore
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
            type: "gpii.oauth2.dataStore" // variants here
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
    return bodyParser.json();
};

gpii.oauth2.urlencodedBodyParser = function () {
    return bodyParser.urlencoded({ extended: true });
};

gpii.oauth2.authServer.contributeRouteHandlers = function (that, oauth2orizeServer, passport) {
    that.expressApp.post("/access_token",
        passport.authenticate("oauth2-client-password", { session: false }),
        oauth2orizeServer.token()
    );
};

/*
 * An utility function to parse a promise object to determine whether to grant or reject an authorization. The grant occurs in the promise resolve callback while
 * the reject occurs in the promise reject callback.
 * @param promise {Promise} The promise object to determine the grant or reject an authorization.
 * @param done {Function} The oauth2orizeServer endpoint function to grant or reject when a client requests authorization.
 * @param paramsPromise {Object} Contains additional parameters to be included in the success response.
 *  See [oauth2orize in github](https://github.com/jaredhanson/oauth2orize) for more information
 * @return The result of invoking done() within the promise callback. At the promise onResolve, done() is called with the resolved value as its parameter,
 * and the resolved value of paramsPromise as the additional parameter.
 * At the promise onReject, done() is called with the error.
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
        var responseError = new oauth2orize.OAuth2Error(error.msg, null, null, error.statusCode);
        done(responseError, false);
    });
};
