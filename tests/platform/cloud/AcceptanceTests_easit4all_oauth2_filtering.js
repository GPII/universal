"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2.easit4all");

require("./OAuth2AcceptanceDataStore.js");
require("./AcceptanceTests_easit4all.js");

gpii.tests.cloud.oauth2.easit4all.common = {
    client_id: "com.bdigital.easit4all",
    client_secret: "client_secret_easit4all",
    redirect_uri: "http://com.bdigital.easit4all/the-client%27s-uri/",
    state: "The Client's Other Unique State",
    username: "bob",
    password: "b"
};

fluid.defaults("gpii.tests.cloud.oauth2.disruptFiltering", {
    gradeNames: ["gpii.tests.disruption.mainSequence"],
    recordName: "decisionRequestForm",
    changes: {
        path: ["selectedPreferences", ""],
        type: "DELETE"
    }
});

gpii.tests.cloud.oauth2.easit4all.disruptions = [{
    gradeName: "gpii.tests.cloud.oauth2.disruptFiltering",
    expected: {
        "com.bdigital.easit4all": {
            "fontSize": 10,
            "magnification": 1
        }
    },
    changes: {
        path: "selectedPreferences",
        value: {
            "increase-size": true
        }
    }
}, {
    gradeName: "gpii.tests.cloud.oauth2.disruptFiltering",
    expected: {
        "com.bdigital.easit4all": {
        }
    }
}];

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(gpii.tests.cloud.easit4all.testDefs[0], gpii.tests.cloud.oauth2.easit4all.common,
    gpii.tests.cloud.oauth2.easit4all.disruptions, __dirname);