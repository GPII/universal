/*!
Copyright 2017-2019 OCAD university

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

fluid.require("%gpii-universal");
require("./DisruptionSequenceGradeConfig.js");
require("../../shared/FlowManagerSettingsGetTestDefs.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsGet");

gpii.loadTestingSupport();

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsGet.disruptedTests,
    gpii.tests.cloud.oauth2.settings.config,
    "gpii.test.couchEnvironment"
);
