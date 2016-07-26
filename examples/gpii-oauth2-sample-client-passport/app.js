/*!
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var express = require("express");
var exphbs  = require("express-handlebars");
var http = require("http");
var morgan = require("morgan");
var session = require("express-session");
var util = require("util");
var config = require("../oauth2SamplesConfig");
var passport = require("passport");
var OAuth2Strategy = require("passport-oauth").OAuth2Strategy;

var clientId = "client_id_pp";
var clientSecret = "client_secret_pp";

var requestedScope = "scope_1";

var authorizeUri = util.format("http://%s:%d/authorize", config.authorizationServerHostname, config.authorizationServerPort);
var authorizeCallbackUri = util.format("http://localhost:%d/authorize_callback", config.passportClientPort);
var authorizeTokenUri = util.format("http://%s:%d/access_token", config.authorizationServerHostname, config.authorizationServerPort);

function getPreferences(accessToken, callback) {
    var options = {
        hostname: config.resourceServerHostname,
        port: config.resourceServerPort,
        path: "/settings",
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    };

    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log("Got " + options.path + " response: " + body);
            callback(body);
        });
    });

    console.log("Sending " + options.path + " with access token: " + accessToken);
    req.end();
}

passport.use("gpii", new OAuth2Strategy(
    {
        authorizationURL: authorizeUri,
        tokenURL: authorizeTokenUri,
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: authorizeCallbackUri
    },
    function (accessToken, refreshToken, profile, done) {
        done(null, { accessToken: accessToken });
    }
));

passport.serializeUser(function (user, done) {
    return done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

var app = express();
app.use(morgan(":method :url", { immediate: true }));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
// TODO move the secret to configuration
app.use(session({
    name: "client_pp_connect.sid",
    secret: "some secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/getprefs", passport.authenticate("gpii", {scope: requestedScope}));

app.get("/authorize_callback",
    passport.authenticate("gpii", {failureRedirect: "/"}),
    function (req, res) {
        getPreferences(req.user.accessToken, function (responseData) {
            res.render("preferences", {
                responseData: responseData
            });
        });
    }
);

app.listen(config.passportClientPort);
