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
        request.docToRemove = thisDoc;
        fluid.log("Will remove ", thisDoc.type, " ", thisDoc._id);
        docsToRemove.push(thisDoc);
    } else {
        fluid.log("Nothing to remove at ", request.options.path);
    }
};

gpii.tests.productionConfigTesting.getPrefsSafeDoc = function (prefsSafeRequest, gpiiKeyRequest) {
    var gpiiKeyToRemove = gpiiKeyRequest.docToRemove;
    if (gpiiKeyToRemove && gpiiKeyToRemove.prefsSafeId) {
        prefsSafeRequest.options.path = "/gpii/" + gpiiKeyToRemove.prefsSafeId;
    } else {
        // This path should force a 404
        prefsSafeRequest.options.path = "/gpii/prefsSafe-" + prefsSafeRequest.options.gpiiKey;
        fluid.log("No Prefs Safe to retrieve for GPII key " + prefsSafeRequest.options.gpiiKey);
    }
    prefsSafeRequest.sendToDatabase();
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
            func: "{getOsGnomeKey}.sendToDatabase"
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
            func: "{getGpiiKeyNoPrefsSafe}.sendToDatabase"
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
            func: "{getClientCredentialSchemaV01}.sendToDatabase"
        }, {
            event: "{getClientCredentialSchemaV01}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialNova}.sendToDatabase"
        }, {
            event: "{getClientCredentialNova}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialFailInIpVerification}.sendToDatabase"
        }, {
            event: "{getClientCredentialFailInIpVerification}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientCredentialFailInAllowedPrefsToWrite}.sendToDatabase"
        }, {
            event: "{getClientCredentialFailInAllowedPrefsToWrite}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove loaded client data
            func: "{getClientOldSchema}.sendToDatabase"
        }, {
            event: "{getClientOldSchema}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientNova}.sendToDatabase"
        }, {
            event: "{getClientNova}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientFailInIpVerification}.sendToDatabase"
        }, {
            event: "{getClientFailInIpVerification}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            func: "{getClientFailInAllowedPrefsToWrite}.sendToDatabase"
        }, {
            event: "{getClientFailInAllowedPrefsToWrite}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion",
            args: ["{arguments}.0", "{arguments}.1", "{that}.docsToRemove"]
        }, {
            // remove the GPII key "nonexistent_gpii_key" and its prefs safe
            func: "{getNonExistentGpiiKey}.sendToDatabase"
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
            func: "{getExtraAccessTokens}.sendToDatabase"
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
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/os_gnome"
            }
        },
        getOsGnomeKeyPrefsSafe: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,
                gpiiKey: "os_gnome"
            }
        },
        getGpiiKeyNoPrefsSafe: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/gpii_key_no_prefs_safe"
            }
        },
        getGpiiKeyNoPrefsSafePrefsSafe: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,
                gpiiKey: "gpii_key_no_prefs_safe"
            }
        },
        getNonExistentGpiiKey: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/nonexistent_gpii_key"
            }
        },
        getNonExistentGpiiKeyPrefsSafe: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                // set at gpii.tests.productionConfigTesting.getPrefsSafeDoc()
                path: null,
                gpiiKey: "nonexistent_gpii_key"
            }
        },
        "getClientCredentialSchemaV01": {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/clientCredential-schemaV0.1"
            }
        },
        getClientCredentialNova: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/clientCredential-nova"
            }
        },
        getClientCredentialFailInIpVerification: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/clientCredential-failInIpVerification"
            }
        },
        getClientCredentialFailInAllowedPrefsToWrite: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/clientCredential-failInAllowedPrefsToWrite"
            }
        },
        getClientOldSchema: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/gpiiAppInstallationClient-schemaV0.1"
            }
        },
        getClientNova: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/gpiiAppInstallationClient-nova"
            }
        },
        getClientFailInIpVerification: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/gpiiAppInstallationClient-nova-failInIpVerification"
            }
        },
        getClientFailInAllowedPrefsToWrite: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/gpiiAppInstallationClient-nova-failInAllowedPrefsToWrite"
            }
        },
        getExtraAccessTokens: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/_design/views/_view/findInfoByAccessToken",
                extraGpiiKeys: gpii.tests.productionConfigTesting.loginGpiiKeys
            }
        },
        deleteInBulk: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/_bulk_docs",
                method: "POST",
                expectedStatusCode: 201
            }
        }
    },
    sequenceGrade: "gpii.tests.productionConfigTesting.deleteRecordsSequence"
}];

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests);
