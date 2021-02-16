/**
GPII Journal Integration Tests

Copyright 2016 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");
var kettle = require("kettle");
kettle.loadTestingSupport();

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.journal");

gpii.tests.journal.testSpec = fluid.require("%gpii-universal/tests/platform/windows/windows-builtIn-testSpec.js");

// The os_win entry forms the spine of our test. This user has 4 application-specific preferences encoded
// for Windows built-in a11y features - mouse trailing (SPI), high contrast (SPI), large cursors (registry), magnifier (registry)
// our test strategy involves overriding the mock implementation for the large cursors solutions registry entry to instead invoke an
// exploding settings handler
gpii.tests.journal.testDef = gpii.tests.windows.builtIn[0];

gpii.tests.journal.initialSettings = {
    "gpii.windows.spiSettingsHandler": {
        "com.microsoft.windows.mouseTrailing": [{
            "settings": {
                "MouseTrails": {
                    "value": 20
                }
            },
            "options": {
                "mockSync": true,
                "getAction": "SPI_GETMOUSETRAILS",
                "setAction": "SPI_SETMOUSETRAILS"
            }
        }]
    },
    "gpii.windows.registrySettingsHandler": {
        "com.microsoft.windows.magnifier": [{ // magnifier stuff
            "settings": {
                "Invert": 1,
                "Magnification": 200,
                "MagnificationMode": 4,
                "FollowFocus": 0,
                "FollowCaret": 1,
                "FollowMouse": 1,
                "FollowNarrator": 1,
                "FadeToMagIcon": 0,
                "ZoomIncrement": 100,
                "UseBitmapSmoothing": 1,
                "LensHeight": 30,
                "LensWidth": 30
            },
            "options": {
                "mockSync": true,
                "hKey": "HKEY_CURRENT_USER",
                "path": "Software\\Microsoft\\ScreenMagnifier",
                "dataTypes": {
                    "Magnification": "REG_DWORD",
                    "Invert": "REG_DWORD",
                    "FollowFocus": "REG_DWORD",
                    "FollowCaret": "REG_DWORD",
                    "FollowMouse": "REG_DWORD",
                    "FollowNarrator": "REG_DWORD",
                    "MagnificationMode": "REG_DWORD",
                    "FadeToMagIcon": "REG_DWORD",
                    "ZoomIncrement": "REG_DWORD",
                    "UseBitmapSmoothing": "REG_DWORD",
                    "LensHeight": "REG_DWORD",
                    "LensWidth": "REG_DWORD"
                }
            }
        }
    ]
    },
    "gpii.windows.displaySettingsHandler": {
        "com.microsoft.windows.screenResolution": [{
            "settings": {
                "screen-resolution": {
                    "width": 800,
                    "height": 600
                },
                "screen-dpi": 1
            }
        }]
    },
    "gpii.windows.systemSettingsHandler": {
        "com.microsoft.windows.nightScreen": [
            {
                "settings": {
                    "SystemSettings_Display_BlueLight_ManualToggleQuickAction": {
                        "value": false
                    }
                }
            }
        ],
        "com.microsoft.windows.touchPadSettings": [
            {
                "settings": {
                    "SystemSettings_Input_Touch_SetActivationTimeout": {
                        "value": "Medium sensitivity"
                    }
                }
            }
        ]/*,
  *  These settings have been commented out for https://issues.gpii.net/browse/GPII-4462
        "com.microsoft.windows.narrator": [
            {
                "settings": {
                    "SystemSettings_Accessibility_Narrator_IsAutoStartEnabled": {
                        "value": false
                    },
                    "SystemSettings_Accessibility_Narrator_IsAutoStartOnLogonDesktopEnabled": {
                        "value": false
                    }
                }
            }
        ]
  */
    },
    "gpii.windows.enableRegisteredAT": {
        "com.microsoft.windows.magnifier": [{
            "settings": {
                "running": false
            },
            "options": {
                "registryName": "magnifierpane",
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "Magnify.exe"
                    }
                ]
            }
        }]
    },
    "gpii.windows.nativeSettingsHandler": {
        "com.microsoft.windows.mouseSettings": [
            {
                "settings": {
                    "DoubleClickTimeConfig": {
                        "value": 500
                    }
                },
                "options": {
                    "functionName": "DoubleClickTime"
                }
            },
            {
                "settings": {
                    "DoubleClickWidthConfig": {
                        "value": 4
                    }
                },
                "options": {
                    "functionName": "DoubleClickWidth"
                }
            },
            {
                "settings": {
                    "DoubleClickHeightConfig": {
                        "value": 4
                    }
                },
                "options": {
                    "functionName": "DoubleClickHeight"
                }
            },
            {
                "settings": {
                    "Volume": {
                        "value": 0.5
                    }
                },
                "options": {
                    "functionName": "Volume"
                }
            }
        ]
    }
};

