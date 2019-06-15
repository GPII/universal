/**
Tests for deleting test gpii keys and 'user' prefs safe.

Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

WARNING:  Do not run these tests directly.  They are called from within the
"vagrantCloudBasedContainers.sh" after it has initialized the environment.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.productionConfigTesting");

require("./ProductionTestsUtils.js");

// Special case list of GPII Keys used by login/logout tests that generate
// extraneous access tokens that need to be removed after the tests are done.
gpii.tests.productionConfigTesting.loginGpiiKeys = [
    "testUser1", "nonexistent_gpii_key"
];

fluid.defaults("gpii.tests.productionConfigTesting.deleteUserSettings", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Delete 'user' test prefs safes tests:"]},
        {
            func: "{getSettingsUserKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getSettingsUserKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            func: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getSettingsUserPrefsSafe}", "{getSettingsUserKey}" ]
        }, {
            event: "{getSettingsUserPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            func: "{getGpiiKeyNoPrefsSafe}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getGpiiKeyNoPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getGpiiKeyNoPrefsSafePrefsSafe}", "{getGpiiKeyNoPrefsSafe}"]
        }, {
            event: "{getGpiiKeyNoPrefsSafePrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            func: "{getNonExistentGpiiKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getNonExistentGpiiKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getNonExistentGpiiKeyPrefsSafe}", "{getNonExistentGpiiKey}"]
        }, {
            event: "{getNonExistentGpiiKeyPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion"
        }, {
            func: "{getExtraAccessTokens}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getExtraAccessTokens}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetExtraAccessTokens"
        }, {
            funcName: "gpii.tests.productionConfigTesting.deleteAllExtraRecords",
            args: [
                "{deleteInBulk}",
                [
                    "{getSettingsUserKey}.options.docToRemove",
                    "{getSettingsUserPrefsSafe}.options.docToRemove",
                    "{getGpiiKeyNoPrefsSafe}.options.docToRemove",
                    "{getGpiiKeyNoPrefsSafePrefsSafe}.options.docToRemove",
                    "{getNonExistentGpiiKey}.options.docToRemove",
                    "{getNonExistentGpiiKeyPrefsSafe}.options.docToRemove"
                ],
                "{getExtraAccessTokens}.options.tokensToRemove"
            ]
        }, {
            event: "{deleteInBulk}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        }, {
            funcName: "fluid.log",
            args: ["Deleted 'user' test prefs safes and login tests' access tokens"]
        }
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
    expect: 8,
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

                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,

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

                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
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

                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,

                method: "GET",
                gpiiKey: "gpii_key_no_prefs_safe",
                expectedStatusCodes: [200, 404],
                docToRemove: null       // set by successful request.
            }
        },
        getExtraAccessTokens: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/_design/views/_view/findInfoByAccessToken",
                method: "GET",
                expectedStatusCodes: [200, 404],
                extraGpiiKeys: gpii.tests.productionConfigTesting.loginGpiiKeys,
                tokensToRemove: []       // set by successful request.
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

gpii.tests.productionConfigTesting.getPrefsSafeDoc = function (prefsSafeRequest, gpiiKeyRequest) {
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

gpii.tests.productionConfigTesting.deleteAllExtraRecords = function (bulkDeleteRequest, docsToRemove, loginTokensToRemove) {
    var allDocsToRemove = docsToRemove.concat(loginTokensToRemove);
    gpii.tests.productionConfigTesting.bulkDelete(bulkDeleteRequest, allDocsToRemove);
};

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests);
