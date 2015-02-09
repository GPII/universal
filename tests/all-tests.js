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
    kettle = fluid.require("kettle");

kettle.loadTestingSupport();

var testIncludes = [
    "../gpii/node_modules/flowManager/test/SaveTests.js",
    "../gpii/node_modules/flowManager/test/UpdateTests.js",
    "../gpii/node_modules/flowManager/test/GetUserTokenTests.js",
    "../gpii/node_modules/matchMakerFramework/test/InverseCapabilitiesTests.js",
    "../gpii/node_modules/matchMakerFramework/test/MatchMakerFrameworkTests.js",
    "../gpii/node_modules/flatMatchMaker/test/FlatMatchMakerTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "../gpii/node_modules/preferencesServer/test/preferencesServerTests.js",
    "../gpii/node_modules/rawPreferencesServer/test/RawPreferencesTest.js",
    "../gpii/node_modules/ontologyHandler/test/node/OntologyHandlerTests.js",
    "../gpii/node_modules/contextManager/test/ContextManagerTests.js",
    "./platform/cloud/AcceptanceTests_gnome_keyboard.js",
    "./platform/cloud/AcceptanceTests_jme.js",
    "./platform/cloud/AcceptanceTests_chrome.js",
    "./platform/cloud/AcceptanceTests_smarthouses.js",
    "./platform/cloud/AcceptanceTests_empty.js",
    "./DevelopmentTests.js",
    "./IntegrationTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