gpii.tests.journal.settingsAfterCrash = {
    "gpii.windows.enableRegisteredAT": {
        "com.microsoft.windows.magnifier": [{
            "settings": {
                "running": false
            },
            "options": {
                "registryName": "magnifierpane",
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "Magnify.exe"
                    }
                ]
            }
        }]
    }
};

fluid.defaults("gpii.tests.journal.solutionsRegistryAdvisor", {
    gradeNames: "fluid.modelComponent",
    model: {
        throwOnNext: false,
        explodeOnNext: true
    },
    distributeOptions: {
        "tests.journal.solutionsRegistry": {
            record: {
                namespace: "journalFilter",
                priority: "after:encoding",
                funcName: "gpii.tests.journal.solutionsRegistryFilter"
            },
            target: "{testCaseHolder flowManager solutionsRegistryDataSource}.options.listeners.onRead"
        }
    }
});

fluid.defaults("gpii.tests.journal.listJournalsRequestComponent", {
    gradeNames: "kettle.test.request.http",
    path: "/journal/journals.html"
});

// A base holder which doesn't harbour the exploding settings handler. Derived from the standard integration
// testCaseHolder in testing/src/Integration.js.  Defines new requests and overrides of the solutions registry and mock
// settings handlers.
fluid.defaults("gpii.tests.journal.baseTestCaseHolder", {
    gradeNames: ["gpii.test.integration.testCaseHolder.windows"],
    gpiiKey: gpii.tests.journal.testDef.gpiiKey,
    settingsHandlers: gpii.tests.journal.testDef.settingsHandlers,
    config: {
        configName: gpii.tests.journal.testSpec.configName,
        configPath: gpii.tests.journal.testSpec.configPath
    },
    distributeOptions: {
        "tests.journal.fastSPI": {
            record: {
                "gpii.windows.spiSettingsHandler": {
                    delaying: false // defeat this annoying built-in mock behaviour so we can run these tests faster
                }
            },
            target: "{that mockSettingsHandlers}.options.settingsHandlers"
        }
    },
    components: {
        restoreJournalRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/journal/restore/%journalId"
            }
        },
        listJournalsRequest: {
            type: "gpii.tests.journal.listJournalsRequestComponent"
        },
        loginRequest2: {
            type: "gpii.test.common.loginRequestComponent"
        },
        logoutRequest2: {
            type: "gpii.test.common.logoutRequestComponent"
        },
        listJournalsRequest2: {
            type: "gpii.tests.journal.listJournalsRequestComponent"
        }
    }
});

fluid.defaults("gpii.tests.journal.testCaseHolder", {
    gradeNames: ["gpii.tests.journal.baseTestCaseHolder"],
    events: {
        FLUID5931wait: null,
        onInitialSettingsComplete: null
    },
    components: {
        solutionsRegistryAdvisor: {
            type: "gpii.tests.journal.solutionsRegistryAdvisor"
        },
        // Override this component from gpii.test.integration.testCaseHolder to include the exploding handler
        mockSettingsHandlers: {
            type: "gpii.tests.integration.mockSettingsHandlerRegistry.journal"
        }
    }
});

