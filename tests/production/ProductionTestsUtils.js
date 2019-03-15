/**
Common data and code shared among the production configuration tests.

Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
fluid.registerNamespace("gpii.tests.productionConfigTesting");

gpii.tests.productionConfigTesting.config = {
    configName: "gpii.tests.untrusted.production.config",
    configPath: "%gpii-universal/tests/configs"
};

// Grade for "disruptions" that are also proper sequence grades.  Use the
// standard server sequence
fluid.defaults("gpii.test.disruption.settings.sequenceGrade", {
    gradeNames: ["gpii.test.disruption", "gpii.test.standardServerSequenceGrade"]
});

gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile = function (filePath, id) {
    var dataArray = fluid.require(filePath);
    return fluid.find(dataArray, function (anEntry) {
        if (anEntry._id === id) {
            return anEntry;
        }
    }, null);
};

gpii.tests.productionConfigTesting.gpiiKeyNoPrefsSafe =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "%gpii-universal/tests/data/dbData/gpiiKeys.json",
        "gpii_key_no_prefs_safe"
    );

gpii.tests.productionConfigTesting.settingsUserKey =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "%gpii-universal/build/tests/dbData/gpiiKeys.json",
        "os_gnome"
    );

gpii.tests.productionConfigTesting.settingsUserPrefsSafe =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "%gpii-universal/build/tests/dbData/prefsSafes.json",
        "prefsSafe-os_gnome"
    );

gpii.tests.productionConfigTesting.prefsUpdate = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/setting1": 12
            }
        }
    }
};

gpii.tests.productionConfigTesting.testStatusCode = function (data, request) {
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        request.options.expectedStatusCode, request.nativeResponse.statusCode
    );
};

gpii.tests.productionConfigTesting.testAddedToDatabase = function (data, request) {
    var expected = request.options.expectedStatusCodes;
    var actual = request.nativeResponse.statusCode;
    jqUnit.assertNotEquals(
        "Adding record to database using " + request.options.path +
        ", status: " + actual,
        expected.indexOf(actual), -1
    );
    // Store the added record's id and rev
    if (actual === 201 || actual === 200) {
        request.options.result = JSON.parse(data);
        fluid.log(request.options.result);
    }
};

gpii.tests.productionConfigTesting.testResponse = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    jqUnit.assertDeepEq(
        "Checking paylod of " + request.options.path,
        request.options.expectedPayload, JSON.parse(data)
    );
};

gpii.tests.productionConfigTesting.testGetThenSaveDocForDeletion = function (data, request) {
    var expected = request.options.expectedStatusCodes;
    var actual = request.nativeResponse.statusCode;
    jqUnit.assertNotEquals(
        "Deleting record from database using " + request.options.path +
        ", status: " + actual,
        expected.indexOf(actual), -1
    );
    // Mark and store the to-be-deleted record
    if (actual === 201 || actual === 200) {
        request.options.docToRemove = JSON.parse(data);
        request.options.docToRemove._deleted = true;
        fluid.log("Will remove ", request.options.docToRemove.type, " ", request.options.docToRemove._id);
    } else {
        fluid.log("Nothing to remove at ", request.options.path);
    }
};
