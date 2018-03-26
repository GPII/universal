/**
 * GPII Untrusted Flow Manager Browser Channel Tests
 *
 * Copyright 2013 OCAD University
 * Copyright 2015 Emergya
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.require("%flowManager/test/shared/BrowserChannelTestDefs.js");

fluid.registerNamespace("gpii.tests.untrusted.flowManager.browserChannel");

// The test pouchdb data is from %gpii-universal/tests/platform/cloud/OAuth2AcceptanceDataStore.json
gpii.tests.untrusted.flowManager.browserChannel.testDefs = fluid.transform(gpii.tests.flowManager.browserChannel.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        gradeNames: ["gpii.test.pouch.pouchTestCaseHolder"],
        config: {
            configName: "gpii.tests.acceptance.untrusted.browserChannel.config",
            configPath: "%gpii-universal/tests/configs"
        }
    });

    testDef.sequence = gpii.test.pouch.addConstructFixturesToSequence(testDef.sequence);
    return testDef;
});

kettle.test.bootstrapServer(gpii.tests.untrusted.flowManager.browserChannel.testDefs);
