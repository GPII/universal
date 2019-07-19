/*
 * GPII Flow Manager Development Tests
 *
 * Copyright 2013 OCAD University
 * Copyright 2019 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
require("./shared/DevelopmentTestDefs.js");

gpii.loadTestingSupport();

gpii.tests.development.buildTestDefs = function (testDefs) {
    return fluid.transform(testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.config.development.local",
                configPath: "%gpii-universal/gpii/configs/shared"
            }
        });

        return testDef;
    });
};

// With all-in-local config, nonexistent GPII keys are able to key in and key out.
// Note that with untrusted config, nonexistent GPII keys can only key in with client credentials that have privilege
// to create nonexistent GPII keys and prefs safes.
gpii.tests.development.nonexistentKeyInTestDefs = [{
    name: "Flow Manager test: Key in and key out with a nonexistent GPII key",
    expect: 2,
    gpiiKey: "nonexistent_gpii_key",
    sequenceGrade: "gpii.tests.development.commonTestSequence"
}];

gpii.test.runCouchTestDefs(gpii.tests.development.buildTestDefs(gpii.tests.development.testDefs));
gpii.test.runCouchTestDefs(gpii.tests.development.buildTestDefs(gpii.tests.development.nonexistentKeyInTestDefs));
