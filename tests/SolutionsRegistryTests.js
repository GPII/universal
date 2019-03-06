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

gpii.tests.universal.solutionsRegistry.checkAll = function (that) {
    // Load the "generic preference terms" for the next two tests suites.
    var resolvedGenericTermsPath = fluid.module.resolvePath(that.options.genericPreferenceTermsPath);
    var genericTerms = require(resolvedGenericTermsPath);

    // Check the platform-specific solutions files.
    gpii.tests.universal.solutionsRegistry.checkSolutionsFiles(that, genericTerms);

    // Check the schemas of generic preference terms.
    gpii.tests.universal.solutionsRegistry.validateGenericPreferenceSchemas(genericTerms);

    // preference set checker for test data.
    gpii.tests.universal.solutionsRegistry.validateSettingsDir(that);

    // TODO: Validation for middleware endpoints.
};

gpii.tests.universal.solutionsRegistry.checkSolutionsFiles = function (that) {
    var resolvedGenericTermsPath = fluid.module.resolvePath(that.options.genericPreferenceTermsPath);
    var genericTerms             = require(resolvedGenericTermsPath);

    var resolvedSrPath = fluid.module.resolvePath(that.options.solutionsRegistryPath);
    var files          = fs.readdirSync(resolvedSrPath);
    fluid.each(files, function (filename) {
        if (filename.match(/^.+\.json5?$/i)) {
            var filePath            = path.resolve(resolvedSrPath, filename);
            var singleFileSolutions = require(filePath);
            fluid.each(singleFileSolutions, function (solutionDef, solutionKey) {
                gpii.tests.universal.solutionsRegistry.checkSingleSolution(filename, solutionKey, solutionDef, genericTerms);
            });
        }
    });
};

gpii.tests.universal.solutionsRegistry.checkSingleSolution = function (filename, solutionKey, solutionDef, genericTerms) {
    jqUnit.test("Sanity-checking solution '" + solutionKey + "' in file '" + filename + "'.", function () {
        var isSolutionValid = gpii.tests.universal.solutionsRegistry.validateSinglePayload(
            solutionDef,
            solutionSchema,
            "solution file '" + filename + "' -> solution '" + solutionKey + "'"
        );
        jqUnit.assertTrue("Solution '" + solutionKey + "' in file '" + filename + "' should have a valid schema.", isSolutionValid);

        gpii.tests.universal.solutionsRegistry.checkDefaults(filename, solutionKey, solutionDef);
        gpii.tests.universal.solutionsRegistry.checkCapabilities(filename, solutionKey, solutionDef, genericTerms);

        // TODO: Ensure that all forward and inverse transforms are sane, i.e. that they can at least be used with an empty object.
        // TODO: Ensure that all references to generic preference settings in transforms actually refer to generic preference settings that exist.
        // Discuss with Antranig how best to accomplish these checks, i.e. how much in the way of resolvers, etc. do we
        // actually need to meaningfully sanity check transforms?
    });

};

// Ensure that all "capabilities" refer to a generic preference setting.
gpii.tests.universal.solutionsRegistry.checkCapabilities = function (filename, solutionKey, solutionDef, genericTerms) {
    if (solutionDef.capabilities && solutionDef.capabilities.length) {
        fluid.each(solutionDef.capabilities, function (capabilityKey) {
            var unescapedKey = capabilityKey.replace(/\\/g, "");
            var termDef  = genericTerms[unescapedKey];
            jqUnit.assertTrue("The capability '" + capabilityKey + "' specified in solution '" + solutionKey + "' should exist.", termDef !== undefined);
        });
    }
    else {
        jqUnit.assert("Entry '" + solutionKey + "' has no capabilities, which is fine.");
    }
};

// If there are default values, test them against the schema.
gpii.tests.universal.solutionsRegistry.checkDefaults = function (filename, solutionKey, solutionDef) {
    var fileErrors = 0;
    fluid.each(solutionDef.settingsHandlers, function (settingsHandler) {
        fluid.each(settingsHandler.supportedSettings, function (supportedSetting, settingKey) {
            if (supportedSetting.schema) {
                // This only works for simple settings, and not for deeply nested objects.
                var defaultValue = fluid.get(supportedSetting, "schema.default");
                if (defaultValue !== undefined) {
                    var isValid = gpii.tests.universal.solutionsRegistry.validateSinglePayload(
                        defaultValue,
                        supportedSetting.schema,
                        "default value for " + filename + " -> " + solutionKey + " -> " + settingKey
                    );
                    if (!isValid) {
                        fileErrors++;
                    }
                }
            }
            else {
                fluid.log("WARNING: Solution '" + solutionKey + "' lacks a schema for setting '" + settingKey + "'.  This will be disallowed in the future.");
            }
        });
    });
    jqUnit.assertEquals("There should be no validation errors in solutions registry file '" + filename + "'.", 0, fileErrors);
};

