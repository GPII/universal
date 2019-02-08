/**
GPII Production Config tests

Requirements:
* an internet connection
* a cloud based flow manager running at `http://flowmanager.gpii.net` containing at least the MikelVargas
preferences

---

Copyright 2015 Raising the Floor - International
Copyright 2018 OCAD University

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

fluid.registerNamespace("gpii.tests.productionConfigTesting");

fluid.require("%gpii-universal");

/*
 * ==============================================================================
 * Testing of untrusted local flow manager with the live cloud based flow manager
 * ==============================================================================
 */

require("./shared/DevelopmentTestDefs.js");

gpii.loadTestingSupport();

gpii.test.bootstrapServer(fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        config: {
            configName: "gpii.config.untrusted.development.json5",
            configPath: "%gpii-universal/gpii/configs"
        }
    });
    return testDef;
}));
