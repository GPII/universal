(function () {

    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");

    var findArgv = function (key) {
        return fluid.find(process.argv, function (arg) {
            if (arg.indexOf(key + "=") === 0) {
                return arg.substr(key.length + 1);
            }
        });
    };

    fluid.require("../../../../../shared/source.js");
        
    process.on("uncaughtException", function (err) {
        console.log("Uncaught Exception: " + err);
        process.exit(1);
    });

    process.on("SIGTERM", function () {
        process.exit(0);
    });
    
    fluid.defaults("gpii.preferencesServer", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        preInitFunction: "gpii.preferencesServer.preInit",
        finalInitFunction: "gpii.preferencesServer.finalInit",
        components: {
            userSource: {
                type: "gpii.source",
                options: {
                    writable: true,
                    generator: "token",
                    path: "/user/:token?"
                }
            }
        }
    });
    
    gpii.preferencesServer.preInit = function (that) {
        that.server = express.createServer();
        that.server.configure(function () {
            that.server.use(express.bodyParser());
        });
        that.server.configure("production", function () {
            // Set production options.
            fluid.staticEnvironment.production = fluid.typeTag("gpii.production");
            fluid.setLogging(false);
        });
        that.server.configure("development", function () {
            // Set development options.
            fluid.staticEnvironment.production = fluid.typeTag("gpii.development");
            fluid.setLogging(true);
        });
    };
    
    gpii.preferencesServer.finalInit = function (that) {
        var port = findArgv("port") || 8080;
        fluid.log("Preferences Server is running on port: " + port);
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
    
    fluid.demands("gpii.dataSource", ["gpii.development", "gpii.preferencesServer"], {
        options: {
            url: "%db/test/data/user/%token.json"
        }
    });
    
    fluid.demands("gpii.dataSource", ["gpii.production", "gpii.preferencesServer"], {
        options: {
            url: "0.0.0.0:5984/%db/user/%token"
        }
    });

    fluid.demands("gpii.source", "gpii.preferencesServer", {
        options: {
            server: "{gpii.preferencesServer}.server"
        }
    });
    
    gpii.preferencesServer();
    
})();