// Validate the generic preference settings to confirm that they're at least valid GSS schemas.
gpii.tests.universal.solutionsRegistry.validateGenericPreferenceSchemas = function (genericTerms) {
    jqUnit.test("Validating generic preference terms.", function () {
        fluid.each(genericTerms, function (termDef, termKey) {
            if (termDef.schema) {
                var schemaAsGss = fluid.merge({}, { "$schema": "gss-v7-full#" }, termDef.schema);
                // Separate check here as we are only validating the schema itself.  In theory, this is already hit for
                // any settings in our test data set, but we do it explicitly for all schemas here.
                var validationResults = gpii.schema.validator.validateSchema(schemaAsGss);

                // We perform these checks a bit flipped so that only a particular value trips it, and not a missing value.
                jqUnit.assertFalse("There should be no validation errors in generic preference term '" + termKey + "'.", validationResults.isValid === false);
                jqUnit.assertFalse("There should be no low-level errors in generic preference term '" + termKey + "'.", validationResults.isError === true);

                if (!validationResults.isError && !validationResults.isValid) {
                    var localisedErrors = gpii.schema.validator.localiseErrors(validationResults.errors, schemaAsGss);

                    fluid.each(localisedErrors, function (singleError) {
                        fluid.log("Validation error is as folows:");
                        fluid.log("  - " + singleError.dataPath.join(".") + ": " + singleError.message);
                    });
                }
            }
            else {
                jqUnit.fail("Generic Preference Term '" + termKey + "' has no schema.");
            }
        });
    });
};

/**
 *
 * A function to "index" all settings data across all OS-specific solutions as well as "generic preferences".  The
 * "index object" will be keyed by solution.  In the case of SR data, each entry will contain multiple settings
 * definitions, keyed by setting key. In the case of the "generic preferences", the "solution" will already be a single
 * setting definition.
 *
 * @param {Object} that - The test component itself, which has options for the locations of the required data.
 * @return {Object} An "index object" (see above).
 *
 */

gpii.tests.universal.solutionsRegistry.indexAllSettings = function (that) {
    var indexObject = {};
    var resolvedSrPath = fluid.module.resolvePath(that.options.solutionsRegistryPath);

    var srFiles = fs.readdirSync(resolvedSrPath);
    fluid.each(srFiles, function (filename) {
        if (filename.match(/^.+\.json5?$/i)) {
            var srFilePath = path.resolve(resolvedSrPath, filename);
            var srData = require(srFilePath);
            gpii.tests.universal.solutionsRegistry.indexSrEntries(indexObject, srData);
        }
    });
    var genericTermsPath = fluid.module.resolvePath(that.options.genericPreferenceTermsPath);
    var genericTermsData = require(genericTermsPath);

    gpii.tests.universal.solutionsRegistry.indexGenericPreferences(indexObject, genericTermsData);

    return indexObject;
};

gpii.tests.universal.solutionsRegistry.indexGenericPreferences = function (indexObject, genericTermsData) {
    fluid.each(genericTermsData, function (settingDef, settingKey) {
        gpii.tests.universal.solutionsRegistry.indexSingleSolution(indexObject, [settingKey], settingDef);
    });
};

gpii.tests.universal.solutionsRegistry.indexSrEntries = function (indexObject, srData) {
    fluid.each(srData, function (solutionDef, solutionKey) {
        fluid.each(solutionDef.settingsHandlers, function (settingsHandler) {
            fluid.each(settingsHandler.supportedSettings, function (settingDef, settingKey) {
                gpii.tests.universal.solutionsRegistry.indexSingleSolution(indexObject, [solutionKey, settingKey], settingDef);
            });
        });
    });
};

gpii.tests.universal.solutionsRegistry.indexSingleSolution = function (indexObject, pathToSetting, settingDef) {
    var existingEntry = fluid.get(indexObject, pathToSetting);
    if (existingEntry) {
        existingEntry.push(settingDef);
    }
    else {
        fluid.set(indexObject, pathToSetting, [settingDef]);
    }
};

