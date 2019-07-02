/*!

    Copyright 2016-2017 OCAD university
    Copyright 2019 Raising the Floor International
    Copyright 2019 OCAD University

    Licensed under the New BSD license. You may not use this file except in
    compliance with this License.

    The research leading to these results has received funding from the European Union's
    Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

    You may obtain a copy of the License at
    https://github.com/GPII/universal/blob/master/LICENSE.txt

*/
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("node-jqunit");

fluid.require("%gpii-universal");
gpii.loadTestingSupport();

require("./authTestFixtures");

fluid.defaults("gpii.tests.oauth2.authorizationService", {
    gradeNames: ["gpii.oauth2.authorizationService"],
    invokers: {
        getCurrentDate: {
            funcName: "fluid.identity",
            args: [new Date("2019-01-17T07:01:00.001Z")]
        }
    },
    components: {
        codeGenerator: {
            type: "fluid.emptySubcomponent"
        }
    }
});

fluid.defaults("gpii.tests.oauth2.authGrantFinder", {
    gradeNames: ["gpii.oauth2.authGrantFinder"],
    components: {
        authorizationService: {
            type: "gpii.tests.oauth2.authorizationService"
        }
    }
});

fluid.defaults("gpii.tests.oauth2.authGrantFinder.caseHolder", {
    gradeNames: ["gpii.tests.oauth2.caseHolder"],
    dataSourceConfig: {
        baseUrl: "http://localhost",
        port: 25984,
        dbName: "gpii"
    },
    distributeOptions: [
        {
            record: "gpii.dbOperation.dbDataStore",
            target: "{that dataStore}.type"
        },
        {
            source: "{that}.options.dataSourceConfig",
            target: "{that dataStore}.options.dataSourceConfig"
        }
    ],
    components: {
        authGrantFinder: {
            type: "gpii.tests.oauth2.authGrantFinder",
            options: {
                gradeNames: ["gpii.tests.dbOperation.dbDataStore.base"]
            }
        }
    }
});

fluid.defaults("gpii.tests.oauth2.authGrantFinder.testEnvironment", {
    gradeNames: ["gpii.tests.oauth2.baseEnvironment"],
    databases: {
        gpii: {
            data: [
                "%gpii-universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/data/authGrantFinderTests-data.json",
                "%gpii-universal/testData/dbData/views.json"
            ]
        }
    },
    components: {
        caseHolder: {
            type: "gpii.tests.oauth2.authGrantFinder.caseHolder"
        }
    }
});

// All expected results
gpii.tests.oauth2.authGrantFinder.expected = {
    regular: {
        accessToken: "Bakersfield_AJC_access_token",
        gpiiKey: "carol_gpii_key",
        allowSettingsGet: true,
        allowSettingsPut: true,
        allowedPrefsToWrite: []
    },
    backwardsCompatibility: {
        accessToken: "schemaV0.1_access_token",
        gpiiKey: "carol_gpii_key",
        allowSettingsGet: true,
        allowSettingsPut: true,
        allowedPrefsToWrite: null
    }
};

fluid.defaults("gpii.tests.oauth2.authGrantFinder.cases", {
    gradeNames: ["gpii.tests.oauth2.authGrantFinder.testEnvironment"],
    components: {
        caseHolder: {
            options: {
                modules: [
                    {
                        name: "Test getGrantForAccessToken() with an access token for resource owner GPII key grant type",
                        tests: [{
                            name: "getGrantForAccessToken() returns the authorization info in the format for the resource owner GPII key grant type",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authGrantFinder}.getGrantForAccessToken",
                                args: ["Bakersfield_AJC_access_token"],
                                resolve: "jqUnit.assertDeepEq",
                                resolveArgs: ["The expected authorization info is returned", gpii.tests.oauth2.authGrantFinder.expected.regular, "{arguments}.0"]
                            }]
                        }]
                    },
                    {
                        name: "Test getGrantForAccessToken() accommodates the backwards compatibility for the data model in the schema version 0.1",
                        tests: [{
                            name: "getGrantForAccessToken() returns the authorization info in the format for the resource owner GPII key grant type",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authGrantFinder}.getGrantForAccessToken",
                                args: ["schemaV0.1_access_token"],
                                resolve: "jqUnit.assertDeepEq",
                                resolveArgs: ["The expected authorization info is returned", gpii.tests.oauth2.authGrantFinder.expected.backwardsCompatibility, "{arguments}.0"]
                            }]
                        }]
                    },
                    {
                        name: "Test getGrantForAccessToken() returns undefined for an expired access token",
                        tests: [{
                            name: "getGrantForAccessToken() returns undefined for an expired access token",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authGrantFinder}.getGrantForAccessToken",
                                args: ["Bakersfield_AJC_access_token_expired"],
                                resolve: "jqUnit.assertUndefined",
                                resolveArgs: ["The expected authorization info is returned", "{arguments}.0"]
                            }]
                        }]
                    },
                    {
                        name: "Test getGrantForAccessToken()",
                        tests: [{
                            name: "getGrantForAccessToken() returns undefined for an unknown access token",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authGrantFinder}.getGrantForAccessToken",
                                args: ["unknown"],
                                resolve: "jqUnit.assertUndefined",
                                resolveArgs: ["undefined should be received for an unknown access token", "{arguments}.0"]
                            }]
                        }]
                    }
                ]
            }
        }
    }
});

fluid.test.runTests([
    "gpii.tests.oauth2.authGrantFinder.cases"
]);
