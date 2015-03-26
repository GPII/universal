/*!
GPII OAuth2 server

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests.ajax");
        fluid.registerNamespace("gpii.tests.ajax.testdata");

        gpii.tests.ajax.assertSuccess = function (actual, expected) {
            jqUnit.assertDeepEq("The ajax request should have returned the correct data", expected, actual);
        };

        gpii.tests.ajax.testdata.response = { test: "test" };

        fluid.defaults("gpii.tests.ajax.testCase", {
            gradeNames: ["fluid.littleComponent", "autoInit"],
            mockResponse: gpii.tests.ajax.testdata.response,
            ajaxOptions: {
                dataType: "json",
                success: function (data) {
                    gpii.tests.ajax.assertSuccess(data, gpii.tests.ajax.testdata.response);
                    jqUnit.start();
                }
            }
        });

        gpii.tests.ajax.testCases = [
            {
                name: "with simple replacement",
                urlTemplate: "../data/%fileName.json",
                urlTemplateValues: {
                    fileName: "gpii.oauth2.ajax"
                },
                expectedUrl: "../data/gpii.oauth2.ajax.json"
            },
            {
                name: "with space",
                urlTemplate: "/%fileName.json",
                urlTemplateValues: {
                    fileName: "with space"
                },
                expectedUrl: "/with%20space.json"
            },
            {
                name: "with &",
                urlTemplate: "/%fileName.json",
                urlTemplateValues: {
                    fileName: "with&ampersand"
                },
                expectedUrl: "/with%26ampersand.json"
            }
        ];

        fluid.each(gpii.tests.ajax.testCases, function (testCaseOptions) {
            var testCase = gpii.tests.ajax.testCase(testCaseOptions);
            $.mockjax({
                url: testCase.options.expectedUrl,
                responseText: testCase.options.mockResponse
            });
            jqUnit.asyncTest("gpii.oauth2.ajax " + testCase.options.name, function () {
                gpii.oauth2.ajax(testCase.options.urlTemplate, testCase.options.urlTemplateValues, testCase.options.ajaxOptions);
            });
        });

        jqUnit.test("gpii.oauth2.setEnabled", function () {
            var elm = $(".test-setEnabled");

            jqUnit.assertFalse("the button should be enabled to start", elm.prop("disabled"));

            gpii.oauth2.setEnabled(elm, false);
            jqUnit.assertTrue("the button should be disabled", elm.prop("disabled"));

            gpii.oauth2.setEnabled(elm, true);
            jqUnit.assertFalse("the button should be enabled", elm.prop("disabled"));
        });

    });
})(jQuery);
