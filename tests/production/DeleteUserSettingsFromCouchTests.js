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

fluid.defaults("gpii.tests.productionConfigTesting.deleteUserSettings", {
    gradeNames: ["fluid.test.sequenceElement"],
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
            func: "{getGpiiKeyNoPrefsSafe}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getGpiiKeyNoPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.sendPrefsSafeId",
            args: ["{getGpiiKeyNoPrefsSafePrefsSafe}", "{getGpiiKeyNoPrefsSafe}"]
        }, {
            event: "{getGpiiKeyNoPrefsSafePrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            func: "{getNonExistentGpiiKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getNonExistentGpiiKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.sendPrefsSafeId",
            args: ["{getNonExistentGpiiKeyPrefsSafe}", "{getNonExistentGpiiKey}"]
        }, {
            event: "{getNonExistentGpiiKeyPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.bulkDelete",
            args: [
                "{deleteInBulk}",
                [
                    "{getSettingsUserKey}.options.docToRemove",
                    "{getSettingsUserPrefsSafe}.options.docToRemove",
                    "{getGpiiKeyNoPrefsSafe}.options.docToRemove",
                    "{getGpiiKeyNoPrefsSafePrefsSafe}.options.docToRemove",
                    "{getNonExistentGpiiKey}.options.docToRemove",
                    "{getNonExistentGpiiKeyPrefsSafe}.options.docToRemove"
                ]
            ]
        }, {
            event: "{deleteInBulk}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        },
        { funcName: "fluid.log", args: ["Deleted 'user' test prefs safes"]}
    ]
});

fluid.defaults("gpii.tests.productionConfigTesting.deleteRecordsSequence", {
    gradeNames: ["fluid.test.sequence"],
    sequenceElements: {
        deleteRecords: {
            gradeNames: "gpii.tests.productionConfigTesting.deleteUserSettings"
        }
    }
});

// Tests for deleting test 'user' preferences from the database
gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests = [{
    name: "Flow manager production tests - delete test GPII keys and PrefsSafe",
    expect: 7,
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
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getSettingsUserPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/prefsSafe-os_gnome",
                method: "GET",
                gpiiKey: "os_gnome",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getGpiiKeyNoPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpii_key_no_prefs_safe",
                method: "GET",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getGpiiKeyNoPrefsSafePrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",

                // set at gpii.tests.productionConfigTesting.sendPrefsSafeId()
                path: null,

                method: "GET",
                gpiiKey: "gpii_key_no_prefs_safe",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getNonExistentGpiiKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/nonexistent_gpii_key",
                method: "GET",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getNonExistentGpiiKeyPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",

                // set at gpii.tests.productionConfigTesting.sendPrefsSafeId()
                path: null,

                method: "GET",
                gpiiKey: "gpii_key_no_prefs_safe",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
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
    sequenceGrade: "gpii.tests.productionConfigTesting.deleteRecordsSequence"
}];

gpii.tests.productionConfigTesting.sendPrefsSafeId = function (prefsSafeRequest, gpiiKeyRequest) {
    var gpiiKeyToRemove = gpiiKeyRequest.options.docToRemove;
    if (gpiiKeyToRemove && gpiiKeyToRemove.prefsSafeId) {
        prefsSafeRequest.options.path = "/gpii/" + gpiiKeyToRemove.prefsSafeId;
    } else {
        // This path should force a 404
        prefsSafeRequest.options.path = "/gpii/prefsSafe-" + prefsSafeRequest.options.gpiiKey;
        fluid.log("No Prefs Safe to retrieve for GPII key " + prefsSafeRequest.options.gpiiKey);
    }
    prefsSafeRequest.send(null, { port: 5984 });
};

gpii.tests.productionConfigTesting.bulkDelete = function (bulkDeleteRequest, docsToRemove) {
    var bulkDocsArray = { "docs": [] };
    fluid.each(docsToRemove, function (aDocToRemove) {
        if (aDocToRemove) {
            bulkDocsArray.docs.push(aDocToRemove);
        }
    });
    bulkDeleteRequest.send(bulkDocsArray, { port: 5984 });
};

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests);
