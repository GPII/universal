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
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

fluid.require("%flowManager/test/shared/BrowserChannelTestDefs.js");

fluid.registerNamespace("gpii.tests.untrusted.flowManager.browserChannel");

gpii.tests.untrusted.flowManager.browserChannel.testDefs = [];

fluid.each(gpii.tests.flowManager.browserChannel.testDefs, function (testDef) {
    gpii.tests.untrusted.flowManager.browserChannel.testDefs.push(fluid.extend(true, {}, testDef, {
        config: {
            configName: "untrustedBrowserChannelTests",
            configPath: "%universal/tests/configs"
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.flowManager.browserChannel.testDefs);
