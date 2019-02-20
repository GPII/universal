/*
 * Suppress HTTP Endpoints Tests
 *
 * Copyright 2019 OCAD University
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

require("./shared/SuppressHttpEndpointsTestDefs.js");

gpii.test.bootstrapServer(gpii.tests.suppressHttpEndpoints.buildTestDefs({
    configName: "gpii.tests.acceptance.untrusted.suppressHttpEndpoints.config.json5",
    configPath: "%gpii-universal/tests/configs"
}));
