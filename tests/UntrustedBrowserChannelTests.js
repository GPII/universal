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
    path = require("path"),
    configPath = path.resolve(__dirname, "./configs"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

require("../gpii/node_modules/flowManager/test/BrowserChannelTestDefs.js");

fluid.registerNamespace("gpii.tests.untrusted.flowManager.browserChannel");

gpii.tests.untrusted.flowManager.browserChannel.testDefs = [];

fluid.each(gpii.tests.flowManager.browserChannel.testDefs, function (testDef) {
    gpii.tests.untrusted.flowManager.browserChannel.testDefs.push($.extend(true, {}, testDef, {
        config: {
            configName: "untrustedBrowserChannelTests",
            configPath: configPath
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.flowManager.browserChannel.testDefs);
