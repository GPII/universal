/**
GPII Production Config tests

Requirements:
* an internet connection
* a cloud based flow manager
* a preferences server
* a CouchDB server

---

Copyright 2015 Raising the Floor - International
Copyright 2018, 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.productionConfigTesting");

require("../shared/DevelopmentTestDefsNEW.js");
require("./ProductionTestsUtils.js");

// Flowmanager tests for:
// /user/%gpiiKey/login and /user/%gpiiKey/logout (as defined in gpii.tests.development.testDefs),
// /health,
// /ready,
gpii.tests.productionConfigTesting.testDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        name: "Flow Manager production tests",
        config: gpii.tests.productionConfigTesting.config,
        expect: 6,
        components: {
            healthRequest: {
                type: "kettle.test.request.http",
                options: {
                    hostname: "flowmanager",
                    path: "/health",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isHealthy": true}
                }
            },
            readyRequest: {
                type: "kettle.test.request.http",
                options: {
                    hostname: "flowmanager",
                    path: "/ready",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isReady": true}
                }
            }
        },
        sequenceGrade: "gpii.tests.productionConfigTesting.cloudStatusSequence"
    });
    return testDef;
});

fluid.defaults("gpii.tests.productionConfigTesting.cloudStatus", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Cloud status tests:"]},
        {
            func: "{healthRequest}.send"
        }, {
            event: "{healthRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{readyRequest}.send"
        }, {
            event: "{readyRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        },
        { funcName: "fluid.log", args: ["Cloud status tests end"]}
    ]
});

fluid.defaults("gpii.tests.productionConfigTesting.cloudStatusSequence", {
    gradeNames: ["gpii.test.standardServerSequenceGrade"],
    sequenceElements: {
        loginLogout: {
            gradeNames: "gpii.tests.development.loginLogout",
            priority: "after:startServer"
        },
        cloudStatus: {
            gradeNames: "gpii.tests.productionConfigTesting.cloudStatus",
            priority: "after:loginLogout"
        }
    }
});

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.testDefs);
