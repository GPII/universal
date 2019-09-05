/**
Tests for adding test gpii keys and 'user' prefs safe.

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

gpii.tests.productionConfigTesting.getDataFromFileById = function (locations) {
    var resultDocs = [];
    fluid.each(locations, function (oneFile) {
        var dataArray = fluid.require(oneFile.filePath);
        var ids = fluid.makeArray(oneFile.ids);
        fluid.each(dataArray, function (anEntry) {
            if (ids.includes(anEntry._id)) {
                resultDocs.push(anEntry);
            }
        });
    });
    return {
        "docs": resultDocs
    };
};

gpii.tests.productionConfigTesting.extraTestData = gpii.tests.productionConfigTesting.getDataFromFileById([
    {
        filePath: "%gpii-universal/tests/data/dbData/gpiiKeys.json",
        ids: "gpii_key_no_prefs_safe"
    }, {
        filePath: "%gpii-universal/build/tests/dbData/gpiiKeys.json",
        ids: "os_gnome"
    }, {
        filePath: "%gpii-universal/build/tests/dbData/prefsSafes.json",
        ids: "prefsSafe-os_gnome"
    }, {
        filePath: "%gpii-universal/tests/data/dbData/gpiiAppInstallationClients.json",
        ids: [
            "gpiiAppInstallationClient-schemaV0.1",
            "gpiiAppInstallationClient-nova",
            "gpiiAppInstallationClient-nova-failInIpVerification",
            "gpiiAppInstallationClient-nova-failInAllowedPrefsToWrite"
        ]
    }, {
        filePath: "%gpii-universal/tests/data/dbData/clientCredentials.json",
        ids: [
            "clientCredential-schemaV0.1",
            "clientCredential-nova",
            "clientCredential-failInIpVerification",
            "clientCredential-failInAllowedPrefsToWrite"
        ]
    }
]);

fluid.log(gpii.tests.productionConfigTesting.extraTestData);

// Tests that add extra documents for tests to the database
fluid.defaults("gpii.tests.productionConfigTesting.addExtraDocs", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Adding extra test data..."]},
        {
            func: "{addInBulk}.send",
            args: [
                gpii.tests.productionConfigTesting.extraTestData,
                { port: gpii.tests.productionConfigTesting.couchdbUrl.port }
            ]
        }, {
            event: "{addInBulk}.events.onComplete",
            listener: "jqUnit.assertEquals",
            args: ["Add extra test documents to database", "{addInBulk}.options.expectedStatusCode", "{addInBulk}.nativeResponse.statusCode"]
        },
        { funcName: "fluid.log", args: ["Added extra test data."]}
    ]
});

fluid.defaults("gpii.tests.productionConfigTesting.addRecordsSequence", {
    gradeNames: ["fluid.test.sequence"],
    sequenceElements: {
        addRecords: {
            gradeNames: "gpii.tests.productionConfigTesting.addExtraDocs"
        }
    }
});

gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests = [{
    name: "Flow manager production tests - add test GPII keys and PrefsSafe",
    expect: 1,
    config: gpii.tests.productionConfigTesting.config,
    components: {
        addInBulk: {
            type: "gpii.tests.productionConfigTesting.dataBaseRequest",
            options: {
                path: "/gpii/_bulk_docs",
                method: "POST",
                expectedStatusCode: 201
            }
        }
    },
    sequenceGrade: "gpii.tests.productionConfigTesting.addRecordsSequence"
}];

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests);
