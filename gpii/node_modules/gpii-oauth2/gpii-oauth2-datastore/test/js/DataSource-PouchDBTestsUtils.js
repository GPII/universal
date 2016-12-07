/*!
Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    fluid.defaults("gpii.tests.inBrowserPouchDB.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        pouchData: [],   // Configurable by integrators
        dbName: "auth",    // Configurable by integrators
        components: {
            pouchDb: {
                type: "gpii.pouch",
                createOnEvent: "constructFixtures",
                options: {
                    dbOptions: {
                        name: "{gpii.tests.inBrowserPouchDB.testEnvironment}.options.dbName"
                    },
                    data: "{gpii.tests.inBrowserPouchDB.testEnvironment}.options.pouchData",
                    listeners: {
                        "onCreate.populateData": {
                            listener: "{that}.bulkDocs",
                            args: ["{that}.options.data"]
                        },
                        "onBulkDocsComplete.escalate": "{gpii.tests.inBrowserPouchDB.testEnvironment}.events.onPouchReady"
                    }
                }
            }
        },
        mergePolicy: {
            rawModules: "noexpand"
        },
        distributeOptions: {
            "rawModules": {
                source: "{that}.options.rawModules",
                target: "{that > testCaseHolder}.options.rawModules"
            }
        },
        events: {
            constructFixtures: null,
            onPouchReady: null,
            onFixturesConstructed: {
                events: {
                    onPouchReady: "onPouchReady"
                }
            }
        }
    });

    // The base grade for the test case holder that starts tests when the testing fixtures are ready
    // and also destroy the pouchDB after each test sequence so the next test sequence can start with
    // a fresh data set.
    fluid.defaults("gpii.tests.inBrowserPouchDB.baseTestCaseHolder", {
        gradeNames: ["gpii.test.express.caseHolder.base"],
        sequenceStart: [{
            func: "{gpii.tests.inBrowserPouchDB.testEnvironment}.events.constructFixtures.fire"
        }, {
            event: "{gpii.tests.inBrowserPouchDB.testEnvironment}.events.onFixturesConstructed",
            listener: "fluid.log",
            args: ["PouchDB is ready"]
        }],
        sequenceEnd: [{
            func: "{gpii.tests.inBrowserPouchDB.testEnvironment}.pouchDb.destroyPouch"
        }, {
            event:    "{gpii.tests.inBrowserPouchDB.testEnvironment}.pouchDb.events.onPouchDestroyComplete",
            listener: "fluid.log",
            args:     ["PouchDB cleanup complete"]
        }],
        events: {
            onResponse: null,
            onError: null
        }
    });

})();
