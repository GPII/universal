/*!
GPII OAuth2 server

Copyright 2014 OCAD University

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

        fluid.registerNamespace("gpii.tests");

        fluid.defaults("gpii.tests.oauth2.privacySettings", {
            gradeNames: ["gpii.oauth2.privacySettings", "autoInit"],
            model: {
                user: "testUser"
            }
        });

        var assertRenderedText = function (that, root, paths, method) {
            fluid.each(paths, function (path) {
                var expected = fluid.get(root, path);
                jqUnit.assertEquals("The '" + path + "' string should have been rendered", expected, that.locate(path)[method]());
            });
        };

        var assertRendering = function (that) {
            assertRenderedText(that, that.options.strings, ["logout", "header", "directions", "removeServiceLabel"], "text");
            assertRenderedText(that, that.model, ["user"], "text");
            assertRenderedText(that, that.options.strings, ["description"], "html");
        };

        jqUnit.test("Initialization", function () {
            gpii.tests.oauth2.privacySettings(".gpiic-oauth2-privacySettings", {
                listeners: {
                    afterRender: assertRendering
                }
            });
        });
    });
})(jQuery);
