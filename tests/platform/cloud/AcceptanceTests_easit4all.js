/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

var testDefs = [
    {
        name: "Acceptance test for font size transformation in Easit4all",
        userToken: "easit4all_font_size",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"com.bdigital.easit4all\"}]}"),
        expected: {
            "com.bdigital.easit4all": {
                "fontSize": 10,
                "fontFaceFontName": "Times New Roman",
                "magnification": 1,
                "foregroundColor": "Black",
                "backgroundColor": "White",
            }
        }
    },
    {
        name: "Acceptance test for magnification in Easit4all",
        userToken: "easit4all_magnification",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"com.bdigital.easit4all\"}]}"),
        expected: {
            "com.bdigital.easit4all": {
                "fontSize": 10,
                "fontFaceFontName": "Times New Roman",
                "magnification": 1,
                "foregroundColor": "Black",
                "backgroundColor": "White",
            }
        }
    },
    {
        name: "Acceptance test for font and background color transformation in Easit4all",
        userToken: "easit4all_color",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"com.bdigital.easit4all\"}]}"),
        expected: {
            "com.bdigital.easit4all": {
                "fontSize": 10,
                "fontFaceFontName": "Times New Roman",
                "magnification": 1,
                "foregroundColor": "Yellow",
                "backgroundColor": "Black",
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);