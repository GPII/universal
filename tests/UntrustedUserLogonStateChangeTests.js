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
    path = require("path"),
    configPath = path.resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");
require("./shared/UserLogonStateChangeTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.userLogonStateChange");

gpii.tests.untrusted.userLogonStateChange.testDefs = [];

fluid.each(gpii.tests.userLogonStateChange.testDefs, function (testDef) {
    gpii.tests.untrusted.userLogonStateChange.testDefs.push($.extend(true, {}, testDef, {
        config: {
            configName: "untrusted.development.all.local",
            configPath: configPath
        },
        gradeNames: "gpii.tests.userLogonStateChange.testCaseHolder",
        userToken: gpii.tests.userLogonStateChange.userToken
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.userLogonStateChange.testDefs);
