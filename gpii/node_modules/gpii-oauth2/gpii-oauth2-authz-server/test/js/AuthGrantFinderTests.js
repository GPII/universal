/*!
Copyright 2016-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function () {

    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.tests.oauth2.authorizationService", {
        gradeNames: ["gpii.oauth2.authorizationService"],
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

    fluid.defaults("gpii.tests.oauth2.authGrantFinder.testEnvironment", {
        gradeNames: ["gpii.tests.oauth2.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../gpii-oauth2-datastore/dbViews/views.json",
        dbName: "auth",
        components: {
            authGrantFinder: {
                type: "gpii.tests.oauth2.authGrantFinder",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.oauth2.dbDataStore.base"],
                    dbViews: "{arguments}.0"
                }
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        },
        distributeOptions: [{
            record: "gpii.oauth2.dbDataStore",
            target: "{that dataStore}.type"
        }]
    });

    // Tests with an empty data store
    fluid.defaults("gpii.tests.oauth2.authGrantFinder.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder.testEnvironment"],
        rawModules: [{
            name: "Test getGrantForAccessToken()",
            tests: [{
                name: "getGrantForAccessToken() should return undefined with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["any-token"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

    // Tests with a data store having test data
    gpii.tests.oauth2.authGrantFinder.testData = [{
        "_id": "gpiiToken-1",
        "type": "gpiiToken",
        "gpiiToken": "carol_gpii_token"
    }, {
        "_id": "client-1",
        "type": "gpiiAppInstallationClient",
        "name": "Bakersfield AJC - PC1",
        "oauth2ClientId": "Bakersfield-AJC-client-id",
        "oauth2ClientSecret": "Bakersfield-AJC-client-secret"
    }, {
        "_id": "gpiiAppInstallationAuthorization-1",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-1",
        "gpiiToken": "carol_gpii_token",
        "accessToken": "Bakersfiled_AJC_access_token",
        "revoked": false,
        "timestampCreated": new Date(new Date().getTime() - 60 * 1000).toISOString(),
        "timestampRevoked": null,
        "timestampExpires": new Date(new Date().getTime() + 40 * 1000).toISOString()
    }, {
        "_id": "gpiiAppInstallationAuthorization-expired",
        "type": "gpiiAppInstallationAuthorization",
        "clientId": "client-1",
        "gpiiToken": "carol_gpii_token",
        "accessToken": "Bakersfiled_AJC_access_token_expired",
        "revoked": false,
        "timestampCreated": new Date(new Date().getTime() - 60 * 1000).toISOString(),
        "timestampRevoked": null,
        "timestampExpires": new Date(new Date().getTime() - 20 * 1000).toISOString()
    }];

    // All expected results
    gpii.tests.oauth2.authGrantFinder.expected = {
        accessToken: "Bakersfiled_AJC_access_token",
        gpiiToken: "carol_gpii_token",
        allowUntrustedSettingsGet: true,
        allowUntrustedSettingsPut: true
    };

    fluid.defaults("gpii.tests.oauth2.authGrantFinder.withData", {
        gradeNames: ["gpii.tests.oauth2.authGrantFinder.testEnvironment"],
        pouchData: gpii.tests.oauth2.authGrantFinder.testData,
        rawModules: [{
            name: "Test getGrantForAccessToken()",
            tests: [{
                name: "getGrantForAccessToken() returns undefined for an unknown access token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["unknown"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["undefined should be received for an unknown access token", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test getGrantForAccessToken() with an access token for resource owner GPII token grant type",
            tests: [{
                name: "getGrantForAccessToken() returns the authorization info in the format for the resource owner GPII token grant type",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["Bakersfiled_AJC_access_token"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The expected authorization info is returned", gpii.tests.oauth2.authGrantFinder.expected, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }, {
            name: "Test getGrantForAccessToken() returns undefined for an expired access token",
            tests: [{
                name: "getGrantForAccessToken() returns undefined for an expired access token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authGrantFinder}.getGrantForAccessToken", ["Bakersfiled_AJC_access_token_expired"], "{that}"]
                }, {
                    listener: "jqUnit.assertUndefined",
                    args: ["The expected authorization info is returned", "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }]
        }]
    });

})();
