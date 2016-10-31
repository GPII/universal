/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var bodyParser = require("body-parser");
var login = require("connect-ensure-login");
var exphbs  = require("express-handlebars");
var session = require("express-session");
var oauth2orize = require("oauth2orize");
var passportModule = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;

var fluid = require("infusion");

require("../../gpii-oauth2-datastore");
require("../../gpii-oauth2-utilities");
require("./UserService");
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

// Unbound references: {clientService} and {authorizationService}
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

// TODO what name here?
gpii.oauth2.oauth2orizeServer.listenOauth2orize = function (oauth2orizeServer, clientService, authorizationService) {
    oauth2orizeServer.serializeClient(function (client, done) {
        return done(null, client.id);
    });

    oauth2orizeServer.deserializeClient(function (id, done) {
        var clientPromise = clientService.getClientById(id);
        gpii.oauth2.oauth2orizeServer.promiseToDone(clientPromise, done);
    });

    oauth2orizeServer.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
        // TODO: Update the user interface to support multiple tokens
        // per user rather than using a single default
        var gpiiToken = user.defaultGpiiToken;
        var authPromise = authorizationService.grantAuthorizationCode(gpiiToken, client.id, redirectUri, ares.selectedPreferences);

        gpii.oauth2.oauth2orizeServer.promiseToDone(authPromise, done);
    }));

    oauth2orizeServer.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, done) {
        var authPromise = authorizationService.exchangeCodeForAccessToken(code, client.id, redirectUri);
        gpii.oauth2.oauth2orizeServer.promiseToDone(authPromise, done);
    }));

    oauth2orizeServer.exchange(oauth2orize.exchange.clientCredentials(function (client, scope, done) {
        var clientCredentialsPromise = authorizationService.grantClientCredentialsAccessToken(client.id, scope);
        gpii.oauth2.oauth2orizeServer.promiseToDone(clientCredentialsPromise, done);
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
            args: ["{that}.passport", "{userService}", "{clientService}"]
        }
    }
});

// TODO what name here?
gpii.oauth2.passport.listenPassport = function (passport, userService, clientService) {
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        var userPromise = userService.getUserById(id);
        gpii.oauth2.oauth2orizeServer.promiseToDone(userPromise, done);
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            var authenticateUserPromise = userService.authenticateUser(username, password);
            gpii.oauth2.oauth2orizeServer.promiseToDone(authenticateUserPromise, done);
        }
    ));

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
        },
        sessionMiddleware: {
            expander: {
                func: "gpii.oauth2.authServer.createSessionMiddleware"
            }
        },
        passportMiddleware: {
            expander: {
                func: "gpii.oauth2.authServer.createPassportMiddleware",
                args: ["{that}.passport.passport"]
            }
        },
        homePage: "/privacy-settings"
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
        },
        userService: {
            type: "gpii.oauth2.userService",
            options: {
                components: {
                    dataStore: "{gpii.oauth2.dataStoreHolder}.dataStore"
                }
            }
        }
    },
    events: {
        onContributeMiddleware: null,
        onContributeRouteHandlers: null
    },
    listeners: {
        onContributeMiddleware: {
            listener: "gpii.oauth2.authServer.contributeMiddleware",
            args: ["{that}.expressApp"]
        },
        onContributeRouteHandlers: {
            listener: "gpii.oauth2.authServer.contributeRouteHandlers",
            args: ["{that}", "{that}.oauth2orizeServer.oauth2orizeServer",
                "{that}.passport.passport"]
        },
        "onCreate.registerBodyParser": "gpii.oauth2.authServer.registerBodyParser"
    }
});

gpii.oauth2.authServer.createSessionMiddleware = function () {
    // TODO move the secret to configuration
    return session({
        name: "auth_server_connect.sid",
        secret: "some secret",
        resave: false,
        saveUninitialized: false
    });
};

