/**
 * GPII Integration Tests
 *
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.integration");

require("../index.js");

gpii.loadTestingSupport();

gpii.test.runSuitesWithFiltering(require("./platform/index-windows.js"), __dirname, ["gpii.test.integration.testCaseHolder.windows"]);
gpii.test.runSuitesWithFiltering(require("./platform/index-linux.js"), __dirname, ["gpii.test.integration.testCaseHolder.linux"]);
gpii.test.runSuitesWithFiltering(require("./platform/index-android.js"), __dirname, ["gpii.test.integration.testCaseHolder.android"]);