gpii.tests.universal.solutionsRegistry.validateSettingsDir = function (that) {
    jqUnit.test("Validating preferences test data.", function () {
        var settingsIndex = gpii.tests.universal.solutionsRegistry.indexAllSettings(that);

        var resolvedPath = fluid.module.resolvePath(that.options.settingsDataPath);
        var pathFiles = fs.readdirSync(resolvedPath);
        var jsonFiles = pathFiles.filter(function (singlePath) { return singlePath.match(/.json5?$/i); });
        var pathedJsonFiles = fluid.transform(jsonFiles, function (jsonFile) {
            return path.resolve(resolvedPath, jsonFile);
        });
        fluid.each(pathedJsonFiles, function (settingsFilePath) {
            gpii.tests.universal.solutionsRegistry.validateSettingsFile(that, settingsFilePath, settingsIndex);
        });
    });
};

gpii.tests.universal.solutionsRegistry.validateSettingsFile = function (that, settingsFilePath, settingsIndex) {
    var settingsSchema = require("./data/schemas/settings-schema.json5");

    var settingsData = {};
    try {
        settingsData = require(settingsFilePath);
    }
    catch (error) {
        jqUnit.fail("There should not be any invalid settings files (failed checking '" + settingsFilePath + "'.");
        fluid.log(error);
    }

    // Validate each file using a new "settings payload" schema.
    var settingsFileIsValid = gpii.tests.universal.solutionsRegistry.validateSinglePayload(
        settingsData,
        settingsSchema,
        "settings file '" + settingsFilePath + "'"
    );
    jqUnit.assertTrue("The settings file itself should match the schema for all settings files.", settingsFileIsValid);

    var preferences = fluid.get(settingsData, ["flat", "contexts", "gpii-default", "preferences"]);
    var fileErrors = 0;
    fluid.each(preferences, function (preferencePayload, preferenceKey) {
        // "generic preference term", which are "shallow", i.e. a single value.
        if (preferenceKey.indexOf("http://registry.gpii.net/common/") === 0) {
            var settingsDefs = settingsIndex[preferenceKey];

            fluid.each(settingsDefs, function (settingsDef) {
                var isValid = gpii.tests.universal.solutionsRegistry.validateSinglePayload(
                    preferencePayload,
                    settingsDef.schema,
                    "settings file " + settingsFilePath + " -> " + preferenceKey
                );

                if (!isValid) {
                    fileErrors++;
                }
            });
        }
        // "SR" preferences, which are "deep", i.e. multiple key:value pairs per solution.
        else {
            fluid.each(preferencePayload, function (prefValue, prefKey) {
                var solutionKey = preferenceKey.replace("http://registry.gpii.net/applications/", "");
                var settingsLabel = "settings file " + settingsFilePath + " -> " + solutionKey + " -> " + prefKey;
                var settingsDefs = fluid.get(settingsIndex, [solutionKey, prefKey]);

                if (!settingsDefs || settingsDefs.length === 0)  {
                    fluid.log("WARNING, setting found that does not correspond to a known setting: " + settingsLabel);
                }

                fluid.each(settingsDefs, function (settingsDef) {
                    if (settingsDef.schema) {
                        var isValid = gpii.tests.universal.solutionsRegistry.validateSinglePayload(
                            prefValue,
                            settingsDef.schema,
                            settingsLabel
                        );
                        if (!isValid) {
                            fileErrors++;
                        }
                    }
                });
            });
        }
    });
    jqUnit.assertEquals("There should be no validation errors in preferences file '" + settingsFilePath + "'.", 0, fileErrors);
};

gpii.tests.universal.solutionsRegistry.validateSinglePayload = function (payload, schema, payloadLabel) {
    var validationResults = gpii.schema.validator.validate(payload, schema);
    if (!validationResults.isError && !validationResults.isValid) {
        var localisedErrors = gpii.schema.validator.localiseErrors(validationResults.errors, payload);

        fluid.each(localisedErrors, function (singleError) {
            fluid.log("Validation error in " + payloadLabel + ":");
            fluid.log("  - " + singleError.dataPath.join(".") + ": " + singleError.message);
        });
    }
    return validationResults.isValid && !validationResults.isError;
};

fluid.defaults("gpii.tests.universal.solutionsRegistry", {
    gradeNames: ["fluid.component"],
    solutionsRegistryPath: "%gpii-universal/testData/solutions",
    genericPreferenceTermsPath: "%gpii-universal/testData/ontologies/flat.json5",
    settingsDataPath: "%gpii-universal/testData/preferences",
    listeners: {
        "onCreate.checkAll": {
            funcName: "gpii.tests.universal.solutionsRegistry.checkAll"
        }
    }
});

gpii.tests.universal.solutionsRegistry();
