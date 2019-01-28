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

// TODO: Remove this once we're done profiling.
var process = require("process");

var maxes = {};

process.on("exit", function () {
    console.log(JSON.stringify(maxes, null, 2));
});

process.nextTick(function () {
    var memUsage = process.memoryUsage();
    var statKey;
    for (statKey in memUsage) {
        var currVal = memUsage[statKey];
        if (currVal > (maxes[statKey] || -1)) {
            maxes[statKey] = currVal;
        }
    }
});

// TODO: Remove above once we're done profiling.

// Ensure this happens first, to catch errors during code loading, especially before KETTLE-67 is fixed
kettle.loadTestingSupport();

// We must pass the current `require` to `fluid.require`, as nyc's instrumentation is hooked into it.
fluid.require("%gpii-universal", require);

var testIncludes = [
    "./DevelopmentTests.js",
    "./platform/cloud/CloudStatusTests.js",
    "./platform/cloud/SettingsGetTests.js",
    "./platform/cloud/SettingsPutTests.js",
    "./CloseConflictingAppsTests.js",
    "./ContextIntegrationTests.js",
    "./DeviceReporterErrorTests.js",
    "./ErrorTests.js",
    // TODO: Gotta get gpii.test.runSuitesWithFiltering working for the next test. AFTER logout/login problem solved.
    //"./IntegrationTests.js",
    // TODO: Gotta get gpii.test.buildSegmentedFixtures working for the next test. AFTER logout/login problem solved.
    // TODO: This also has some really nasty and deep sequence munging.
    //"./JournalIntegrationTests.js",
    "./MultiSettingsHandlerTests.js",
    "./PayloadSizeTest.js",
    "./PSPIntegrationTests.js",
    "./ResetWithEnvReportTests.js",
    // TODO: login problem and seeming crash of server running on 8081
    //"./ResetAtStartTests.js",
    "./PreferencesServerErrorTests.js",
    "./StartupAPITests.js",
    "./UntrustedBrowserChannelTests.js",
    "./UntrustedContextIntegrationTests.js",
    "./UntrustedDevelopmentTests.js",
    "./UntrustedPSPIntegrationTests.js",
    "./UntrustedResetWithEnvReportTests.js",
    // TODO: No actual reset and server on 8081 appears to crash.
    //"./UntrustedResetAtStartTests.js",
    // TODO: proximity triggered login event doesn't fire.
    /*
            TODO: Still broken post-multi-session fix.

        10:13:37.425:  Test case listener has not responded after 5000ms - at sequence pos 5 of 12 sequence element {
        "event": "{proximityTriggeredRequest}.events.onComplete",
     */
    //"./UntrustedUserLogonHandlersTests.js",
    // TODO: Needs to be rewritten to use sequence grades instead of baking in its own copy of the sequence-mangling.
    //"./UntrustedUserLogonRequestTests.js",
    // TODO: proximity triggered login event doesn't fire.
    //"./UserLogonHandlersEventsTests.js",
    /*
        TODO: also fails because of proximity event.

        16:16:29.647:  Test case listener has not responded after 5000ms - at sequence pos 5 of 12 sequence element {
        "event": "{proximityTriggeredRequest}.events.onComplete",

        ... Time passes ...

        10:15:32.491:  jq: FAIL: Module "gpii.tests.acceptance.untrusted.userLogon.config tests" Test name "Testing standard proximityTriggered login and logout" - Message: Error making request to /user/adjustCursor/proximityTriggered: socket hang up
10:15:32.491:  jq: Source:     at pok (/Users/duhrer/Source/rtf/universal/node_modules/infusion/tests/test-core/jqUnit/js/jqUnit.js:112:15)

     */
    //"./UserLogonHandlersTests.js",
    // TODO: seems to also be blocked by proximity login errors,
    //"./UserLogonRequestTests.js",
    "../gpii/node_modules/accessRequester/test/AccessRequesterTests.js",
    "../gpii/node_modules/contextManager/test/ContextManagerTests.js",
    "../gpii/node_modules/couchConnector/test/couchConnectorTests.js",
    "../gpii/node_modules/eventLog/test/all-tests.js",
    "../gpii/node_modules/flatMatchMaker/test/FlatMatchMakerTests.js",
    "../gpii/node_modules/flowManager/test/BrowserChannelTests.js",
    "../gpii/node_modules/flowManager/test/DefaultSettingsLoaderTests.js",
    "../gpii/node_modules/flowManager/test/PrefsServerDataSourceTests.js",
    // TODO: logged in / logged out problem (doesn't seem to log the named user in, complains that "noUser" is already logged in).
    //"../gpii/node_modules/flowManager/test/PSPChannelTests.js",
    "../gpii/node_modules/flowManager/test/SettingsDataSourceTests.js",
    "../gpii/node_modules/gpii-db-operation/test/DbDataStoreTests.js",
    "../gpii/node_modules/gpii-ini-file/test/iniFileTests.js",
    "../gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/authGrantFinderTests.js",
    "../gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/authorizationServiceTests.js",
    "../gpii/node_modules/matchMakerFramework/test/MatchMakerFrameworkTests.js",
    "../gpii/node_modules/ontologyHandler/test/node/OntologyHandlerTests.js",
    "../gpii/node_modules/preferencesServer/test/preferencesServerTests.js",
    "../gpii/node_modules/preferencesServer/test/preferencesServiceTests.js",
    "../gpii/node_modules/settingsHandlers/test/INISettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/NoSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/SettingsHandlerUtilitiesTests.js",
    "../gpii/node_modules/settingsHandlers/test/WebSocketsSettingsHandlerTests.js",
    "../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js",
    "../gpii/node_modules/singleInstance/test/SingleInstanceTests.js",
    "../gpii/node_modules/userListeners/test/all-tests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
