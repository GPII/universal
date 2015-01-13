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

        /*

        gpii.oauth2.ajax = function (urlTemplate, urlParams, options) {
            var url = fluid.stringTemplate(urlTemplate, urlParams);
            $.ajax(url, options);
        };

        gpii.oauth2.setDisabled = function (elm, state) {
            var hasSelection = state && state !== "unchecked";
            elm.prop("disabled", !hasSelection);
        };

        */

        gpii.tests.ajax.assertSuccess = function (actual, expected) {
            jqUnit.assertDeepEq("The ajax request should have returned the correct data", expected, actual);
        };

        jqUnit.asyncTest("gpii.oauth2.ajax", function () {
            var expected = {test: "test"};
            var urlTemplate = "../data/%fileName.json";
            var urlParams = {
                fileName: "gpii.oauth2.ajax"
            };
            var options = {
                dataType: "json",
                success: function (data) {
                    gpii.tests.ajax.assertSuccess(data, expected);
                    jqUnit.start();
                }
            };

            gpii.oauth2.ajax(urlTemplate, urlParams, options);
        });

    });
})(jQuery);