// Used on the first run where the settings handler crashes the whole system
gpii.tests.journal.solutionsRegistryOverlay = {
    win32: {
        "com.microsoft.windows.cursors": {
            settingsHandlers: {
                explode: {
                    type: "gpii.tests.journal.explodingSettingsHandler",
                    supportedSettings: {
                        AppStarting: {}
                    },
                    capabilitiesTransformations: {
                        AppStarting: {
                            transform: {
                                type: "fluid.transforms.value",
                                inputPath: "http://registry\\.gpii\\.net/common/cursorSize",
                                outputPath: "value"
                            }
                        }
                    }
                },
                maybeThrow: {
                    type: "gpii.tests.journal.throwingSettingsHandler",
                    supportedSettings: {
                        AppStarting: {}
                    },
                    capabilitiesTransformations: {
                        AppStarting: {
                            transform: {
                                type: "fluid.transforms.value",
                                inputPath: "http://registry\\.gpii\\.net/common/cursorSize",
                                outputPath: "value"
                            }
                        }
                    }
                },
                configure: {
                    supportedSettings: {
                        AppStarting: {}
                    }
                }
            },
            restore: ["settings.maybeThrow", "settings.configure"],
            // It's necessary to execute settings.maybeThrow otherwise its entry does not appear in the snapshotted solutions
            // registry block entered into the journal, and hence it cannot be found on the next turn
            configure: ["settings.configure", "settings.maybeThrow", "settings.explode"]
        }
    }
};

gpii.tests.journal.solutionsRegistryFilter = function (payload) {
    return fluid.extend(true, {}, payload, gpii.tests.journal.solutionsRegistryOverlay);
};

fluid.defaults("gpii.tests.integration.mockSettingsHandlerRegistry.journal", {
    gradeNames: "gpii.test.integration.mockSettingsHandlerRegistry.windows",
    components: {
        explodingSettingsHandler: {
            type: "gpii.tests.journal.explodingSettingsHandler"
        },
        throwingSettingsHandler: {
            type: "gpii.tests.journal.throwingSettingsHandler"
        }
    },
    listeners: {
        "onCreate.populateMocks": "gpii.tests.journal.populateMockSettingsHandlers"
    }
});

// A settings handler with its "set" action overridden to have a globally destructive side-effect -
// the entire Kettle server hosting the FlowManager, etc. will be destroyed
fluid.defaults("gpii.tests.journal.explodingSettingsHandler", {
    gradeNames: "gpii.test.integration.mockSettingsHandler",
    invokers: {
        set: {
            funcName: "gpii.tests.journal.settingsHandlerExplode",
            args: ["{gpii.test.configuration}", "{gpii.tests.journal.solutionsRegistryAdvisor}", "{that}", "{arguments}.0"]
        }
    }
});

// A settings handler which synchronously throws an Error during its "set" action
fluid.defaults("gpii.tests.journal.throwingSettingsHandler", {
    gradeNames: "gpii.test.integration.mockSettingsHandler",
    invokers: {
        set: {
            funcName: "gpii.tests.journal.settingsHandlerThrow",
            args: ["{gpii.tests.journal.solutionsRegistryAdvisor}", "{that}", "{arguments}.0"]
        }
    }
});

// Reach upwards into the global configuration's server and destroy it
gpii.tests.journal.settingsHandlerExplode = function (configuration, advisor, that, payload) {
    fluid.log("EXPLODING SETTINGS HANDLER EXECUTING with id " + that.id + " and payload ", payload);
    if (advisor.model.explodeOnNext) {
        fluid.invokeLater(function () { // invoke later so that we do not race with construction - TODO: framework bug
            configuration.server.destroy();
            fluid.log("Server destroyed");
        });
        advisor.applier.change("explodeOnNext", false);
    }
    // null out our payload, compensate for GPII-1223/GPII-1891
    payload["com.microsoft.windows.cursors"][0].settings = {};
    // Beat jqUnit's failure handler to ignore the various errors falling out from this process
    // kettle.test.pushInstrumentedErrors(function () {
    //    fluid.log("Received expected failure from destroying active server: ", arguments);
    //});
    // TODO: failure of Ungarism here - invokers need to be eliminated from the framework
    return gpii.settingsHandlers.invokeSettingsHandler(that.setImpl, payload);
};

