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
require("./ClientService");

var gpii = fluid.registerNamespace("gpii");

// gpii.oauth2.oauth2orizeServer
// -----------------------------

gpii.oauth2.createOauth2orizeServer = function () {
    return oauth2orize.createServer();
};

// Unbound references: {clientService} and {authorizationService}
fluid.defaults("gpii.oauth2.oauth2orizeServer", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
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
        return done(null, clientService.getClientById(id));
    });

    oauth2orizeServer.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
        return done(null, authorizationService.grantAuthorizationCode(user.id, client.id, redirectUri, ares.selectedPreferences));
    }));

    oauth2orizeServer.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, done) {
        return done(null, authorizationService.exchangeCodeForAccessToken(code, client.id, redirectUri));
    }));
};

// gpii.oauth2.passport
// --------------------

gpii.oauth2.createPassport = function () {
    return new passportModule.Passport();
};

fluid.defaults("gpii.oauth2.passport", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
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

    passport.deserializeUser(function(id, done) {
        return done(null, userService.getUserById(id));
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            return done(null, userService.authenticateUser(username, password));
        }
    ));

    // ClientPasswordStrategy reads the client_id and client_secret from the
    // request body. Can also use a BasicStrategy for HTTP Basic authentication.
    passport.use(new ClientPasswordStrategy(
        function (oauth2ClientId, oauth2ClientSecret, done) {
            return done(null, clientService.authenticateClient(oauth2ClientId, oauth2ClientSecret));
        }
    ));
};

// gpii.oauth2.authServer
// ----------------------

// An empty grade to guide resolution of IoC expressions onto a suitable gpii.oauth2.dataStore
fluid.defaults("gpii.oauth2.dataStoreHolder", {
    gradeNames: ["fluid.eventedComponent", "autoInit"]
});

fluid.defaults("gpii.oauth2.authServer", {
    gradeNames: ["fluid.eventedComponent", "gpii.oauth2.dataStoreHolder", "autoInit"],
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
        homePage: "/privacy"
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
        }
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
    that.expressApp.use(gpii.oauth2.bodyParser());
};

fluid.defaults("gpii.oauth2.authServer.standalone", {
    gradeNames: ["gpii.oauth2.authServer", "autoInit"],
    listeners: {
        onCreate: [
            "gpii.oauth2.authServer.registerBodyParser",
            "{that}.events.onContributeMiddleware.fire",
            "{that}.events.onContributeRouteHandlers.fire"
        ]
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
        passport.authenticate("local", function(err, user) {
            if (err) {
                return next(err);
            }

            if (!user) {
                req.session.loginFailed = true;
                return res.redirect(options.failureRedirect);
            }

            req.logIn(user, function(err) {
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

gpii.oauth2.bodyParser = function () {
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
                if(!this._sections) {
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

gpii.oauth2.authServer.contributeRouteHandlers = function (that, oauth2orizeServer, passport) {

    that.expressApp.get("/login",
        that.sessionMiddleware,
        that.passportMiddleware,
        function(req, res) {
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
            done(null, that.clientService.checkClientRedirectUri(oauth2ClientId, redirectUri), redirectUri);
        }),
        function (req, res, next) {
            var userId = req.user.id;
            var clientId = req.oauth2.client.id;
            var redirectUri = req.oauth2.redirectURI;
            if (that.authorizationService.userHasAuthorized(userId, clientId, redirectUri)) {
                // The user has previously authorized so we can grant a code without asking them
                req.query.transaction_id = req.oauth2.transactionID;
                // TODO we can cache the oauth2orizeServer.decision middleware as it doesn't change for each request
                var middleware = oauth2orizeServer.decision();
                return gpii.oauth2.walkMiddleware(middleware, 0, req, res, next);
            } else {
                // otherwise, show the authorize page
                res.render("authorize", { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
            }
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

    that.expressApp.get("/privacy",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var authorizedClients = that.authorizationService.getAuthorizedClientsForUser(req.user.id);
            // Build view objects
            var services = [];
            authorizedClients.forEach(function (client) {
                services.push({
                    authDecisionId: client.authDecisionId,
                    oauth2ClientId: client.oauth2ClientId,
                    serviceName: client.clientName
                });
            });
            res.render("privacy", { user: req.user, authorizedServices: services });
        }
    );

    that.expressApp.post("/remove_authorization",
        that.sessionMiddleware,
        that.passportMiddleware,
        login.ensureLoggedIn("/login"),
        function (req, res) {
            var userId = req.user.id;
            var authDecisionId = parseInt(req.body.remove, 10);
            that.authorizationService.revokeAuthorization(userId, authDecisionId);
            res.redirect("/privacy");
        }
    );

    that.expressApp.post("/access_token",
        passport.authenticate("oauth2-client-password", { session: false }),
        oauth2orizeServer.token()
    );
};
