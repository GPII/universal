/**
GPII Data Loader Tests Utils

Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

//require("./js/DataStoreTestsUtils.js");

fluid.defaults("gpii.tests.dataLoader.baseTestCaseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    sequenceEnd: [{
        func: "{gpii.test.pouch.environment}.events.onCleanup.fire"
    }, {
        event:    "{gpii.test.pouch.environment}.events.onCleanupComplete",
        listener: "fluid.log",
        args:     ["Database cleanup complete"]
    }]
});
