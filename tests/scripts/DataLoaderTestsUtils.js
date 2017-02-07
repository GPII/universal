/**
GPII Data Loader Tests Utils

Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii");

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

/**
 * The utility function that uses regex to compare whether a string or each string in an given array
 * match the regex pattern provided in the expected string or array.
 * @param toCompare {String|Array} A string or an array of strings to be compared
 * @param expectedMatches {String|Array} A string or an array of regex patterns to be matched
 * @return {Boolean} true if all strings in the toCompare match regex patterns in expectedMatches in order, otherwise, return false.
 */
gpii.tests.dataLoader.verifyMatches = function (toCompare, expectedMatches) {
    toCompare = fluid.makeArray(toCompare);
    expectedMatches = fluid.makeArray(expectedMatches);

    var matched = [];
    fluid.each(toCompare, function (one, i) {
        var matchResult = one.match(expectedMatches[i]);
        if (matchResult && matchResult.length > 0) {
            matched.push(one);
        }
    });

    return toCompare.length === matched.length;
};
