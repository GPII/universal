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
require("../../shared/FlowManagerSettingsPutTestDefs.js");

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");
gpii.loadTestingSupport();

gpii.tests.cloud.oauth2.settingsPut.config = {
    configName: "gpii.config.cloudBased.development",
    configPath: "%gpii-universal/gpii/configs"
};

// Grade for "disruptions" that are also proper sequence grades.  Use the grade
// for couch test harness for development config
fluid.defaults("gpii.test.disruption.sequenceGrade", {
    gradeNames: ["gpii.test.disruption", "gpii.test.couchSequenceGrade"]
});

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsPut.disruptedTests,
    gpii.tests.cloud.oauth2.settingsPut.config,
    "gpii.test.couchEnvironment"
);

gpii.test.cloudBased.oauth2.runDisruptedTests(
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTest,
    gpii.tests.cloud.oauth2.settingsPut.config,
    "gpii.test.couchEnvironment"
);

