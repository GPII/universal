/**
GPII Integration Tests

Copyright 2014 Lucendo Development Ltd.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.contextAware.makeChecks({
    "gpii.contexts.test.integration": {
        value: true
    }
});

require("../index.js");

gpii.loadTestingSupport();

gpii.test.runSuitesWithFiltering(require("./platform/index-windows.js"), __dirname, ["gpii.test.integration.testCaseHolder.windows"]);
gpii.test.runSuitesWithFiltering(require("./platform/index-linux.js"), __dirname, ["gpii.test.integration.testCaseHolder.linux"]);
gpii.test.runSuitesWithFiltering(require("./platform/index-android.js"), __dirname, ["gpii.test.integration.testCaseHolder.android"]);
