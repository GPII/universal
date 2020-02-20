/**
GPII Production Config tests - Cloud Status

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

require("./ProductionTestsUtils.js");

gpii.tests.productionConfigTesting.validGpiiRevision = require(
    fluid.module.resolvePath(
        "%gpii-universal/gpii-revision.json"
    )
);

// Flowmanager tests for these http endpoints:
// /health,
// /ready,
// /revision

fluid.defaults("gpii.tests.productionConfigTesting.cloudStatus", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Cloud status tests:"]},
        {
            func: "{healthRequest}.sendToCBFM"
        }, {
            event: "{healthRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{readyRequest}.sendToCBFM"
        }, {
            event: "{readyRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{revisionRequest}.sendToCBFM"
        }, {
            event: "{revisionRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        },
        { funcName: "fluid.log", args: ["Cloud status tests end"]}
    ]
});

fluid.defaults("gpii.tests.productionConfigTesting.cloudStatusSequence", {
    gradeNames: ["gpii.test.standardServerSequenceGrade"],
    sequenceElements: {
        cloudStatus: {
            gradeNames: "gpii.tests.productionConfigTesting.cloudStatus",
            priority: "after:startServer"
        }
    }
});

gpii.tests.productionConfigTesting.testDefs = [{
    name: "Flow Manager production tests -- Cloud status",
    config: gpii.tests.productionConfigTesting.config,
    expect: 6,
    components: {
        healthRequest: {
            type: "gpii.tests.productionConfigTesting.cloudStatusRequest",
            options: {
                path: "/health",
                expectedPayload: {"isHealthy": true}
            }
        },
        readyRequest: {
            type: "gpii.tests.productionConfigTesting.cloudStatusRequest",
            options: {
                path: "/ready",
                expectedPayload: {"isReady": true}
            }
        },
        revisionRequest: {
            type:  "gpii.tests.productionConfigTesting.cloudStatusRequest",
            options: {
                path: "/revision",
                expectedPayload: gpii.tests.productionConfigTesting.validGpiiRevision
            }
        }
    },
    sequenceGrade: "gpii.tests.productionConfigTesting.cloudStatusSequence"
}];

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.testDefs);