gpii.tests.journal.settingsHandlerThrow = function (advisor, that, payload) {
    if (advisor.model.throwOnNext) {
        advisor.applier.change("throwOnNext", false);
        throw new Error("Failure triggered during settings handler action");
    };
    payload["com.microsoft.windows.cursors"][0].settings = {};
    return gpii.settingsHandlers.invokeSettingsHandler(that.setImpl, payload);
};

gpii.tests.journal.populateMockSettingsHandlers = function (that) {
    gpii.test.integration.mockSettingsHandlerRegistry.populateOne(that, that.explodingSettingsHandler,
        "gpii.tests.journal.explodingSettingsHandler");
    gpii.test.integration.mockSettingsHandlerRegistry.populateOne(that, that.throwingSettingsHandler,
        "gpii.tests.journal.throwingSettingsHandler");
};

gpii.tests.journal.logDestroyed = function (loginRequest, testCaseHolder) {
    fluid.log("Received expected server destroyed event");
    // Remove KettleTestUtils.http native handler to this which will trigger a test failure
    loginRequest.nativeRequest.removeAllListeners("error");
    loginRequest.nativeRequest.on("error", function (err) {
        fluid.log("Received expected hangup error from login request", err);
    });
    jqUnit.assert("Reached checkpoint for destruction of server");
    var mocks = fluid.queryIoCSelector(fluid.rootComponent, "gpii.test.integration.mockSettingsHandler", true);
    fluid.each(mocks, function (mock) {
        mock.settingsStore = {};
    });
    fluid.log("CLEARED " + mocks.length + " mock settingsHandlers");
    // Arbitrarily wait as a result of FLUID5931 bug preventing immediate reconstruction of the server
    fluid.invokeLater(testCaseHolder.events.FLUID5931wait.fire);
};

gpii.tests.journal.stashJournalId = function (component) {
    component.stashedStartTime = Date.now();
    component.stashedJournalId = ">" + new Date(component.stashedStartTime).toISOString();
};

gpii.tests.journal.checkJournalsList = function (markup, component, expectCrashed) {
    console.log("Got markup of " + markup);
    var match = /a href=".*\/%3E(.*)"/.exec(markup);
    console.log("Got " + match.length + " matches");
    var firstDate = decodeURIComponent(match[1]);
    // Relaxed requirements on GPII-2522 due to lack of control over CI environment - see https://github.com/GPII/gpii-app/pull/19
    var expectedStart = component.stashedStartTime, expectedEnd = Date.now();
    var firstTime = Date.parse(firstDate);
    // Add further diagnostics for GPII-2522
    fluid.log("Parsed link date " + firstDate + " to time " + firstTime + " expected to be in range ["
        + expectedStart + ", " + expectedEnd + "]");
    jqUnit.assertTrue("Received correct journal time in journal list markup",
        firstTime >= expectedStart && firstTime <= expectedEnd);
    // See: http://stackoverflow.com/questions/1979884/how-to-use-javascript-regex-over-multiple-lines
    var snapshots = markup.match(/<p class="fl-snapshot">([\s\S]*?)<\/p>/g);
    fluid.log("Acquired " + snapshots.length + " snapshots");
    var isCrashed = snapshots[0].indexOf("crashed session") !== -1;
    jqUnit.assertEquals("First snapshot has expected crashed status", expectCrashed, isCrashed);
};

