/*!
Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {
    var fluid = require("universal");
    var gpii = fluid.registerNamespace("gpii");
    var http = require("http");
    var flowManager;    
    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");

    gpii.integrationTesting.mockLaunchHandler = function(data) {
        fluid.log("MOCK LAUNCHER HERE");
        return data;
    };

    gpii.integrationTesting.mockSettingsHandler = function(data) {
        fluid.log("MOCK SETTINGS HANDLER RECIEVED: "+JSON.stringify(data));
        ok(true, "gpii.integrationTesting.mockSettingsHandler called");
        var cpy = fluid.copy(data);
        //enter array with settingsHandlers
        cpy = fluid.transform(cpy, function(settingsHandler) {
            //each solution
            return fluid.transform(settingsHandler, function(solution) {
                return fluid.transform(solution.settings, function(value) {
                    return { oldValue: value, newValue: "changed" };
                });
            });
        });
        fluid.log("RETURNING \n"+JSON.stringify(cpy));
        return cpy;
    };

    gpii.integrationTesting.launchServer = function() {
        flowManager = gpii.flowManager();
    };

    asyncTest("Does it launch?", function () {
        gpii.integrationTesting.launchServer();

        expect(2);
        http.get({
            host: 'localhost',
            port: 8081,
            path: "/user/integrationTester1/login"
        }, function(response) {
            //printRec(response);
            console.log("Callbak from use login called");
            ok(true, "It works");

            response.on('data', function (chunk) {
                console.log('Response from server: ' + chunk);
            });
            response.on('close', function(ab) {
                console.log("Closing time");
                start();
            });
            response.on('end', function(ab) {
                console.log("Ending time "+test);
                printRec(flowManager);
                start();
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}());