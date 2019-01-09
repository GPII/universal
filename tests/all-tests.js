/*!
GPII Universal Tests

Copyright 2013 OCAD University
Copyright 2014 Emergya
Copyright 2014 Technosite
Copyright 2014 Raising the Floor - International
Copyright 2017-2018 OCAD University

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

// TODO: Most current problems seem to be down to not having any settingsHandlers, which is created based on the
// caseholder's options.settingsHandler, which appears to be blank for PSPIntegrationTests.js
var testIncludes = [
    // TODO: login/logout problem, perhaps related to the other issues.
    //"./DevelopmentTests.js",
    "./platform/cloud/CloudStatusTests.js",
    // TODO:  Next two use "disrupted test" pattern, need to pick apart and rewrite.
    //"./platform/cloud/SettingsGetTests.js",
    //"./platform/cloud/SettingsPutTests.js",
    // TODO: Need to pick apart gpii.test.runTests to run the next test.  AFTER logout/login problem solved.
    //"./CloseConflictingAppsTests.js",
    // TODO: Need to pick apart gpii.test.buildSegmentedFixtures to run the next test.  AFTER logout/login problem solved.
    //"./ContextIntegrationTests.js",
    "./DeviceReporterErrorTests.js",
    // TODO: login/logout problems
    /*

        16:18:44.410:  FATAL ERROR: Uncaught exception: Got logout request from user explodeLaunchHandlerStop, but the user noUser is logged in. So ignoring the request.
undefined

     */
    //"./ErrorTests.js",
    // TODO: Gotta get gpii.test.runSuitesWithFiltering working for the next test. AFTER logout/login problem solved.
    //"./IntegrationTests.js",
    // TODO: Gotta get gpii.test.buildSegmentedFixtures working for the next test. AFTER logout/login problem solved.
    //"./JournalIntegrationTests.js",
    // TODO: login/logout mismatch
    //"./MultiSettingsHandlerTests.js"
    // TODO: logged in / logged out problem
    //"./PayloadSizeTest.js",
    // TODO: login/logout problems.
    //"./PSPIntegrationTests.js",
    "./ResetWithEnvReportTests.js",
    // TODO: login and seeming crash of server running on 8081
    //"./ResetAtStartTests.js",
    "./PreferencesServerErrorTests.js",
    // TODO: Hangs, no idea why at the moment.
    //"./StartupAPITests.js",
    "./UntrustedBrowserChannelTests.js",
    // TODO: logged in / logged out problem (needs sequence from Testing.js?)
    //"./UntrustedContextIntegrationTests.js",
    // TODO: logged in / logged out problem (needs sequence from Testing.js?)
    //"./UntrustedDevelopmentTests.js",
    "./UntrustedPSPIntegrationTests.js",
    "./UntrustedResetWithEnvReportTests.js",
    // TODO: {tests} / {testCaseHolder} problem in the next two tests.
    //"./UntrustedResetAtStartTests.js",
    //"./UntrustedUserLogonHandlersTests.js",
    // TODO: Needs to be rewritten to use sequence grades instead of baking in its own copy of the sequence-mangling.
    //"./UntrustedUserLogonRequestTests.js",
    // TODO: {tests} / {testCaseHolder} problem in the next two tests.
    //"./UserLogonHandlersEventsTests.js",
    /*
        16:16:29.647:  Test case listener has not responded after 5000ms - at sequence pos 5 of 12 sequence element {
        "event": "{proximityTriggeredRequest}.events.onComplete",
     */
    //"./UserLogonHandlersTests.js",
    // TODO: logged in / logged out problem (needs sequence from Testing.js?)
    //"./UserLogonRequestTests.js",
    "../gpii/node_modules/accessRequester/test/AccessRequesterTests.js",
    "../gpii/node_modules/contextManager/test/ContextManagerTests.js",
    "../gpii/node_modules/eventLog/test/all-tests.js",
    "../gpii/node_modules/flatMatchMaker/test/FlatMatchMakerTests.js",
    "../gpii/node_modules/flowManager/test/BrowserChannelTests.js",
    "../gpii/node_modules/flowManager/test/DefaultSettingsLoaderTests.js",
    "../gpii/node_modules/flowManager/test/PrefsServerDataSourceTests.js",
    // TODO: logged in / logged out problem (doesn't seem to log the named user in, complains that "noUser" is already logged in).
    //"../gpii/node_modules/flowManager/test/PSPChannelTests.js",
    "../gpii/node_modules/flowManager/test/SettingsDataSourceTests.js",
    // TODO: Rewrite to use gpii-couchdb-test-harness
    //"../gpii/node_modules/gpii-db-operation/test/DbDataStoreTests.js",
    // TODO: Uses its own sequence munging, need to unpack and rewrite
    //"../gpii/node_modules/matchMakerFramework/test/MatchMakerFrameworkTests.js",
    // TODO: testCaseHolder with components plus kettle.test.bootstrapServer, need to rewrite or understand why we can leave it alone.
    //"../gpii/node_modules/ontologyHandler/test/node/OntologyHandlerTests.js",
    "../gpii/node_modules/couchConnector/test/couchConnectorTests.js",
    // TODO: Deep integration with previous pouch test case holder, needs to be rewritten.
    //"../gpii/node_modules/preferencesServer/test/preferencesServerTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/WebSocketsSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/NoSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/SettingsHandlerUtilitiesTests.js",
    "../gpii/node_modules/singleInstance/test/SingleInstanceTests.js",
    "../gpii/node_modules/userListeners/test/all-tests.js",
    "../gpii/node_modules/gpii-ini-file/test/iniFileTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
