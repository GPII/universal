/**
GPII Solution Registry Retrieval and Merging Tests

These tests ensures that we're correctly retrieving the solutions registry for the current platform
as well as the web platform. Furthermore, we're testing that these are used in the matchMaking
process

Copyright 2014 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    path = require("path"),
    jqUnit = jqUnit || fluid.require("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.solutionRegistryMerging");

require("../index.js");

gpii.loadTestingSupport();

gpii.tests.solutionRegistryMerging.data = {
    "settingsHandlers": {
        "gpii.settingsHandlers.noSettings": {
            "data": [{
                "settings": {
                    "signLanguage": "ils",
                    "textSize": 1.3333333333333333
                }
            }]
        },
        "gpii.settingsHandlers.webSockets": {
            "data": [{
                "settings": {
                    "fontSize": "large"
                }
            }]
        }
    }
};

gpii.tests.solutionRegistryMerging.fixtures = [
    {
        name: "Configuration retrieved by lifecycle manager",
        expect: 2,
        sequence: [
            {
                "func": "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "{loginRequest}.send"
            }, {
                event: "{loginRequest}.events.onComplete",
                listener: "gpii.test.loginRequestListen"
            },
            {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.data.settingsHandlers", "{nameResolver}"]
            }
        ]
    }
];

gpii.tests.solutionRegistryMerging.buildTestFixtures = function (fixtures) {
    return fluid.transform(fixtures, function (fixture) {
        var testDef = {
            name: fixture.name,
            userToken: "webtest_font_size",
            expect: fixture.expect,
            gradeNames: "gpii.test.integration.testCaseHolder.linux",
            config: {
                configName: "linux-chrome-config",
                configPath: path.resolve(__dirname, "platform/linux/configs")
            },
            sequence: fixture.sequence,
            data: gpii.tests.solutionRegistryMerging.data
        };

        return testDef;
    });
};

kettle.test.bootstrapServer(gpii.tests.solutionRegistryMerging.buildTestFixtures(
        gpii.tests.solutionRegistryMerging.fixtures));