gpii.oauth2.authServer.createPassportMiddleware = function (passport) {
    return [ passport.initialize(), passport.session() ];
};

gpii.oauth2.authServer.registerBodyParser = function (that) {
    that.expressApp.use(gpii.oauth2.jsonBodyParser());
    that.expressApp.use(gpii.oauth2.urlencodedBodyParser());
};

fluid.defaults("gpii.oauth2.authServer.standalone", {
    gradeNames: ["gpii.oauth2.authServer"],
    listeners: {
        "onCreate.onContributeMiddleware": {
            priority: "after:registerBodyParser",
            func: "{that}.events.onContributeMiddleware.fire"
        },
        "onCreate.onContributeRouteHandlers": {
            priority: "after:onContributeMiddleware",
            func: "{that}.events.onContributeRouteHandlers.fire"
        }
    }
});

/*
 * Based on the Custom Callback example from the passportjs guide.
 * http://passportjs.org/guide/authenticate/
 * Licensed under CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
 *
 * Manually performs the login routing, similar to the passport
 * middleware, but with the addition of adding a "loginFailed"
 * flag to the session. This is useful for displaying an error
 * message on the login screen after an unsucessful login attempt.
 *
 * @param {object} passport - an instance of a passport object
 *
 * @param {object} options - Like the passport middleware it takes in
 *                           successReturnToOrRedirect and failureRedirect
 *                           paths.
 */
gpii.oauth2.authServer.loginRouting = function (passport, options) {
    return function (req, res, next) {
        passport.authenticate("local", function (err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.session.loginFailed = true;
                return res.redirect(options.failureRedirect);
            }

            req.logIn(user, function (err) {
                var url = options.successReturnToOrRedirect;
                if (err) {
                    return next(err);
                }
                if (req.session && req.session.returnTo) {
                    url = req.session.returnTo;
                    delete req.session.returnTo;
                }
                return res.redirect(url);
            });
        })(req, res, next);
    };
};

gpii.oauth2.jsonBodyParser = function () {
    return bodyParser.json();
};

gpii.oauth2.urlencodedBodyParser = function () {
    return bodyParser.urlencoded({ extended: true });
};

gpii.oauth2.authServer.contributeMiddleware = function (app) {

    var hbs = exphbs.create({
        layoutsDir: __dirname + "/../views/layouts",
        defaultLayout: "main",
        helpers: {
            // Based on the example from page 79 of:
            // Web Development with Node and Express by Ethan Brown (O'Reilly).
            // Copyright 2014 Ethan Brown, 978-1-491-94930-6
            section: function (name, options) {
                if (!this._sections) {
                    this._sections = {};
                }
                this._sections[name] = options.fn(this);
                return null;
            }
        }

    });

    // TODO Let's not mount at the root as it will be hit for every request
    app.use(gpii.oauth2.expressStatic(__dirname + "/../public"));
    app.use("/infusion", gpii.oauth2.expressStatic(fluid.module.modules.infusion.baseDir));
    app.set("views", __dirname + "/../views");
    app.engine("handlebars", hbs.engine);
    app.set("view engine", "handlebars");
};

