"use strict";

var express = require("express");
var exphbs  = require("express-handlebars");
var http = require("http");
var morgan = require("morgan");
var querystring = require("querystring");
var url = require("url");
var util = require("util");
var config = require("../oauth2SamplesConfig");

var clientId = "org.chrome.cloud4chrome";
var clientSecret = "client_secret_1";

var requestedScope = "scope_1";
var state = "RANDOM-STRING";

var authorizeCallbackUri = util.format("http://localhost:%d/authorize_callback", config.clientPort);

function buildAuthorizeUrl(redirectUri) {
    // TODO generate the state parameter
    return url.format({
        protocol: "http",
        hostname: config.authorizationServerHostname,
        port: config.authorizationServerPort,
        pathname: "/authorize",
        query: {
            response_type: "code",
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: requestedScope,
            state: state
        }
    });
}

function getAccessToken(code, redirectUri, callback) {
    var options = {
        hostname: config.authorizationServerHostname,
        port: config.authorizationServerPort,
        path: "/access_token",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    var postData = querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
    });

    var req = http.request(options, function (res) {
        res.setEncoding("utf8");
        var body = "";
        res.on("data", function (chunk) {
            body += chunk;
        });
        res.on("end", function () {
            console.log("Got " + options.path + " response: " + body);
            callback(JSON.parse(body));
        });
    });

    console.log("Sending " + options.path);
    req.write(postData);
    req.end();
}

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

var app = express();
app.use(morgan(":method :url", { immediate: true }));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/getprefs", function (req, res) {
    var redirectUrl = buildAuthorizeUrl(authorizeCallbackUri);
    console.log("Redirecting to " + redirectUrl);
    res.redirect(redirectUrl);
});

app.get("/authorize_callback", function (req, res) {
    // TODO verify the state parameter
    getAccessToken(req.param("code"), authorizeCallbackUri, function (accessTokenData) {
        getPreferences(accessTokenData.access_token, function (responseData) {
            res.render("preferences", {
                accessToken: accessTokenData.access_token,
                grantedScope: accessTokenData.scope,
                tokenType: accessTokenData.token_type,
                responseData: responseData
            });
        });
    });
});

app.listen(config.clientPort);
