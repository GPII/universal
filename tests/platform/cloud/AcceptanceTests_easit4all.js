/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.easit4all");

gpii.tests.cloud.easit4all.testDefs = [
    {
        name: "Acceptance test for font and background color transformation in Easit4all",
        userToken: "easit4all_color",
        solutionId: "com.bdigital.easit4all",
        expected: {
            "com.bdigital.easit4all": {
                "fontSize": 10,
                "magnification": 1,
                "foregroundColor": "Yellow",
                "backgroundColor": "Black"
            }
        }
    },
    {
        name: "Acceptance test for font size transformation in Easit4all",
        userToken: "easit4all_font_size",
        solutionId: "com.bdigital.easit4all",
        expected: {
            "com.bdigital.easit4all": {
                "fontSize": 20,
                "fontFaceFontName": "Times New Roman"
            }
        }
    },
    {
        name: "Acceptance test for magnification in Easit4all",
        userToken: "easit4all_magnification",
        solutionId: "com.bdigital.easit4all",
        expected: {
            "com.bdigital.easit4all": {
                "magnification": 1 // TODO: This test is faulty since the transformation rule is faulty in the solutions registry - configured factor is actually 6
            }
        }
    }
];

if (require.main === module) {
    module.exports = gpii.test.cloudBased.bootstrap(gpii.tests.cloud.easit4all.testDefs, __dirname);
}