gpii.oauth2.authServer.buildAuthorizedServicesPayload = function (authorizationService, user) {
    // TODO: Update the user interface to support multiple tokens per
    // user rather than using a single default
    var gpiiToken = user.defaultGpiiToken;

    var authorizedClientsPromise = authorizationService.getAuthorizedClientsForGpiiToken(gpiiToken);
    var unauthorizedClientsPromise = authorizationService.getUnauthorizedClientsForGpiiToken(gpiiToken);

    // TODO: Update the usage of fluid.promise.sequence() once https://issues.fluidproject.org/browse/FLUID-5938 is resolved.
    var sources = [authorizedClientsPromise, unauthorizedClientsPromise];
    var promisesSequence = fluid.promise.sequence(sources);

    var authorizedServicesPromise = fluid.promise();
    // TODO: Convert to use fluid.promise.map once https://issues.fluidproject.org/browse/FLUID-5968 is resolved
    promisesSequence.then(function (responses) {
        var authorizedClients = responses[0];
        var unauthorizedClients = responses[1];

        var authorizedServices = fluid.transform(authorizedClients, function (client) {
            return {
                authDecisionId: client.authDecisionId,
                oauth2ClientId: client.oauth2ClientId,
                serviceName: client.clientName
            };
        });
        var unauthorizedServices = fluid.transform(unauthorizedClients, function (client) {
            return {
                oauth2ClientId: client.oauth2ClientId,
                serviceName: client.clientName
            };
        });

        authorizedServicesPromise.resolve({
            username: user.name,
            authorizedServices: authorizedServices,
            unauthorizedServices: unauthorizedServices
        });
    });

    return authorizedServicesPromise;
};

