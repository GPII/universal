/*!
GPII Universal Tests

Copyright 2013 OCAD University
Copyright 2014 Emergya
Copyright 2014 Technosite
Copyright 2014 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = fluid.require("kettle", require);

fluid.require("kettle/test/utils/js/KettleTestUtils", require);

kettle.tests.allTests = true;

var testIncludes = [
    // Run all tests included in the list.
    "../gpii/node_modules/flowManager/test/SaveTests.js",
    // "../gpii/node_modules/flowManager/test/UpdateTests.js",
    "../gpii/node_modules/flowManager/test/GetTokenTests.js",
    "../gpii/node_modules/matchMakerFramework/test/InverseCapabilitiesTests.js",
    "../gpii/node_modules/matchMakerFramework/test/matchMakerFrameworkTests.js",
    "../gpii/node_modules/matchMakerFramework/test/MatchMakerUtilitiesTests.js",
    "../gpii/node_modules/flatMatchMaker/test/FlatMatchMakerTests.js",
    "../gpii/node_modules/settingsHandlers/test/SettingsHandlerUtilitiesTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "../gpii/node_modules/preferencesServer/test/preferencesServerTests.js",
    "../gpii/node_modules/rawPreferencesServer/test/RawPreferencesTest.js",
    "../gpii/node_modules/ontologyHandler/test/node/OntologyHandlerTests.js",
    "../gpii/node_modules/contextManager/test/ContextManagerTests.js",
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
