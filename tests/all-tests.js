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

// Ensure this happens first, to catch errors during code loading, especially before KETTLE-67 is fixed
kettle.loadTestingSupport();

// We must pass the current `require` to `fluid.require`, as nyc's instrumentation is hooked into it.
fluid.require("%gpii-universal", require);

var testIncludes = [
    "./platform/android/android-builtIn-testSpec.js",
    "./platform/android/android-talkback-testSpec.js",
    "./platform/cloud/AcceptanceTests_chrome.js",
    "./platform/cloud/AcceptanceTests_easit4all.js",
    "./platform/cloud/AcceptanceTests_empty.js",
    "./platform/cloud/AcceptanceTests_gnome_keyboard.js",
    "./platform/cloud/AcceptanceTests_jme.js",
    "./platform/cloud/AcceptanceTests_olb.js",
    "./platform/cloud/AcceptanceTests_smarthouses.js",
    "./platform/cloud/AcceptanceTests_tvm.js",
    "./platform/cloud/AcceptanceTests_untrustedSettingsGet.js",
    "./platform/cloud/AcceptanceTests_untrustedSettingsPut.js",
    "./platform/linux/linux-builtIn-testSpec.js",
    "./platform/linux/linux-dynamicDeviceReporter-testSpec.js",
    "./platform/linux/linux-orca-testSpec.js",
    "./platform/linux/linux-uioPlus-testSpec.js",
    "./platform/linux/linux-xrandr-testSpec.js",
    "./platform/windows/windows-builtIn-testSpec.js",
    "./platform/windows/windows-dynamicDeviceReporter-testSpec.js",
    "./platform/windows/windows-jaws-testSpec.js",
    "./platform/windows/windows-maavis-testSpec.js",
    "./platform/windows/windows-nvda-testSpec.js",
    "./platform/windows/windows-readWrite-testSpec.js",
    "./platform/windows/windows-uioPlus-testSpec.js",
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
    "../gpii/node_modules/accessRequester/test/AccessRequesterTests.js",
    "../gpii/node_modules/flowManager/test/SaveTests.js",
    "../gpii/node_modules/flowManager/test/BrowserChannelTests.js",
    "../gpii/node_modules/flowManager/test/GetUserTokenTests.js",
    "../gpii/node_modules/flowManager/test/PCPChannelTests.js",
    "../gpii/node_modules/flowManager/test/UntrustedSettingsDataSourceTests.js",
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
    "../gpii/node_modules/eventLog/test/EventLogTests.js",
    "../gpii/node_modules/userListeners/test/all-tests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
