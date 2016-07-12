/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.easit4all");

require("./OAuth2AcceptanceDataStore.js");

gpii.tests.cloud.oauth2.easit4all.common = {
    client_id: "com.bdigital.easit4all",
    client_secret: "client_secret_easit4all",
    redirect_uri: "http://com.bdigital.easit4all/the-client%27s-uri/",
    state: "The Client's Other Unique State",
    username: "bob",
    password: "b"
};

fluid.defaults("gpii.tests.cloud.oauth2.disruptFiltering", {
    gradeNames: ["gpii.test.disruption.mainSequence"],
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

var standardEasit4allTest = require("./AcceptanceTests_easit4all_testDefs.json");

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(standardEasit4allTest[0], gpii.tests.cloud.oauth2.easit4all.common,
    gpii.tests.cloud.oauth2.easit4all.disruptions, __dirname);
