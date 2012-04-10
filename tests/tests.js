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
    //will hold reference to flowManager for later use
    var flowManager;    
    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");

    gpii.integrationTesting.mockLaunchHandler = function(data) {
        fluid.log("MOCK LAUNCHER HERE");
        //assert that the mock settingsHandler is being called at all
        ok(true, "gpii.integrationTesting.mockLaunchHandler called");
        return data;
    };

    gpii.integrationTesting.mockSettingsHandler = function(data) {
        fluid.log("MOCK SETTINGS HANDLER RECIEVED: "+JSON.stringify(data));
        //assert that the mock settingsHandler is being called at all
        ok(true, "gpii.integrationTesting.mockSettingsHandler called");
        //create payload to return - with oldValue, newValue objects for values
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

    var printRec(flowManager) {
        fluid.each(flowManager, function(v, k) {
            console.log(k+": "+v);
        });
    };  

    //launches the flowmanager and initializes the flowManager variable.
    gpii.integrationTesting.launchServer = function() {
        flowManager = gpii.flowManager();
    };

    asyncTest("SettingsStore initialized and settingsHandler called?", function () {
        //start server
        gpii.integrationTesting.launchServer();

        expect(3);
        //send login token for user: integrationTester1
        http.get({
            host: 'localhost',
            port: 8081,
            path: "/user/integrationTester1/login"
        }, function(response) {
            //printRec(response);
            console.log("Callback from use login called");
            ok(true, "It works");

            //print out responses from server
            response.on('data', function (chunk) {
                console.log('Response from server: ' + chunk);
            });
            response.on('close', function(ab) {
                console.log("Connection closed by server");
                start();
            });
            //expect server to end connection on login
            response.on('end', function(ab) {
                console.log("Connection ended by server");
                printRec(flowManager);
                start();
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    });
}());