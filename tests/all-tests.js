/*!
GPII Universal Tests

Copyright 2013 OCAD University
Copyright 2014 Emergya
Copyright 2014 Technosite
Copyright 2014 Raising the Floor - International
Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    kettle = fluid.require("kettle");

fluid.require("%universal");

kettle.loadTestingSupport();

var testIncludes = [
    "./platform/cloud/AcceptanceTests_chrome.js",
    "./platform/cloud/AcceptanceTests_chrome_oauth2.js",
    "./platform/cloud/AcceptanceTests_easit4all.js",
    "./platform/cloud/AcceptanceTests_empty.js",
    "./platform/cloud/AcceptanceTests_gnome_keyboard.js",
    "./platform/cloud/AcceptanceTests_jme.js",
    "./platform/cloud/AcceptanceTests_oauth2_gpiiAppInstallation.js",
    "./platform/cloud/AcceptanceTests_oauth2_privilegedPrefsCreator.js",
    "./platform/cloud/AcceptanceTests_oauth2_webPrefsConsumer.js",
    "./platform/cloud/AcceptanceTests_oauth2_privacySettings.js",
    "./platform/cloud/AcceptanceTests_olb.js",
    "./platform/cloud/AcceptanceTests_smarthouses.js",
    "./platform/cloud/AcceptanceTests_tvm.js",
    "./platform/cloud/AcceptanceTests_untrustedSettings.js",
    "./DevelopmentTests.js",
    "./UserLogonStateChangeTests.js",
    "./MultiSettingsHandlerTests.js",
    "./IntegrationTests.js",
    "./ContextIntegrationTests.js",
    "./JournalIntegrationTests.js",
    "./DeviceReporterErrorTests.js",
    "./PreferencesServerErrorTests.js",
    "./StartupAPITests.js",
    "./UntrustedBrowserChannelTests.js",
    "./UntrustedContextIntegrationTests.js",
    "./UntrustedDevelopmentTests.js",
    "./PayloadSizeTest.js",
    "./UntrustedUserLogonStateChangeTests.js",
    "../gpii/node_modules/flowManager/test/SaveTests.js",
    "../gpii/node_modules/flowManager/test/BrowserChannelTests.js",
    "../gpii/node_modules/flowManager/test/GetUserTokenTests.js",
    "../gpii/node_modules/flowManager/test/PCPChannelTests.js",
    "../gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/test/DbDataStoreTests.js",
    "../gpii/node_modules/matchMakerFramework/test/MatchMakerFrameworkTests.js",
    "../gpii/node_modules/flatMatchMaker/test/FlatMatchMakerTests.js",
    "../gpii/node_modules/canopyMatchMaker/test/CanopyMatchMakerTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/WebSocketsSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/settingsHandlerUtilitiesTests.js",
    "../gpii/node_modules/pouchManager/test/pouchManagerTests.js",
    "../gpii/node_modules/preferencesServer/test/preferencesServerTests.js",
    "../gpii/node_modules/rawPreferencesServer/test/RawPreferencesTest.js",
    "../gpii/node_modules/ontologyHandler/test/node/OntologyHandlerTests.js",
    "../gpii/node_modules/contextManager/test/ContextManagerTests.js",
    "../gpii/node_modules/singleInstance/test/SingleInstanceTests.js",
    "../gpii/node_modules/eventLog/test/EventLogTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