gpii.oauth2.authServer.contributeRouteHandlers = function (that, oauth2orizeServer, passport) {

    that.expressApp.get("/login",
        that.sessionMiddleware,
        that.passportMiddleware,
        function (req, res) {
            var loginFailed = req.session.loginFailed || false;
            delete req.session.loginFailed;
            res.render("login", {loginFailed: loginFailed});
        }
    );

    that.expressApp.post("/login",
        that.sessionMiddleware,
        that.passportMiddleware,
        gpii.oauth2.authServer.loginRouting(passport, {successReturnToOrRedirect: that.homePage, failureRedirect: "/login"})
    );

    that.expressApp.post("/logout",
        that.sessionMiddleware,
        that.passportMiddleware,
        function (req, res) {
            req.logout();
            res.redirect(that.homePage);
        }
    );

    that.expressApp.get("/authorize",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        oauth2orizeServer.authorize(function (oauth2ClientId, redirectUri, done) {
            var clientPromise = that.clientService.checkClientRedirectUri(oauth2ClientId, redirectUri);
            clientPromise.then(function (client) {
                done(null, client, redirectUri);
            });
        }),
        function (req, res, next) {
            // TODO: Update the user interface to support multiple
            // tokens per user rather than using a single default
            var gpiiToken = req.user.defaultGpiiToken;

            var clientId = req.oauth2.client.id;
            var redirectUri = req.oauth2.redirectURI;
            var isUserAuthorizedPromise = that.authorizationService.userHasAuthorized(gpiiToken, clientId, redirectUri);
            isUserAuthorizedPromise.then(function (isUserAuthorized) {
                if (isUserAuthorized) {
                    // The user has previously authorized so we can grant a code without asking them
                    req.query.transaction_id = req.oauth2.transactionID;
                    // TODO we can cache the oauth2orizeServer.decision middleware as it doesn't change for each request
                    var middleware = oauth2orizeServer.decision();
                    return gpii.oauth2.walkMiddleware(middleware, 0, req, res, next);
                } else {
                    // otherwise, show the authorize page
                    res.render("authorize", { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
                }
            });
        }
    );

    that.expressApp.post("/authorize_decision",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        oauth2orizeServer.decision(function (req, done) {
            if (req.body.selectedPreferences) {
                // TODO validate selectedPreferences?
                var selectedPreferences = JSON.parse(req.body.selectedPreferences);
                return done(null, { selectedPreferences: selectedPreferences });
            } else {
                var err = new Error("Missing parameter selectedPreferences");
                err.status = 400;
                return done(err);
            }
        })
    );

    that.expressApp["delete"]("/authorizations/:authDecisionId",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var userId = req.user.id;
            // TODO: Validate authDecisionId
            var authDecisionId = req.params.authDecisionId;
            var revokePromise = that.authorizationService.revokeAuthorization(userId, authDecisionId);
            gpii.oauth2.mapPromiseToResponse(revokePromise, res);
        }
    );

    // TODO: Perhaps a better URL would be /authorization/:authDecisionId/selectedPreferences
    that.expressApp.get("/authorizations/:authDecisionId/preferences",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var userId = req.user.id;
            // TODO: Validate authDecisionId
            var authDecisionId = req.params.authDecisionId;
            var selectedPreferencesPromise = that.authorizationService.getSelectedPreferences(userId, authDecisionId);
            selectedPreferencesPromise.then(function (selectedPreferences) {
                if (selectedPreferences) {
                    res.type("application/json");
                    res.send(JSON.stringify(selectedPreferences, null, 4));
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(err.statusCode);
            });
        }
    );

    // TODO CSRF Prevention mechanism
    // TODO https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet
    that.expressApp.put("/authorizations/:authDecisionId/preferences",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var userId = req.user.id;
            // TODO: Validate authDecisionId
            var authDecisionId = req.params.authDecisionId;
            // TODO communicate bad authDecisionId or an id for an authDecision that is not yours?
            if (req.is("application/json")) {
                var selectedPreferences = req.body;
                // TODO validate selectedPreferences?
                var setPromise = that.authorizationService.setSelectedPreferences(userId, authDecisionId, selectedPreferences);
                gpii.oauth2.mapPromiseToResponse(setPromise, res);
            } else {
                res.sendStatus(400);
            }
        }
    );

    // TODO CSRF Prevention mechanism
    // TODO https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet
    that.expressApp.post("/authorizations",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            if (req.is("application/json")) {
                // TODO: Update the user interface to support multiple
                // tokens per user rather than using a single default
                var gpiiToken = req.user.defaultGpiiToken;

                var oauth2ClientId = req.body.oauth2ClientId;
                var selectedPreferences = req.body.selectedPreferences;
                // TODO validate selectedPreferences?
                var addPromise = that.authorizationService.addAuthorization(gpiiToken, oauth2ClientId, selectedPreferences);
                gpii.oauth2.mapPromiseToResponse(addPromise, res);
            } else {
                res.sendStatus(400);
            }
        }
    );

    that.expressApp.post("/access_token",
        passport.authenticate("oauth2-client-password", { session: false }),
        oauth2orizeServer.token()
    );

    // TODO: This API is a workalike of /privacy-settings, only it returns the JSON
    // payload directly rather than baking it into the markup. Currently this is used
    // only in our cloud-based acceptance tests. In future, when /privacy-settings is
    // refactored to use AJAX, this API will be used to retieve the services listed
    // on the Privacy Settings page.
    that.expressApp.get("/authorized-services",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var authorizedServicesPromise = gpii.oauth2.authServer.buildAuthorizedServicesPayload(that.authorizationService, req.user);
            authorizedServicesPromise.then(function (payload) {
                res.json(payload);
            });
        }
    );

    that.expressApp.get("/privacy-settings",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var authorizedServicesPromise = gpii.oauth2.authServer.buildAuthorizedServicesPayload(that.authorizationService, req.user);
            authorizedServicesPromise.then(function (payload) {
                res.render("privacySettings", payload);
            });
        }
    );
};

/*
 * An utility function to parse a promise object to determine whether to grant or reject an authorization. The grant occurs in the promise resolve callback while
 * the reject occurs in the promise reject callback.
 * @param promise {Promise} The promise object to determine the grant or reject an authorization.
 * @param done {Function} The oauth2orizeServer endpoint function to grant or reject when a client requests authorization.
 *  See [oauth2orize in github](https://github.com/jaredhanson/oauth2orize) for more information
 * @return The result of invoking done() within the promise callback. At the promise onResolve, done() is called with the resolved value as its parameter.
 * At the promise onReject, `false` is used as the done() parameter to indicate an error occurs.
 */
gpii.oauth2.oauth2orizeServer.promiseToDone = function (promise, done) {
    promise.then(function (data) {
        return done(null, data);
    }, function () {
        return done(null, false);
    });
};
