/**
GPII Context Integration Tests

Copyright 2016 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

require("../index.js");

gpii.loadTestingSupport();
fluid.setLogging(true);

fluid.registerNamespace("gpii.tests.journal");

gpii.tests.journal.testSpec = fluid.require("%universal/tests/platform/windows/windows-builtIn-testSpec.js");

// The os_win7 entry forms the spine of our test. This user has 4 application-specific preferences encoded
// for Windows built-in a11y features - mouse trailing (SPI), high contrast (SPI), large cursors (registry), magnifier (registry)
// our test strategy involves overriding the mock implementation for the large cursors solutions registry entry to instead invoke an
// exploding settings handler
gpii.tests.journal.testDef = gpii.tests.windows.builtIn[0];

gpii.tests.journal.initialSettings = {
    "gpii.windows.spiSettingsHandler": {
        "some.app.id": [{
            "settings": {
                "MouseTrails": {
                    "value": 20
                }
            },
            "options": { // We use a lower-quality utility than gpii.settingsHandlers.invokeRetryingHandler in our test case setup
                "mockSync": true,
                "getAction": "SPI_GETMOUSETRAILS",
                "setAction": "SPI_SETMOUSETRAILS"
            }
        }]
    },
    "gpii.windows.registrySettingsHandler": {
        "some.app.id": [{ // magnifier stuff
            "settings": {
                "Invert": 1,
                "Magnification": 200,
                "MagnificationMode": 4,
                "FollowFocus": 0,
                "FollowCaret": 1,
                "FollowMouse": 1
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
                    "MagnificationMode": "REG_DWORD"
                }
            }
        }
    ]
    },
    "gpii.windows.displaySettingsHandler": {
        "some.app.id": [{
            "settings": {
                "screen-resolution": {
                    "width": 800,
                    "height": 600
                }
            }
        }]
    }
};

fluid.defaults("gpii.tests.journal.solutionsRegistryAdvisor", {
    gradeNames: "fluid.component",
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

// Derive from the standard integration testCaseHolder in testing/src/Integration.js to define new requests
// and overrides of the solutions registry and mock settings handlers
fluid.defaults("gpii.tests.journal.testCaseHolder", {
    gradeNames: "gpii.tests.journal.baseTestCaseHolder",
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

// A base holder which doesn't harbour the exploding settings handler
fluid.defaults("gpii.tests.journal.baseTestCaseHolder", {
    gradeNames: "gpii.test.integration.testCaseHolder.windows",
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

gpii.tests.journal.solutionsRegistryOverlay = {
    "com.microsoft.windows.cursors": {
        settingsHandlers: {
            explode: {
                type: "gpii.tests.journal.explodingSettingsHandler",
                supportedSettings: {
                    cursorSize: {}
                }
            },
            configure: {
                supportedSettings: {
                    cursorSize: {}
                }
            }
        },
        configure: ["settings.configure", "settings.explode"]
    }
};

gpii.tests.journal.solutionsRegistryFilter = function (payload, options) {
    if (options.directModel.os === "win32") { // TODO: When GPII-1809 is merged in with whatever strategy it uses, this will need to be improved
        return fluid.extend(true, {}, payload, gpii.tests.journal.solutionsRegistryOverlay);
    } else {
        return payload;
    }
};

fluid.defaults("gpii.tests.integration.mockSettingsHandlerRegistry.journal", {
    gradeNames: "gpii.test.integration.mockSettingsHandlerRegistry.windows",
    components: {
        explodingSettingsHandler: {
            type: "gpii.tests.journal.explodingSettingsHandler"
        }
    },
    listeners: {
        "onCreate.populateExploding": "gpii.tests.journal.populateExplodingSettingsHandler"
    }
});

// A settings handler with its "set" action overridden to have a globally destructive side-effect -
// the entire Kettle server hosting the FlowManager, etc. will be destroyed
fluid.defaults("gpii.tests.journal.explodingSettingsHandler", {
    gradeNames: "gpii.test.integration.mockSettingsHandler",
    invokers: {
        set: {
            funcName: "gpii.tests.journal.settingsHandlerExplode",
            args: ["{kettle.test.configuration}", "{that}", "{arguments}.0"]
        }
    }
});

// Reach upwards into the global configuration's server and destroy it
gpii.tests.journal.settingsHandlerExplode = function (configuration, that, payload) {
    fluid.log("EXPLODING SETTINGS HANDLER EXECUTING with id " + that.id + " and payload ", payload);
    // null out our payload, compensate for GPII-1223/GPII-1891
    payload["com.microsoft.windows.cursors"][0].settings = {};
    // Beat jqUnit's failure handler to ignore the various errors falling out from this process
    // kettle.test.pushInstrumentedErrors(function () {
    //    fluid.log("Received expected failure from destroying active server: ", arguments);
    //});
    fluid.invokeLater(function () { // invoke later so that we do not race with construction - TODO: framework bug
        configuration.server.destroy();
        fluid.log("Server destroyed");
    });
    // TODO: failure of Ungarism here - invokers need to be eliminated from the framework
    return gpii.settingsHandlers.invokeSettingsHandler(that.setImpl, payload);
};

gpii.tests.journal.populateExplodingSettingsHandler = function (that) {
    gpii.test.integration.mockSettingsHandlerRegistry.populateOne(that, that.explodingSettingsHandler, "gpii.tests.journal.explodingSettingsHandler");
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
    var firstTime = Date.parse(firstDate);
    fluid.log("Parsed link date " + firstDate + " to time " + firstTime);
    jqUnit.assertTrue("Received correct journal time in journal list markup", firstTime > component.stashedStartTime && firstTime < (component.stashedStartTime + 2000));
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
    settingsHandlers["gpii.windows.spiSettingsHandler"]["some.app.id"].length = 1;
    settingsHandlers["gpii.windows.registrySettingsHandler"]["some.app.id"].length = 1;
    testCaseHolder.settingsHandlers = settingsHandlers;
};

gpii.tests.journal.normalLoginFixtures = [
    {   func: "gpii.tests.journal.stashJournalId",
        args: "{testCaseHolder}"
    }, {
        func: "{loginRequest2}.send"
    }, {
        event: "{loginRequest2}.events.onComplete",
        listener: "gpii.test.loginRequestListen"
    },  { // TODO: As well as FLUID-5903, implement "parameterised grades" of some kind
        func: "{logoutRequest2}.send"
    }, {
        event: "{logoutRequest2}.events.onComplete",
        listener: "gpii.test.logoutRequestListen"
    }, {
        func: "{listJournalsRequest2}.send"
    }, {
        event: "{listJournalsRequest2}.events.onComplete",
        listener: "gpii.tests.journal.checkJournalsList",
        args: ["{arguments}.0", "{testCaseHolder}", false]
    }
];

gpii.tests.journal.fixtures = [
    {
        name: "Journal state and restoration",
        expect: 10,
        sequenceSegments: [
            {   func: "gpii.tests.journal.stashJournalId",
                args: "{testCaseHolder}"
            }, {
                func: "gpii.test.setSettings",
                args: [gpii.tests.journal.initialSettings, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
            }, {
                event: "{tests}.events.onInitialSettingsComplete",
                listener: "fluid.identity"
            }, { // Destroy this advisor after first successful startup so that when we recreate the FlowManager, the exploding listener is gone
                func: "{testCaseHolder}.solutionsRegistryAdvisor.destroy"
            },
            // The following three steps intentionally commented out - they are here to exhibit what *SHOULD* be equivalent to the call to gpii.tests.journal.stashInitial,
            // only we prefer to make a more reliable test by verifying that the settings really are identical to the initialSettings in our own records
            /* {
                func: "gpii.test.expandSettings",
                args: [ "{testCaseHolder}", "settingsHandlers" ]
            }, {
                func: "gpii.test.snapshotSettings",
                args: ["{testCaseHolder}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onSnapshotComplete",
                listener: "fluid.identity"
            }, */ {
                func: "gpii.tests.journal.stashInitial",
                args: [gpii.tests.journal.initialSettings, "{testCaseHolder}.settingsStore", "{testCaseHolder}"]
            }, {
                func: "{loginRequest}.send"
            }, { // As a result of the exploding settings handler, the attempt to login will destroy the server
                event: "{configuration}.server.events.afterDestroy",
                listener: "gpii.tests.journal.logDestroyed",
                args: ["{loginRequest}", "{testCaseHolder}"]
            }, {
                event: "{testCaseHolder}.events.FLUID5931wait",
                listener: "fluid.identity"
            },
            kettle.test.startServerSequence,
            {
                func: "{listJournalsRequest}.send"
            }, {
                event: "{listJournalsRequest}.events.onComplete",
                listener: "gpii.tests.journal.checkJournalsList",
                args: ["{arguments}.0", "{testCaseHolder}", true]
            }, {
                func: "{restoreJournalRequest}.send",
                args: [null, {
                    termMap: {
                        journalId: "{testCaseHolder}.stashedJournalId"
                    }
                }]
            }, {
                event: "{restoreJournalRequest}.events.onComplete",
                listener: "gpii.test.assertJSONResponseSubset",
                args: {
                    message: "Successful response from journal restoration",
                    string: "{arguments}.0",
                    request: "{restoreJournalRequest}",
                    expected: {
                        message: "The system's settings were restored from a snapshot"
                    }
                }
            }, gpii.test.checkSequence,
            // Now verify that we can log on normally after a restore, and generate a non-crashed session after logging off
            gpii.tests.journal.normalLoginFixtures
        ]
    }
];

