/*!
Copyright 2017 OCAD university

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

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");

gpii.tests.cloud.oauth2.settingsPut.config = {
    configName: "gpii.config.cloudBased.development",
    configPath: "%gpii-universal/gpii/configs"
};

fluid.each(gpii.tests.cloud.oauth2.settingsPut.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.cloud.oauth2.settingsPut.config
    );
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.updateSnapsetFailure", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.sequence"
});

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTest.testDef,
    {},
    gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTest.disruptions,
    gpii.tests.cloud.oauth2.settingsPut.config
);
