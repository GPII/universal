"use strict";
var fluid  = require("infusion");
var gpii   = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

require("json5/lib/register");

var fs   = require("fs");
var path = require("path");

require("gpii-json-schema");

var solutionSchema = require("./data/schemas/solution-schema.json5");

jqUnit.module("Sanity checks for Solutions Registry data.");

fluid.registerNamespace("gpii.tests.universal.solutionsRegistry");

gpii.tests.universal.solutionsRegistry.checkAllSolutions = function (that) {
    var resolvedGenericTermsPath = fluid.module.resolvePath(that.options.genericPreferenceTermsPath);
    var genericTerms = require(resolvedGenericTermsPath);

    var resolvedSrPath = fluid.module.resolvePath(that.options.solutionsRegistryPath);
    var files = fs.readdirSync(resolvedSrPath);
    fluid.each(files, function (filename) {
        // TODO: expand this to other operating systems
        //if (filename.match(/^.+\.json5?$/i)) {
        if (filename.match(/^win32\.json5?$/i)) {
            var filePath = path.resolve(resolvedSrPath, filename);
            var singleFileSolutions = require(filePath);
            fluid.each(singleFileSolutions, function (solutionDef, solutionKey) {
                gpii.tests.universal.solutionsRegistry.checkSingleSolution(filename, solutionKey, solutionDef, genericTerms);
            });
        }
    });

    gpii.tests.universal.solutionsRegistry.validateGenericPreferenceSchemas(genericTerms);
};

// Validate the generic preference settings to confirm that they're at least valid GSS schemas.
gpii.tests.universal.solutionsRegistry.validateGenericPreferenceSchemas = function (genericTerms) {
    jqUnit.test("Validating generic preference terms.", function () {
        fluid.each(genericTerms, function (termDef, termKey) {
            if (termDef.schema) {
                var validationResults = gpii.schema.validator.validateSchema(termDef.schema);

                // We perform these checks a bit flipped so that only a particular value trips it, and not a missing value.
                jqUnit.assertFalse("There should be no validation errors in generic preference term '" + termKey + "'.", validationResults.isValid === false);
                jqUnit.assertFalse("There should be no low-level errors in generic preference term '" + termKey + "'.", validationResults.isError === true);
            }
            else {
                jqUnit.fail("Generic Preference Term '" + termKey + "' has no schema.");
            }
        });
    });
};

gpii.tests.universal.solutionsRegistry.checkSingleSolution = function (filename, solutionKey, solutionDef, genericTerms) {
    jqUnit.test("Sanity-checking solution '" + solutionKey + "' in file '" + filename + "'.", function () {
        gpii.tests.universal.solutionsRegistry.validateSolution(filename, solutionKey, solutionDef);

        gpii.tests.universal.solutionsRegistry.checkCapabilities(filename, solutionKey, solutionDef, genericTerms);

        // TODO: Ensure that all forward and inverse transforms are sane, i.e. that they can at least be used with an empty object.

        // TODO: Ensure that all references to generic preference settings in transforms actually refer to generic preference settings that exist.

        gpii.tests.universal.solutionsRegistry.checkDefaults(filename, solutionKey, solutionDef);
    });

};

gpii.tests.universal.solutionsRegistry.validateSolution = function (filename, solutionKey, solutionDef) {
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
};

// Ensure that all "capabilities" refer to a generic preference setting.
gpii.tests.universal.solutionsRegistry.checkCapabilities = function (filename, solutionKey, solutionDef, genericTerms) {
    if (solutionDef.capabilities && solutionDef.capabilities.length) {
        fluid.each(solutionDef.capabilities, function (capabilityKey) {
            jqUnit.assertTrue("The capability '" + capabilityKey + "' specified in solution '" + solutionKey + "' should exist.", genericTerms[capabilityKey] !== undefined);
        });
    }
    else {
        jqUnit.assert("Entry '" + solutionKey + "' has no capabilities, which is fine.");
    }
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

// If there are default values, test them against the schema.
gpii.tests.universal.solutionsRegistry.checkDefaults = function (filename, solutionKey, solutionDef) {
    fluid.each(solutionDef.settingsHandlers, function (settingsHandler) {
        fluid.each(settingsHandler.supportedSettings, function (supportedSetting, settingKey) {
            // This only works for simple settings, and not for deeply nested objects.
            var defaultValue = fluid.get(supportedSetting, "schema.default");
            if (defaultValue !== undefined) {
                var validationResults = gpii.schema.validator.validate(defaultValue, supportedSetting.schema);
                jqUnit.assertFalse("There should be no low-level errors when validating the default value for setting '" + settingKey + "' in solution '" + solutionKey + "' should be valid according to its own schema.", validationResults.isError === true);
                jqUnit.assertTrue("The default for setting '" + settingKey + "' in solution '" + solutionKey + "' should be valid according to its own schema.", validationResults.isValid);
            }
        });
    });
};

gpii.tests.universal.solutionsRegistry();
