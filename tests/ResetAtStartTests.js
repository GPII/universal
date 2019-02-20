/*
 * Reset on System Startup Tests with All in Local Config
 *
 * Copyright 2018 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./shared/ResetDefaultSettingsTestDefs.js");

gpii.test.runCouchTestDefs(gpii.tests.resetDefaultSettings.buildTestDefs(gpii.tests.resetDefaultSettings.resetAtStartTestCases, {
    configName: "gpii.tests.acceptance.resetAtStart.config",
    configPath: "%gpii-universal/tests/configs"
}));
