(function () {

    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
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
        });
        that.server.configure("development", function () {
            // Set development options.
            fluid.staticEnvironment.production = fluid.typeTag("gpii.development");
        });
    };
    
    gpii.preferencesServer.finalInit = function (that) {
        var port = findArgv("port") || 8080;
        console.log("Preferences Server is running on port: " + port);
        that.server.listen(typeof port === "string" ? parseInt(port, 10) : port);
    };
    
    fluid.demands("gpii.dataSource", ["gpii.development", "userSource"], {
        options: {
            url: "%db/test/data/user/%token.json"
        }
    });
    
    fluid.demands("gpii.dataSource", ["gpii.production", "userSource"], {
        options: {
            host: "0.0.0.0",
            port: 5984,
            url: "%db/user/%token"
        }
    });

    fluid.demands("gpii.source", "gpii.preferencesServer", {
        options: {
            server: "{gpii.preferencesServer}.server"
        }
    });
    
    gpii.preferencesServer();
    
})();