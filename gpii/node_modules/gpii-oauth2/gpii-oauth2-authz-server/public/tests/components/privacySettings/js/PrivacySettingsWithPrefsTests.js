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

        fluid.defaults("gpii.tests.oauth2.privacySettingsWithPrefs", {
            gradeNames: ["gpii.oauth2.privacySettingsWithPrefs", "autoInit"],
            model: {
                user: "testUser"
            }
        });

        gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText = function (that, root, paths, method) {
            fluid.each(paths, function (path) {
                var expected = fluid.get(root, path);
                jqUnit.assertEquals("The '" + path + "' string should have been rendered", expected, that.locate(path)[method]());
            });
        };

        gpii.tests.oauth2.privacySettingsWithPrefsassertRendering = function (that) {
            gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.options.strings, ["logout", "header", "directions"], "text");
            gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.model, ["user"], "text");
            gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.options.strings, ["description"], "html");
        };

        jqUnit.test("Initialization", function () {
            gpii.tests.oauth2.privacySettingsWithPrefs(".gpiic-oauth2-privacySettings", {
                listeners: {
                    afterRender: "gpii.tests.oauth2.privacySettingsWithPrefsassertRendering"
                }
            });
        });
    });
})(jQuery);
