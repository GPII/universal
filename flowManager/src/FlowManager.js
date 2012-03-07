(function () {

    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
        fs = require("fs"),
        path = require("path"),
        querystring = require("querystring"),
        gpii = fluid.registerNamespace("gpii");

    var findArgv = function (key) {
        return fluid.find(process.argv, function (arg) {
            if (arg.indexOf(key + "=") === 0) {
                return arg.substr(key.length + 1);
            }
        });
    };

    fluid.require("../../../../../shared/dataSource.js");
    fluid.require("../../../../../matchMaker/src/MatchMaker.js");

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
            preferencesDataSource: {
                type: "gpii.dataSource",
                options: {
                    termMap: {
                        token: "%token"
                    }
                }
            },
            deviceReporterDataSource: {
                type: "gpii.dataSource"
            },
            matchMakerDataSource: {
                type: "gpii.dataSource",
                options: {
                    writable: true
                }
            },
            transformerDataSource: {
                type: "gpii.dataSource",
                options: {
                    termMap: {
                        query: "%query"
                    }
                }
            },
            launchManagerDataSource: {
                type: "gpii.dataSource",
                options: {
                    termMap: {
                        query: "%query"
                    }
                }
            },
            snapshotDataSource: {
                type: "gpii.dataSource",
                options: {
                    writable: true
                }
            }
        },
        events: {
            onUserListener: null,
            onPreferences: null,
            onDevice: null,
            onReadyToMatch: {
                events: {
                   preferences: "onPreferences",
                   device: "onDevice"
                },
                args: ["{arguments}.preferences.0", "{arguments}.device.0"]
            },
            onMatch: null,
            onTransformation: null,
            onSnapshot: null
        },
        listeners: {
            onUserListener: [{
                listener: "{gpii.flowManager}.getPreferences"
            }, {
                listener: "{gpii.flowManager}.getDevice"
            }],
            onReadyToMatch: "{gpii.flowManager}.onReadyToMatchHandler",
            onMatch: "{gpii.flowManager}.onMatchHandler",
            onTransformation: "{gpii.flowManager}.onTransformationHandler",
            onSnapshot: "{gpii.flowManager}.onSnapshotHandler"
        }
    });

    gpii.flowManager.preInit = function (that) {
        that.server = express.createServer();
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

        that.getPreferences = function (token) {
            that.preferencesDataSource.get({
                token: token
            }, function (preferences) {
                if (preferences && preferences.isError) {
                    fluid.log(preferences.message);
                    return;
                }
                fluid.log("Fetched user preferences: ", preferences);
                that.events.onPreferences.fire(preferences);
            });
        };
        that.getDevice = function () {
            that.deviceReporterDataSource.get(undefined, function (device) {
                if (device && device.isError) {
                    fluid.log(device.message);
                    return;
                }
                fluid.log("Fetched device reporter data: ", device);
                that.events.onDevice.fire(device);
            });
        };
        that.onReadyToMatchHandler = function (preferences, device) {
            that.matchMakerDataSource.set(undefined, {
                preferences: preferences,
                device: device
            }, function (match) {
                if (match && match.isError) {
                    fluid.log(match.message);
                    return;
                }
                fluid.log("Matched preferences and device reporter data: ", match);
                that.events.onMatch.fire(match);
            });
        };
        that.onMatchHandler = function (match) {
            that.transformerDataSource.get({
                query: querystring.stringify({
                    data: JSON.stringify(match)
                })
            }, function (transformation) {
                if (transformation && transformation.isError) {
                    fluid.log(transformation.message);
                    return;
                }
                fluid.log("Performed transformation: ", transformation);
                that.events.onTransformation.fire(transformation);
            });
        };
        that.onTransformationHandler = function (transformation) {
            that.launchManagerDataSource.get({
                query: querystring.stringify({
                    data: JSON.stringify(transformation)
                })
            }, function (snapshot) {
                if (snapshot && snapshot.isError) {
                    fluid.log(snapshot.message);
                    return;
                }
                fluid.log("Launch manager returned a snapshot: ", snapshot);
                that.events.onSnapshot.fire(snapshot);
            });
        };
        that.onSnapshotHandler = function (snapshot) {
            that.snapshotDataSource.set(undefined, snapshot, function (data) {
                if (data && data.isError) {
                    fluid.log(data.message);
                    return;
                }
                fluid.log("Successfully saved the snapshot");
            });
        };
    };

    gpii.flowManager.finalInit = function (that) {

        that.server.get("/user/:token/login", function (req, res) {
            var token = req.params["token"];
            fluid.log("User Listener sent token: " + token);
            that.events.onUserListener.fire(token);
            res.send("User token was successfully accepted.", 200);
        });

        var port = findArgv("port") || 8081;
        fluid.log("Flow Manager is running on port: " + port);
        that.server.listen(typeof port === "string" ? parseInt(port, 10) : port);
    };

    fluid.demands("gpii.urlExpander", ["gpii.development", "gpii.flowManager"], {
        options: {
            vars: {
                db: path.join(__dirname, ".."),
                root: path.join(__dirname, "..")
            }
        }
    });

    fluid.demands("preferencesDataSource", "gpii.flowManager", {
        options: {
            url: "{gpii.flowManager}.config.preferences.url"
        }
    });

    fluid.demands("deviceReporterDataSource", "gpii.flowManager", {
        options: {
            url: "{gpii.flowManager}.config.deviceReporter.url"
        }
    });

    fluid.demands("matchMakerDataSource", "gpii.flowManager", {
        funcName: "gpii.matchMaker",
        args: {
            url: "{gpii.flowManager}.config.matchMaker.url"
        }
    });

    fluid.demands("transformerDataSource", "gpii.flowManager", {
        options: {
            url: "{gpii.flowManager}.config.transformer.url"
        }
    });

    fluid.demands("launchManagerDataSource", "gpii.flowManager", {
        options: {
            url: "{gpii.flowManager}.config.launchManager.url"
        }
    });

    fluid.demands("snapshotDataSource", "gpii.flowManager", {
        options: {
            url: "{gpii.flowManager}.config.snapshot.url"
        }
    });

    gpii.flowManager();

})();