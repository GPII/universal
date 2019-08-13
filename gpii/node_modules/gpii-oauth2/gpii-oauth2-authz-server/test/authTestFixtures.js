/*

    Test fixtures common to the auth tests.

 */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("gpii.tests.oauth2");


fluid.defaults("gpii.tests.oauth2.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    events: {
        createService: null
    }
});

fluid.defaults("gpii.tests.oauth2.createService", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [{
        func: "{caseHolder}.events.createService.fire"
    }]
});

fluid.defaults("gpii.tests.oauth2.sequenceGrade", {
    gradeNames: ["fluid.test.sequence"],
    sequenceElements: {
        startCouch: {
            gradeNames: "gpii.test.startCouchSequence",
            priority: "before:sequence"
        },
        createPreferencesService: {
            gradeNames: "gpii.tests.oauth2.createService",
            priority: "after:startCouch"
        },
        stopCouch: {
            gradeNames: "gpii.test.stopCouchSequence",
            priority: "after:sequence"
        }
    }
});


// We use the same base grade as the main harness, but avoid merging with that to avoid picking up the wrong test data.
fluid.defaults("gpii.tests.oauth2.baseEnvironment", {
    gradeNames: ["gpii.test.couchdb.environment.base"],
    components: {
        caseHolder: {
            type: "gpii.tests.oauth2.caseHolder"
        }
    }
});
