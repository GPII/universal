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

gpii.tests.productionConfigTesting.clientCredentials = [
    "clientCredential-1",
    "clientCredential-schemaV0.1",
    "clientCredential-nova",
    "clientCredential-failInIpVerification",
    "clientCredential-failInAllowedPrefsToWrite"
];

gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion = function (data, request, docsToRemove) {
    gpii.tests.productionConfigTesting.testStatusCodes(request);
    // Mark and store the to-be-deleted record
    if (request.nativeResponse.statusCode === 201 || request.nativeResponse.statusCode === 200) {
        var thisDoc = JSON.parse(data);
        thisDoc._deleted = true;
        // saved for the furthur use in getPrefsSafeDoc() for getting corresponding prefs safe of this GPII key
        request.options.docToRemove = thisDoc;
        fluid.log("Will remove ", thisDoc.type, " ", thisDoc._id);
        docsToRemove.push(thisDoc);
    } else {
        fluid.log("Nothing to remove at ", request.options.path);
    }
};

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

gpii.tests.productionConfigTesting.testGetExtraAccessTokens = function (data, accessTokensRequest, docsToRemove) {
    gpii.tests.productionConfigTesting.testStatusCodes(accessTokensRequest);
    var tokens = JSON.parse(data);
    if (tokens.rows) {
        fluid.each(tokens.rows, function (aRow) {
            fluid.each(accessTokensRequest.options.extraGpiiKeys, function (extraGpiiKey) {
                var aToken = aRow.value.authorization;
                if (aToken.gpiiKey === extraGpiiKey && gpii.tests.productionConfigTesting.clientCredentials.includes(aToken.clientCredentialId)) {
                    aToken._deleted = true;
                    docsToRemove.push(aToken);
                    fluid.log("Will remove ", aToken.type, " for ", aToken.gpiiKey);
                }
            });
        });
    } else {
        fluid.log("No access tokens to remove");
    }
};

fluid.defaults("gpii.tests.productionConfigTesting.deleteUserSettings", {
    gradeNames: ["fluid.test.sequenceElement"],
    members: {
        docsToRemove: []  // collect documents to be removed at the end via /_bulk_docs
    },
    sequence: [
        { funcName: "fluid.log", args: ["Deleting extra loaded data and access tokens generated during test runs:"]},
        {
            // remove the loaded GPII key "os_gnome" and its prefs safe
            func: "{getOsGnomeKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getOsGnomeKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getOsGnomeKeyPrefsSafe}", "{getOsGnomeKey}" ]
        }, {
            event: "{getOsGnomeKeyPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove the GPII key "gpii_key_no_prefs_safe" and its generated prefs safe
            func: "{getGpiiKeyNoPrefsSafe}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getGpiiKeyNoPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            funcName: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getGpiiKeyNoPrefsSafePrefsSafe}", "{getGpiiKeyNoPrefsSafe}"]
        }, {
            event: "{getGpiiKeyNoPrefsSafePrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove loaded client credential data
            func: "{getClientCredentialSchemaV01}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientCredentialSchemaV01}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialNova}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientCredentialNova}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialFailInIpVerification}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientCredentialFailInIpVerification}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialFailInAllowedPrefsToWrite}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientCredentialFailInAllowedPrefsToWrite}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove loaded client data
            func: "{getClientOldSchema}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientOldSchema}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientNova}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientNova}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientFailInIpVerification}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientFailInIpVerification}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientFailInAllowedPrefsToWrite}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getClientFailInAllowedPrefsToWrite}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove the GPII key "nonexistent_gpii_key" and its prefs safe
            func: "{getNonExistentGpiiKey}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getNonExistentGpiiKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            funcName: "gpii.tests.productionConfigTesting.getPrefsSafeDoc",
            args: ["{getNonExistentGpiiKeyPrefsSafe}", "{getNonExistentGpiiKey}"]
        }, {
            event: "{getNonExistentGpiiKeyPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove access tokens generated during all test runs
            func: "{getExtraAccessTokens}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getExtraAccessTokens}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetExtraAccessTokens",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // delete all loaded test data and data generated during all test runs via /_bulk_docs
            funcName: "gpii.tests.productionConfigTesting.bulkDelete",
            args: ["{deleteInBulk}", "{that}.docsToRemove"]
        }, {
            event: "{deleteInBulk}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        }, {
            funcName: "fluid.log",
            args: ["Deleted extra loaded data and access tokens generated during test runs"]
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
    name: "Flow manager production tests - delete extra loaded data and access tokens generated during test runs",
    expect: 16,
    config: gpii.tests.productionConfigTesting.config,
    gradeNames: ["gpii.test.common.testCaseHolder"],
    components: {
        getOsGnomeKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/os_gnome",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getOsGnomeKeyPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",

                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,

                method: "GET",
                gpiiKey: "os_gnome",
                expectedStatusCodes: [200, 404]
            }
        },
        getGpiiKeyNoPrefsSafe: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpii_key_no_prefs_safe",
                method: "GET",
                expectedStatusCodes: [200, 404]
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
                expectedStatusCodes: [200, 404]
            }
        },
        getNonExistentGpiiKey: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/nonexistent_gpii_key",
                method: "GET",
                expectedStatusCodes: [200, 404]
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
                gpiiKey: "nonexistent_gpii_key",
                expectedStatusCodes: [200, 404]
            }
        },
        "getClientCredentialSchemaV01": {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/clientCredential-schemaV0.1",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientCredentialNova: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/clientCredential-nova",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientCredentialFailInIpVerification: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/clientCredential-failInIpVerification",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientCredentialFailInAllowedPrefsToWrite: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/clientCredential-failInAllowedPrefsToWrite",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientOldSchema: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpiiAppInstallationClient-schemaV0.1",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientNova: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpiiAppInstallationClient-nova",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientFailInIpVerification: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpiiAppInstallationClient-nova-failInIpVerification",
                method: "GET",
                expectedStatusCodes: [200, 404]
            }
        },
        getClientFailInAllowedPrefsToWrite: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/gpiiAppInstallationClient-nova-failInAllowedPrefsToWrite",
                method: "GET",
                expectedStatusCodes: [200, 404]
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
                extraGpiiKeys: gpii.tests.productionConfigTesting.loginGpiiKeys
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

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests);
