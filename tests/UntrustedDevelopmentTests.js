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
    fs = require("fs"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

var generatedConfigName = "UntrustedDevelopmentTestsConfig";

require("../index.js");
require("./DevelopmentTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.development");

// Generate the config, write it to disk, and register a listener to
// remove it after the tests are done

var config = gpii.test.untrustedFlowManager.combinedConfig.build("untrusted",
                                                                 path.resolve(__dirname, "../gpii/configs"),
                                                                 "cloudBased.development.all.local",
                                                                 path.resolve(__dirname, "../gpii/configs"));

fs.writeFileSync(generatedConfigName + ".json", JSON.stringify(config, null, 4));

jqUnit.onAllTestsDone.addListener(gpii.test.untrustedFlowManager.makeFileRemover(generatedConfigName + ".json"));

// Build the testDefs and run the tests

gpii.tests.untrusted.development.testDefs = [];

fluid.each(gpii.tests.development.testDefs, function (testDef) {
    gpii.tests.untrusted.development.testDefs.push($.extend(true, {}, testDef, {
        config: {
            configName: generatedConfigName,
            configPath: __dirname
        },
        distributeOptions: {
            target: "{that kettle.test.request.http}.options.port",
            record: 8088
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.development.testDefs);
