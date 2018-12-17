"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

require("json5/lib/register");

var fs   = require("fs");
var path = require("path");

require("gpii-json-schema");

var solutionSchema = require("./data/schemas/solution-schema.json5");

jqUnit.module("Sanity checks for all Solutions Registry data.");

fluid.registerNamespace("gpii.tests.universal.solutionsRegistry");

gpii.tests.universal.solutionsRegistry.checkAllSolutions = function (that) {
    var resolvedSrPath = fluid.module.resolvePath(that.options.solutionsRegistryPath);
    var files = fs.readdirSync(resolvedSrPath);
    fluid.each(files, function (filename) {
        // TODO: expand this to other operating systems
        //if (filename.match(/^.+\.json5?$/i)) {
        if (filename.match(/^win32\.json5?$/i)) {
            var filePath = path.resolve(resolvedSrPath, filename);
            var singleFileSolutions = require(filePath);
            fluid.each(singleFileSolutions, function (solutionDef, solutionKey) {
                gpii.tests.universal.solutionsRegistry.checkSingleSolution(filename, solutionKey, solutionDef);
            });
        }
    });
};

gpii.tests.universal.solutionsRegistry.checkSingleSolution = function (filename, solutionKey, solutionDef) {
    jqUnit.test("Checking validity of solution '" + solutionKey + "' in file '" + filename + "'.", function () {
        var validationResults = gpii.schema.validator.validate(solutionDef, solutionSchema);
        jqUnit.assertFalse("There should be no low-level errors attempting to validate the solution entry.", validationResults.isError === true);
        jqUnit.assertTrue("There should be no validation errors in the solution definition.", validationResults.isValid);
        if (!validationResults.isError && !validationResults.isValid) {
            var localisedErrors = gpii.schema.validator.localiseErrors(validationResults.errors, solutionDef);

            fluid.each(localisedErrors, function (singleError) {
                fluid.log("Validation error in solution '" + solutionKey + "' in file '" + filename + "':");
                fluid.log("  - " + singleError.dataPath.join(".") + ": " + singleError.message);
            });
        }
    });

    // TODO: Make a schema for and validate the generic preference settings.

    // TODO: If there are default values, test them against the schema.

    // TODO: Ensuring that all forward and inverse transforms are sane, i.e. that they can at least be used with an empty object.

    // TODO: Ensuring that all references to generic preference settings actually refer to generic preference settings that exist.
};

fluid.defaults("gpii.tests.universal.solutionsRegistry", {
    gradeNames: ["fluid.component"],
    solutionsRegistryPath: "%gpii-universal/testData/solutions",
    genericPreferenceTermsPath: "%gpii-universal/testData/ontologies/flat.json5",
    listeners: {
        "onCreate.checkAllSolutions": {
            funcName: "gpii.tests.universal.solutionsRegistry.checkAllSolutions"
        }
    }
});

gpii.tests.universal.solutionsRegistry();
