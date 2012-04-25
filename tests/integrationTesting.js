/*!

Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

(function () {
    // This loads universal.
    var fluid = require("../gpii/index.js"),
        http = require("http"),
        fs = require("fs"),
        os = require("os"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    fluid.require("./gpiiTests.js", require);

    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");
    gpii.integrationTesting.mockLaunchHandler = function(data) {
        jqUnit.assert("gpii.integrationTesting.mockLaunchHandler called");
        return data;
    };
    gpii.integrationTesting.mockSettingsHandler = function(data) {
        //fluid.log("MOCK SETTINGS HANDLER RECIEVED: "+JSON.stringify(data));
        jqUnit.assert("gpii.integrationTesting.mockSettingsHandler called");
        var cpy = fluid.copy(data);
        //enter array with settingsHandlers
        cpy = fluid.transform(cpy, function(settingsHandler) {
            //each solution
            return fluid.transform(settingsHandler, function(solution) {
                var settingsBlock = fluid.transform(solution.settings, function(value) {
                    return { oldValue: value, newValue: "changed" };
                });
                return { settings:settingsBlock };
            });
        });
        return cpy;
    };

    fluid.demands("solutionsReporter", ["gpii.flowManager", "gpii.matchMaker", "gpii.test"], {
        funcName: "gpii.dataSource.file",
        args: {
            url: "%db/test/data/solutions.reporter.mock1.json"
        }
    });
    var integrationTester = gpii.tests.testEnvironment();

    var getExpectedSettingsStore = function (url) {
        var settings = fs.readFileSync(url, "utf8");
        settings = JSON.parse(settings);
        return fluid.remove_if(settings, function (setting, index) {
            if (setting.contexts.OS.id !== os.platform()) {
                return setting;
            } else {
                fluid.each(setting.settingsHandlers, function (settingsHandler) {
                    settingsHandler.settings = {};
                });
            }
        });
    };

    integrationTester.asyncTest("Regular successful login", function () {
        var flowManager = gpii.flowManager(),
            expectedSettingsStore = getExpectedSettingsStore(flowManager.matchMakerDataSource.solutionsReporter.resolveUrl());
        jqUnit.expect(3);
        http.get({
            host: "localhost",
            port: 8081,
            path: "/user/integrationTester1/login"
        }, function(response) {
            var data = "";
            fluid.log("Callback from use login called");

            response.on("data", function (chunk) {
                fluid.log("Response from server: " + chunk);
                data += chunk;
            });
            response.on("close", function(err) {
                if (err) {
                    fluid.log("Got error: " + err.message);
                    jqUnit.start();
                }
                fluid.log("Connection to the server was closed");
            });
            response.on("end", function() {
                fluid.log("Connection to server ended");
                if (flowManager && flowManager.launchManagerDataSource && 
                    flowManager.launchManagerDataSource.settingsStore) {
                    jqUnit.assertDeepEq("Checking that the settingsStore contains the expected: ", expectedSettingsStore,
                        flowManager.launchManagerDataSource.settingsStore);
                } else {
                   jqUnit.assert("flowManager or settingsStore are not set", false);
                }
                jqUnit.start();
            });
        }).on('error', function(err) {
            fluid.log("Got error: " + err.message);
            jqUnit.start();
        });
    });
    //TODO: assert payloads sent to handlers
    //TODO: logout
    //TODO: unsuccessful logout (for non-logged in user)
    //TODO: multi-logout/login
    //TODO: unsuccessful login (invalid token)
    //TODO: make test with hooks in various places in the flowmanager
}());