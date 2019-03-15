/**
Tests for adding test gpii keys and 'user' prefs safe.

Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.productionConfigTesting");

require("./ProductionTestsUtils.js");

// Tests that add 'user' preferences to the data base
fluid.defaults("gpii.tests.productionConfigTesting.addUserSettings", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Add 'user' test prefs safes tests:"]},
        {
            func: "{addSettingsUserKey}.send",
            args: [
                gpii.tests.productionConfigTesting.settingsUserKey,
                { port: "5984" }
            ]
        }, {
            event: "{addSettingsUserKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
        }, {
            func: "{addSettingsUserPrefsSafe}.send",
            args: [
                gpii.tests.productionConfigTesting.settingsUserPrefsSafe,
                { port: "5984" }
            ]
        }, {
            event: "{addSettingsUserPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
        },
        {
            func: "{addGpiiKeyNoPrefsSafe}.send",
            args: [
                gpii.tests.productionConfigTesting.gpiiKeyNoPrefsSafe,
                { port: "5984" }
            ]
        },
        {
            event: "{addGpiiKeyNoPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
        },
        { funcName: "fluid.log", args: ["Added 'user' test prefs safe"]}
    ]
});

fluid.defaults("gpii.tests.productionConfigTesting.addRecordsSequence", {
    gradeNames: ["fluid.test.sequence"],
    sequenceElements: {
        addRecords: {
            gradeNames: "gpii.tests.productionConfigTesting.addUserSettings"
        }
    }
});

gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests = [{
    name: "Flow manager production tests - add test GPII keys and PrefsSafe",
    expect: 3,
    config: gpii.tests.productionConfigTesting.config,
    components: {
        addSettingsUserKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                expectedStatusCodes: [201, 409]  // created or already exists
            }
        },
        addSettingsUserPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                expectedStatusCodes: [201, 409]  // created or already exists
            }
        },
        addGpiiKeyNoPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                expectedStatusCodes: [201, 409]  // created or already exists
            }
        }
    },
    sequenceGrade: "gpii.tests.productionConfigTesting.addRecordsSequence"
}];

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests);
