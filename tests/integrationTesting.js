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
    var fluid = require("universal");
    var jqUnit = fluid.require("jqUnit");
    
    var gpii = fluid.registerNamespace("gpii");
    var http = require("http");
    gpii.integrationTesting = fluid.registerNamespace("gpii.integrationTesting");

    //
    var integrationTester1_expectedSettingsStore = [
    {
        "name": "[TESTING] Mock application",
        "id": "net.gpii.testing.mock.linux.application",
        "version": "3.2.1",
        "contexts": {
            "OS": {
                "id": "linux",
                "version": ">=2.6.26"
            }
        },
        "settingsHandlers": [
            {
                "type": "gpii.integrationTesting.mockSettingsHandler",
                "capabilitiesTransformations": {
                    "screenEnhancement": {
                        "magnification": "mag-factor",
                        "tracking": {
                            "expander": {
                                "type": "gpii.transform.valueMapper",
                                "path": "mouse-tracking",
                                "options": {
                                    "valueMap": {
                                        "mouse": "centered"
                                    }
                                }
                            }
                        }
                    }
                },
                "settings": {
                    "applicationParameter1": true
                }
            }
        ],
        "launchHandlers": [
            {
                "type": "gpii.integrationTesting.mockLaunchHandler",
                "options": {
                    "start": [
                        {
                            "mockLaunchHandler-start": {
                                "settings": {
                                    "setting1": true
                                },
                                "options": {
                                    "option1": true
                                }
                            }
                        }
                    ],
                    "stop": [
                        {
                            "mockLaunchHandler-stop": {
                                "settings": {
                                    "setting1": false
                                },
                                "options": {
                                    "setting1": false
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
];

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

    var flowManager;
    gpii.integrationTesting.launchServer = function() {
        flowManager = gpii.flowManager();
    };

    jqUnit.asyncTest("Regular successful login", function () {
        gpii.integrationTesting.launchServer();

        jqUnit.expect(3);
        http.get({
            host: "localhost",
            port: 8081,
            path: "/user/integrationTester1/login"
        }, function(response) {
            fluid.log("Callback from use login called");

            response.on("data", function (chunk) {
                fluid.log("Response from server: " + chunk);
            });
            response.on("close", function(dat) {
                fluid.log("Connection to the server was closed");
                jqUnit.start();
            });
            response.on("end", function(dat) {
                fluid.log("Connection to server ended");
                if (flowManager && flowManager.launchManagerDataSource && 
                    flowManager.launchManagerDataSource.settingsStore) {
                    jqUnit.assertDeepEq("Checking that the settingsStore contains the expected: ", 
                        flowManager.launchManagerDataSource.settingsStore, integrationTester1_expectedSettingsStore);
                } else {
                   jqUnit.assert("flowManager or settingsStore are not set", false);
                }
                jqUnit.start();
            });
        }).on('error', function(e) {
            fluid.log("Got error: " + e.message);
        });
    });
    //TODO: assert payloads sent to handlers
    //TODO: logout
    //TODO: unsuccessful logout (for non-logged in user)
    //TODO: multi-logout/login
    //TODO: unsuccessful login (invalid token)
    //TODO: make test with hooks in various places in the flowmanager
}());