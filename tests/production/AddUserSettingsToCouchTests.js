/**
GPII Production Config tests

Requirements:
* an internet connection
* a CouchDB server

---
Tests for adding test (temporary) gpii keys and 'user' prefs safe.

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
fluid.registerNamespace("gpii.test.cloudBased.oauth2");

require("./Common.js");

// Tests that add 'user' preferences to the data base
gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests = [{
    testDef: {
        name: "Flow manager production tests - add test GPII keys and PrefsSafe",
        expect: 3,
        config: gpii.tests.productionConfigTesting.config,
        gradeNames: ["gpii.test.common.testCaseHolder"],
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
        }
    },
    disruptions: [{
        gradeName: "gpii.tests.productionConfigTesting.addTestRecordsToDatabase"
    }]
}];

fluid.defaults("gpii.tests.productionConfigTesting.addTestRecordsToDatabase", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.productionConfigTesting.addTestRecordsToDatabase.sequence"
});

gpii.tests.productionConfigTesting.addTestRecordsToDatabase.sequence = [
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
    }
];

fluid.each(gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.productionConfigTesting.config,
        "gpii.test.cloudBased.oauth2.testCaseHolder"
    );
});
