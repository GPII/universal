/*
 * GPII Universal Tests
 *
 * Copyright 2013 OCAD University
 * Copyright 2014 Emergya
 * Copyright 2014 Technosite
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    kettle = fluid.require("kettle", require);

fluid.require("kettle/test/utils/js/KettleTestUtils", require);

kettle.tests.allTests = true;

var testIncludes = [

    // Run all tests included in the list.
    "../gpii/node_modules/flowManager/test/SaveTests.js",
    "../gpii/node_modules/flowManager/test/UpdateTests.js",
    "../gpii/node_modules/flowManager/test/GetTokenTests.js",
    "../gpii/node_modules/matchMaker/test/ProxyTests.js",
    "../gpii/node_modules/matchMaker/test/InverseCapabilitiesTests.js",
    "../gpii/node_modules/settingsHandlers/test/SettingsHandlerUtilitiesTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "./acceptanceTests/AcceptanceTests_gnome_keyboard.js",
    "./acceptanceTests/AcceptanceTests_jme.js",
    "./acceptanceTests/AcceptanceTests_chrome.js",
    "./acceptanceTests/AcceptanceTests_smarthouses.js",
    "./acceptanceTests/AcceptanceTests_empty.js",
    "./DevelopmentTests.js"

];
var tests = [];

fluid.each(testIncludes, function (path) {
    tests = tests.concat(fluid.require(path, require));
});

fluid.test.runTests(tests);
