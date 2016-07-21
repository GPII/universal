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

fluid.registerNamespace("gpii.tests.journal");

require("../index.js");

gpii.tests.journal.testSpec = fluid.require("%universal/tests/platform/windows/windows-builtIn-testSpec.js");

gpii.tests.journal.testDef = gpii.tests.windows.builtIn[0]; // The os_win7 entry forms the spine of our test

gpii.loadTestingSupport();
fluid.setLogging(true);

fluid.defaults("gpii.tests.journal.testCaseHolder", {
    gradeNames: "gpii.test.integration.testCaseHolder.windows",
    distributeOptions: {
        "tests.journal.solutionsRegistry": {
            record: {
                namespace: "journalFilter",
                priority: "after:encoding",
                funcName: "gpii.tests.journal.solutionsRegistryFilter"
            },
            target: "{that flowManager solutionsRegistryDataSource}.options.listeners.onRead"
        }
    },
    events: {
        FLUID5931wait: null
    },
    components: {
        mockSettingsHandlers: {
            type: "gpii.tests.integration.mockSettingsHandlerRegistry.journal"
        },
        restoreJournalRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/journal/restore/%journalId",
            }
        }
    }
});

gpii.tests.journal.solutionsRegistryOverlay = {
    "com.microsoft.windows.magnifier": {
        settingsHandlers: {
            explode: {
                type: "gpii.tests.journal.explodingSettingsHandler"
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
    console.log("EXPLODING SETTINGS HANDLER EXECUTING");
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
    // Arbitrarily wait as a result of FLUID5931 bug preventing immediate reconstruction of the server
    fluid.invokeLater(testCaseHolder.events.FLUID5931wait.fire);
};

gpii.tests.journal.stashJournalId = function (component) {
    component.stashedJournalId = ">" + new Date().toISOString();
};

gpii.tests.journal.fixtures = [
    {
        name: "Journal state and restoration",
        expect: 2,
        sequenceSegments: [
            {   func: "gpii.tests.journal.stashJournalId",
                args: "{tests}"
            }, {
                func: "gpii.test.expandSettings",
                args: ["{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onSnapshotComplete",
                listener: "fluid.identity"
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
            kettle.test.startServerSequence, {
                func: "{restoreJournalRequest}.send",
                args: [null, {
                    termMap: {
                        journalId: "{tests}.stashedJournalId"
                    }
                }]
            }, {
                event: "{restoreJournalRequest}.events.onComplete",
                listener: "kettle.test.assertJSONResponse",
                args: {
                    message: "Successful response from journal restoration",
                    string: "{arguments}.0",
                    request: "{restoreJournalRequest}",
                    expected: {}
                }
            },
            //gpii.test.checkSequence
        ]
    }
];

gpii.tests.journal.baseTestDef = {
    name: "Journal Restoration Tests",
    userToken: gpii.tests.journal.testDef.userToken,
    gradeNames: "gpii.tests.journal.testCaseHolder",
    config: {
        configName: gpii.tests.journal.testSpec.configName,
        configPath: gpii.tests.journal.testSpec.configPath
    }
};



kettle.test.bootstrapServer(gpii.test.buildSegmentedFixtures(
        gpii.tests.journal.fixtures, gpii.tests.journal.baseTestDef));