// Stashes the special members used by gpii.test.checkConfiguration into the testCaseHolder
gpii.tests.journal.stashInitial = function (settingsHandlersPayload, settingsStore, testCaseHolder) {
    // Like the effect of gpii.test.snapshotSettings
    settingsStore.orig = fluid.transform(settingsHandlersPayload, gpii.settingsHandlers.extractSettingsBlocks);
    // Like the effect of gpii.test.expandSettings with 2 blocks missing
    var settingsHandlers = fluid.copy(testCaseHolder.options.settingsHandlers);
    // We eliminate the last blocks since our initial settings state does not include them, and the blocks
    // with values all `undefined` will confuse jqUnit.assertDeepEq in gpii.test.checkConfiguration
    settingsHandlers["gpii.windows.spiSettingsHandler"] = fluid.filterKeys(settingsHandlers["gpii.windows.spiSettingsHandler"], "com.microsoft.windows.mouseTrailing");
    settingsHandlers["gpii.windows.registrySettingsHandler"] = fluid.filterKeys(settingsHandlers["gpii.windows.registrySettingsHandler"], "com.microsoft.windows.magnifier");
    testCaseHolder.settingsHandlers = settingsHandlers;
};

fluid.defaults("gpii.tests.journal.normalLoginSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {   func: "gpii.tests.journal.stashJournalId",
            args: "{testCaseHolder}"
        },
        {
            func: "{loginRequest2}.send"
        },
        {
            event: "{loginRequest2}.events.onComplete",
            listener: "gpii.test.loginRequestListen"
        },
        { // TODO: As well as FLUID-5903, implement "parameterised grades" of some kind
            func: "{logoutRequest2}.send"
        },
        {
            event: "{logoutRequest2}.events.onComplete",
            listener: "gpii.test.logoutRequestListen"
        },
        {
            func: "{listJournalsRequest2}.send"
        },
        {
            event: "{listJournalsRequest2}.events.onComplete",
            listener: "gpii.tests.journal.checkJournalsList",
            args: ["{arguments}.0", "{testCaseHolder}", false]
        }
    ]
});

fluid.defaults("gpii.tests.journal.stashInitialJournalSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {   func: "gpii.tests.journal.stashJournalId",
            args: "{testCaseHolder}"
        },
        {
            func: "gpii.test.setSettings",
            args: [gpii.tests.journal.initialSettings, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
        },
        {
            event: "{tests}.events.onInitialSettingsComplete",
            listener: "fluid.identity"
        },
        {
            func: "gpii.tests.journal.stashInitial",
            args: [gpii.tests.journal.initialSettings, "{testCaseHolder}.settingsStore", "{testCaseHolder}"]
        },
        {
            func: "{loginRequest}.send"
        },
        { // As a result of the exploding settings handler, the attempt to login will destroy the server
            event: "{configuration}.server.events.afterDestroy",
            listener: "gpii.tests.journal.logDestroyed",
            args: ["{loginRequest}", "{testCaseHolder}"]
        },
        {
            event: "{testCaseHolder}.events.FLUID5931wait",
            listener: "fluid.identity"
        }
    ]
});

fluid.defaults("gpii.tests.journal.journalRestorationSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {
            func: "gpii.test.setSettings",
            args: [gpii.tests.journal.settingsAfterCrash, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
        },
        {
            event: "{tests}.events.onInitialSettingsComplete",
            listener: "fluid.identity"
        },
        {
            func: "{listJournalsRequest}.send"
        },
        {
            event: "{listJournalsRequest}.events.onComplete",
            listener: "gpii.tests.journal.checkJournalsList",
            args: ["{arguments}.0", "{testCaseHolder}", true]
        },
        {
            func: "{gpii.tests.journal.solutionsRegistryAdvisor}.applier.change",
            args: ["throwOnNext", true]
        },
        {
            func: "{restoreJournalRequest}.send",
            args: [null, {
                termMap: {
                    journalId: "{testCaseHolder}.stashedJournalId"
                }
            }]
        },
        {
            event: "{restoreJournalRequest}.events.onComplete",
            listener: "gpii.test.assertJSONResponseSubset",
            args: [{
                message: "Successful response from journal restoration",
                string: "{arguments}.0",
                request: "{restoreJournalRequest}",
                expected: {
                    message: "The system's settings were restored from a snapshot"
                }
            }]
        }
    ]
});

