/**
Tests for deleting  test gpii keys and 'user' prefs safe.

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

require("./Common.js");

// Tests for deleting test 'user' preferences from the database
gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests = [{
    name: "Flow manager production tests - delete test GPII keys and PrefsSafe",
    expect: 4,
    config: gpii.tests.productionConfigTesting.config,
    gradeNames: ["gpii.test.common.testCaseHolder"],
    components: {
        getSettingsUserKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/os_gnome",
                method: "GET",
                expectedStatusCodes: [200],
                docToRemove: null    // set by successful request.
            }
        },
        getSettingsUserPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/prefsSafe-os_gnome",
                method: "GET",
                expectedStatusCodes: [200],
                docToRemove: null    // set by successful request.
            }
        },
        getChromeAndFirefoxKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpii_key_no_prefs_safe",
                method: "GET",
                expectedStatusCodes: [200],
                docToRemove: null    // set by successful request.
            }
        },
        deleteInBulk: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/_bulk_docs",
                method: "POST",
                expectedStatusCode: 201
            }
        }
    },
    sequence: [
        { funcName: "fluid.log", args: ["Delete 'user' test prefs safes tests:"]},
        {
            func: "{getSettingsUserKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getSettingsUserKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            func: "{getSettingsUserPrefsSafe}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getSettingsUserPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            func: "{getChromeAndFirefoxKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getChromeAndFirefoxKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            func: "{deleteInBulk}.send",
            args: [
                {"docs": [
                    "{getSettingsUserKey}.options.docToRemove",
                    "{getSettingsUserPrefsSafe}.options.docToRemove",
                    "{getChromeAndFirefoxKey}.options.docToRemove"
                ]},
                { port: "5984" }
            ]
        }, {
            event: "{deleteInBulk}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        },
        { funcName: "fluid.log", args: ["Deleted 'user' test prefs safes"]}
    ]
}];

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests);
