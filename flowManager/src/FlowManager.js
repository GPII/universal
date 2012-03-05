(function () {

    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
        fs = require("fs"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");

    var findArgv = function (key) {
        return fluid.find(process.argv, function (arg) {
            if (arg.indexOf(key + "=") === 0) {
                return arg.substr(key.length + 1);
            }
        });
    };

    fluid.require("../../../../../shared/dataSource.js");

    process.on("uncaughtException", function (err) {
        console.log("Uncaught Exception: " + err);
        process.exit(1);
    });

    process.on("SIGTERM", function () {
        process.exit(0);
    });

    fluid.defaults("gpii.flowManager", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        preInitFunction: "gpii.flowManager.preInit",
        finalInitFunction: "gpii.flowManager.finalInit",
        components: {
            userPreferencesDataSource: {
                type: "gpii.dataSource",
                options: {
                    termMap: {
                        token: "%token"
                    }
                }
            },
            solutionsReporterDataSource: {
                type: "gpii.dataSource"
            },
            matchMakerDataSource: {
                 type: "gpii.dataSource",
                 options: {
                    writable: true
                 }
            },
            launchManagerDataSource: {
                 type: "gpii.dataSource",
                 options: {
                    writable: true
                 }
            }
        },
        events: {
            onUserListener: null,
            onUserPreferences: null,
            onSolutions: null,
            onReadyToMatch: {
                events: {
                   userPreferences: "onUserPreferences",
                   solutions: "onSolutions"
                },
                args: ["{arguments}.userPreferences.0", "{arguments}.solutions.0"]
            },
            onMatch: null
        },
        listeners: {
            onUserListener: [{
                listener: "{gpii.flowManager}.getUserPreferences"
            }, {
                listener: "{gpii.flowManager}.getSolutions"
            }],
            onReadyToMatch: "{gpii.flowManager}.onReadyToMatchHandler",
            onMatch: "{gpii.flowManager}.onMatchHandler"
        }
    });

    gpii.flowManager.preInit = function (that) {
        that.server = express.createServer(
//      In case we want to support https
//        {
//            key: fs.readFileSync('path/to/key.pem'),
//            cert: fs.readFileSync('path/to/cert.pem')
//        }
        );
        that.server.configure(function () {
            that.server.use(express.bodyParser());
        });
        that.server.configure("production", function () {
            // Set production options.
            fluid.staticEnvironment.production = fluid.typeTag("gpii.production");
            that.config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.production.json")));
            fluid.setLogging(false);
        });
        that.server.configure("development", function () {
            // Set development options.
            fluid.staticEnvironment.production = fluid.typeTag("gpii.development");
            that.config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.development.json")));
            fluid.setLogging(true);
        });

        that.getUserPreferences = function (token) {
            that.userPreferencesDataSource.get({
                token: token
            }, function (userPreferences) {
                fluid.log("Fetched user preferences: " + JSON.stringify(userPreferences));
                that.events.onUserPreferences.fire(userPreferences);
            }, function (message, error) {
                fluid.log(message);
            });
        };
        that.getSolutions = function () {
            that.solutionsReporterDataSource.get(undefined, function (solutions) {
                fluid.log("Fetched solutions: " + JSON.stringify(solutions));
                that.events.onSolutions.fire(solutions);
            }, function (message, error) {
                fluid.log(message);
            });
        };
        that.onReadyToMatchHandler = function (userPreferences, solutions) {
            that.matchMakerDataSource.set({
                userPreferences: userPreferences,
                solutions: solutions
            }, undefined, function (match) {
                fluid.log("Matched preferences and sollutions: " + JSON.stringify(match));
                that.events.onMatch.fire(match);
            }, function (message, error) {
                fluid.log(message);
            });
        };
        that.onMatchHandler = function (match) {
            that.launchManagerDataSource.set(match, undefined, function () {
                fluid.log("Successfully sent matched launch spec to the Launch Manager");
            }, function (message, error) {
                fluid.log(message);
            });
        };
    };

    gpii.flowManager.finalInit = function (that) {

        that.server.get("/user/:token", function (req, res) {
            var token = req.params["token"];
            fluid.log("User Listener sent token: " + token);
            that.events.onUserListener.fire(token);
            res.send("User token was successfully accepted.", 200);
        });

        var port = findArgv("port") || 8081;
        fluid.log("Preferences Server is running on port: " + port);
        that.server.listen(typeof port === "string" ? parseInt(port, 10) : port);
    };

    fluid.demands("userPreferencesDataSource", ["gpii.development", "gpii.flowManager"], {
        options: {
            url: "{gpii.flowManager}.config.userPreferences.url"
        }
    });

    fluid.demands("userPreferencesDataSource", ["gpii.production", "gpii.flowManager"], {
        options: {
            host: "{gpii.flowManager}.config.userPreferences.host",
            port: "{gpii.flowManager}.config.userPreferences.port",
            url: "{gpii.flowManager}.config.userPreferences.url"
        }
    });

    fluid.demands("solutionsReporterDataSource", ["gpii.development", "gpii.flowManager"], {
        options: {
            url: "{gpii.flowManager}.config.solutionsReporter.url"
        }
    });

    fluid.demands("solutionsReporterDataSource", ["gpii.production", "gpii.flowManager"], {
        options: {
            host: "{gpii.flowManager}.config.solutionsReporter.host",
            port: "{gpii.flowManager}.config.solutionsReporter.port",
            url: "{gpii.flowManager}.config.solutionsReporter.url"
        }
    });

    fluid.demands("matchMakerDataSource", ["gpii.development", "gpii.flowManager"], {
        options: {
            url: "{gpii.flowManager}.config.matchMaker.url"
        }
    });

    fluid.demands("matchMakerDataSource", ["gpii.production", "gpii.flowManager"], {
        options: {
            host: "{gpii.flowManager}.config.matchMaker.host",
            port: "{gpii.flowManager}.config.matchMaker.port",
            url: "{gpii.flowManager}.config.matchMaker.url"
        }
    });

    fluid.demands("launchManagerDataSource", ["gpii.development", "gpii.flowManager"], {
        options: {
            url: "{gpii.flowManager}.config.launchManager.url"
        }
    });

    fluid.demands("launchManagerDataSource", ["gpii.production", "gpii.flowManager"], {
        options: {
            host: "{gpii.flowManager}.config.launchManager.host",
            port: "{gpii.flowManager}.config.launchManager.port",
            url: "{gpii.flowManager}.config.launchManager.url"
        }
    });

    gpii.flowManager();

})();