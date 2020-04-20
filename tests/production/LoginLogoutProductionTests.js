/**
GPII Production Config tests - Login/Logout process

Requirements:
* an internet connection
* a cloud based flow manager
* a preferences server
* a CouchDB server

---

Copyright 2015 Raising the Floor - International
Copyright 2018-2020 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

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

require("../shared/DevelopmentTestDefs.js");
require("./ProductionTestsUtils.js");

/** Flowmanager tests for the key in and key out processes:
 * /user/%gpiiKey/login and /user/%gpiiKey/logout (as defined in gpii.tests.development.testDefs),
 *
 * Note: When Local Flow Manager starts, it now fetches Solution Registry and default settings file from remote URLs.
 * This test needs to ensure the keyin/keyout test sequence starts when LFM is ready and noUser has been keyed into
 * the system. To accomplish it, a special testEnvironment component is created to define an aggregate event
 * "onSystemReady"that will be fired when:
 * 1. The test server has been constructed;
 * 2. The local flow manager initial actions have completed and is ready to process login/logout requests.
 * The keyin/keyout test sequence will wait until "onSystemReady" is fired.
 */

fluid.defaults("gpii.tests.productionConfigTesting.loginLogoutSequence", {
    gradeNames: ["gpii.test.standardServerSequenceGrade"],
    sequenceElements: {
        loginLogout: {
            gradeNames: "gpii.tests.development.loginLogout",
            priority: "after:startServer"
        }
    }
});

gpii.tests.productionConfigTesting.keyInKeyOutTestDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        config: gpii.tests.productionConfigTesting.config,
        testEnvironmentGrade: "gpii.tests.productionConfigTesting.testEnvironment",
        sequenceGrade: "gpii.tests.productionConfigTesting.loginLogoutSequence"
    });
    return testDef;
});

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.keyInKeyOutTestDefs);