gpii.tests.journal.badJournalFixtures = [
    {
        name: "Restoration of bad journal file doesn't jam system",
        expect: 7,
        sequenceSegments: [{
            funcName: "kettle.test.pushInstrumentedErrors",
            args: "kettle.requestUncaughtExceptionHandler"
        }, {
            func: "{restoreJournalRequest}.send",
            args: [null, {
                termMap: {
                    journalId: "Invalid journal ID"
                }
            }]
        }, {
            event: "{restoreJournalRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: {
                message: "Received 500 error when asking for bad journal file",
                errorTexts: "The only supported formats for journalId are",
                statusCode: 500,
                string: "{arguments}.0",
                request: "{restoreJournalRequest}"
            }
        }, {
            func: "kettle.test.popInstrumentedErrors"
        },
        gpii.tests.journal.normalLoginFixtures
        ]
    }
];

gpii.tests.journal.baseTestDefBase = fluid.freezeRecursive({
    userToken: gpii.tests.journal.testDef.userToken,
    settingsHandlers: gpii.tests.journal.testDef.settingsHandlers,
    config: {
        configName: gpii.tests.journal.testSpec.configName,
        configPath: gpii.tests.journal.testSpec.configPath
    }
});

gpii.tests.journal.baseTestDef = fluid.extend({
    name: "Journal Restoration Tests",
    gradeNames: "gpii.tests.journal.testCaseHolder"
}, gpii.tests.journal.baseTestDefBase);

gpii.tests.journal.badJournalBaseTestDef = fluid.extend({
    name: "Bad Journal Restoration Tests",
    gradeNames: "gpii.tests.journal.baseTestCaseHolder"
}, gpii.tests.journal.baseTestDefBase);


kettle.test.bootstrapServer(gpii.test.buildSegmentedFixtures(
        gpii.tests.journal.fixtures, gpii.tests.journal.baseTestDef));

kettle.test.bootstrapServer(gpii.test.buildSegmentedFixtures(
        gpii.tests.journal.badJournalFixtures, gpii.tests.journal.badJournalBaseTestDef));
