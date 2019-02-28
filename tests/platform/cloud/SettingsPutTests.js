/*!
Copyright 2017-2019 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
require("./DisruptionSequenceGradeConfig.js");
require("../../shared/FlowManagerSettingsPutTestDefs.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");
gpii.loadTestingSupport();

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsPut.disruptedTests,
    gpii.tests.cloud.oauth2.settings.config,
    "gpii.test.couchEnvironment"
);

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTest,
    gpii.tests.cloud.oauth2.settings.config,
    "gpii.test.couchEnvironment"
);
