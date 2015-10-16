/*
 * GPII Untrusted Flow Manager Development Tests
 *
 * Copyright 2015 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("jqUnit"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

var configName = "UntrustedUserLogonStateChangeTestsConfig";

require("../index.js");
require("./UserLogonStateChangeTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonStateChange");

// Generate the config, write it to disk, and register a listener to
// remove it after the tests are done

gpii.test.untrustedFlowManager.writeCombinedConfig(configName + ".json");
jqUnit.onAllTestsDone.addListener(gpii.test.untrustedFlowManager.makeFileRemover(configName + ".json"));

// Build the testDefs and run the tests

gpii.tests.untrusted.userLogonStateChange.testDefs = [];

fluid.each(gpii.tests.userLogonStateChange.testDefs, function (testDef) {
    gpii.tests.untrusted.userLogonStateChange.testDefs.push($.extend(true, {}, testDef, {
        config: {
            configName: configName,
            configPath: __dirname
        },
        gradeNames: "gpii.tests.userLogonStateChange.testCaseHolder",
        userToken: gpii.tests.userLogonStateChange.userToken,
        distributeOptions: {
            target: "{that kettle.test.request.http}.options.port",
            record: 8088
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.userLogonStateChange.testDefs);