fluid.defaults("gpii.tests.journal.goodSequenceGrade", {
    gradeNames: ["gpii.test.couchSequenceGrade"],
    sequenceElements: {
        stashInitial: {
            priority: "after:startCouch",
            gradeNames: "gpii.tests.journal.stashInitialJournalSequence"
        },
        restartServer: {
            gradeNames: "gpii.test.startServerSequence",
            priority: "after:stashInitial"
        },
        journalRestore: {
            priority: "after:restartServer",
            gradeNames: "gpii.tests.journal.journalRestorationSequence"
        },
        checkSequence: {
            priority: "after:journalRestore",
            gradeNames: "gpii.test.checkSequence"
        },
        normalLogin: {
            priority: "after:checkSequence",
            gradeNames: "gpii.tests.journal.normalLoginSequence"
        }
    }
});

fluid.defaults("gpii.tests.journal.goodCaseHolder", {
    gradeNames: ["gpii.tests.journal.testCaseHolder"],
    modules: [{
        name: "Journal Restoration Tests",
        tests: [{
            name: "Journal state and restoration",
            expect: 11,
            sequenceGrade: "gpii.tests.journal.goodSequenceGrade",
            sequence: []
        }]
    }]
});

// A little stub that emulates some of the testdef unpacking that previously would have been handled by
// `kettle.test.bootstrapServer`.
fluid.defaults("gpii.tests.journal.baseEnvironment", {
    gradeNames: ["gpii.test.couchEnvironment"],
    configurationName: "@expand:kettle.config.createDefaults({that}.tests.options.config)"
});

fluid.defaults("gpii.tests.journal.goodEnvironment", {
    gradeNames: ["gpii.tests.journal.baseEnvironment"],
    configurationName: "@expand:kettle.config.createDefaults({that}.tests.options.config)",
    components: {
        tests: {
            type: "gpii.tests.journal.goodCaseHolder"
        }
    }
});

fluid.defaults("gpii.tests.journal.badJournalRestorationSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {
            funcName: "kettle.test.pushInstrumentedErrors",
            args: "kettle.requestUncaughtExceptionHandler"
        },
        {
            func: "{restoreJournalRequest}.send",
            args: [null, {
                termMap: {
                    journalId: "Invalid journal ID"
                }
            }]
        },
        {
            event: "{restoreJournalRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: [{
                message: "Received 500 error when asking for bad journal file",
                errorTexts: "The only supported formats for journalId are",
                statusCode: 500,
                string: "{arguments}.0",
                request: "{restoreJournalRequest}"
            }]
        },
        {
            func: "kettle.test.popInstrumentedErrors"
        }
    ]
});

fluid.defaults("gpii.tests.journal.badSequenceGrade", {
    gradeNames: ["gpii.test.couchSequenceGrade"],
    sequenceElements: {
        badJournalRestore: {
            priority: "after:startCouch",
            gradeNames: "gpii.tests.journal.badJournalRestorationSequence"
        },
        normalLogin: {
            priority: "after:badJournalRestore",
            gradeNames: "gpii.tests.journal.normalLoginSequence"
        }
    }
});

fluid.defaults("gpii.tests.journal.badCaseHolder", {
    gradeNames: ["gpii.tests.journal.baseTestCaseHolder"],
    modules: [{
        name: "Bad Journal Restoration Tests",
        tests:[{
            name: "Restoration of bad journal file doesn't jam system",
            expect: 7,
            sequenceGrade: "gpii.tests.journal.badSequenceGrade",
            sequence: []
        }]
    }]
});

fluid.defaults("gpii.tests.journal.badEnvironment", {
    gradeNames: ["gpii.tests.journal.baseEnvironment"],
    components: {
        tests: {
            type: "gpii.tests.journal.badCaseHolder"
        }
    }
});

fluid.test.runTests([
    "gpii.tests.journal.goodEnvironment",
    "gpii.tests.journal.badEnvironment"
]);
