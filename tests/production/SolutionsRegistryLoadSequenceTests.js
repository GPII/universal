/**
GPII Production Config tests - Loading Solutions Registries

Requirements:
* an internet connection
* a cloud based flow manager
---

Copyright 2020 OCAD University

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
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
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

gpii.tests.productionConfigTesting.localSolutionsRegistries =
    fluid.module.resolvePath("%gpii-universal/testData/solutions");

/** Local FlowManager tests of the solutions registry loading sequence:
 *
 * When the LFM starts, its SolutionsRegisryDataSource loads solutions
 * registries from both the local file system, and from the source code
 * repository. The tests need to start running *after* this loading process is
 * complete, and are sensitive to the "onSystemReady" event, in that regard. See
 * the component "gpii.tests.productionConfigTesting.testEnvironment" in the
 * "ProductionTestUtils.js" file.
 *
 * "onSystemReady" is fired when:
 * 1. The test server has been constructed;
 * 2. The local flow manager initial actions have completed and is ready for
 * requests
 */
fluid.defaults("gpii.tests.productionConfigTesting.loadingSolutionsTransform", {
    gradeNames: ["gpii.test.standardServerSequenceGrade"],
    sequenceElements: {
        testLoadedSequence: {
            gradeNames: "gpii.tests.productionConfigTesting.testLoadedSequence",
            priority: "after:startServer"
        }
    }
});

fluid.defaults("gpii.tests.productionConfigTesting.testLoadedSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [{
        funcName: "gpii.tests.productionConfigTesting.checkSolutionsRegistries"
    }]
});

gpii.tests.productionConfigTesting.loadingSolutionsTransform.testDefs = [{
    name: "Flow Manager production tests -- solutions loading sequence",
    config: gpii.tests.productionConfigTesting.config,
    testEnvironmentGrade: "gpii.tests.productionConfigTesting.testEnvironment",
    distributeOptions: {
        // Override the default getRevision() to record the value it gets after
        // requesting the revision.
        "capture.revision": {
            "record": {
                "loadSolutions.getRevision": {
                    "listener": "gpii.tests.productionConfigTesting.loadingSolutionsTransform.getRevisionTest",
                    "args": ["{that}"]
                }
            },
            "target": "{that gpii.flowManager.local solutionsRegistryDataSource}.options.listeners"
        }
    },
    sequenceGrade: "gpii.tests.productionConfigTesting.loadingSolutionsTransform"
}];

// Call the default getRevision() and store the result is the SRDS
gpii.tests.productionConfigTesting.loadingSolutionsTransform.getRevisionTest = function (solutionRegistryDataSource) {
    var revisionPromise = solutionRegistryDataSource.revisionRequester.getRevision();
    revisionPromise.then(function (revision) {
        solutionRegistryDataSource.revision = revision;
    });
    // For tests:  keep a reference to this solutions registry data source.
    gpii.tests.productionConfigTesting.loadingSolutionsTransform.solutionsRegistryDataSource = solutionRegistryDataSource;

    return revisionPromise;
};

// Check that the solutions were loaded from local file system and repository
// and that the revision used matches.
gpii.tests.productionConfigTesting.checkSolutionsRegistries = function () {
    var solutionRegistryDataSource = gpii.tests.productionConfigTesting.loadingSolutionsTransform.solutionsRegistryDataSource;
    jqUnit.assertNotNull(
        "Check loading of solutions registries from local file system",
        solutionRegistryDataSource.fullSolutionsRegistry
    );
    jqUnit.assertDeepEq(
        "Check revision",
        gpii.tests.productionConfigTesting.validGpiiRevision,
        solutionRegistryDataSource.revision
    );
    jqUnit.assertNotNull(
        "Check loading from soruce code respository",
        solutionRegistryDataSource.repositorySolutionsRegistry
    );
};

gpii.test.runServerTestDefs(gpii.tests.productionConfigTesting.loadingSolutionsTransform.testDefs);
