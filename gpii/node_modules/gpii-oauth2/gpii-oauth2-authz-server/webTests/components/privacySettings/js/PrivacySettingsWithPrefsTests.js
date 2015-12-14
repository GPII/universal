/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Declare dependencies
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.oauth2.privacySettingsWithPrefs", {
        gradeNames: ["gpii.oauth2.privacySettingsWithPrefs", "autoInit"],
        requestInfos: gpii.tests.oauth2.privacySettings.basicRequestInfos,
        model: {
            user: "testUser"
        }
    });

    gpii.tests.oauth2.privacySettingsWithPrefs.subcomponents = ["editPrivacySettings", "addAuthorizationDialog", "dialogForRemoval", "addServiceMenu"];

    fluid.defaults("gpii.tests.oauth2.privacySettingsWithPrefsTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            privacySettingsWithPrefs: {
                type: "gpii.tests.oauth2.privacySettingsWithPrefs",
                container: ".gpiic-oauth2-privacySettings"
            },
            privacySettingsWithPrefsTester: {
                type: "gpii.tests.oauth2.privacySettingsWithPrefsTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.privacySettingsWithPrefsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 9,
                sequence: [{
                    func: "{privacySettingsWithPrefs}.refreshView"
                }, {
                    listener: "gpii.tests.oauth2.privacySettingsWithPrefs.assertRendering",
                    args: ["{privacySettingsWithPrefs}"],
                    priority: "last",
                    event: "{privacySettingsWithPrefs}.events.afterRender"
                }]
            }]
        }, {
            name: "Test the edit privacy settings dialog",
            tests: [{
                // expect: 4,
                sequence: [{
                    func: "gpii.tests.oauth2.privacySettingsWithPrefs.clickEdit",
                    args: ["{privacySettingsWithPrefs}", 0]
                }, {
                    listener: "gpii.tests.oauth2.privacySettingsWithPrefs.verifyEditPrivacySettingsDialog",
                    event: "{privacySettingsWithPrefs}.events.onRenderEditDialog",
                    args: ["{privacySettingsWithPrefs}", ["dialogForRemoval", "addServiceMenu", "editPrivacySettings"]]
                }]
            }]
        }]
    });

    gpii.tests.oauth2.privacySettingsWithPrefs.assertRendering = function (that) {
        gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.options.strings, ["logout", "header", "directions"], "text");
        gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.model, ["user"], "text");
        gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText(that, that.options.strings, ["description"], "html");

        gpii.tests.oauth2.privacySettingsWithPrefs.assertSubcomponents(that, ["dialogForRemoval", "addServiceMenu"]);
    };

    gpii.tests.oauth2.privacySettingsWithPrefs.assertRenderedText = function (that, root, paths, method) {
        fluid.each(paths, function (path) {
            var expected = fluid.get(root, path);
            jqUnit.assertEquals("The '" + path + "' string should have been rendered", expected, that.locate(path)[method]());
        });
    };

    gpii.tests.oauth2.privacySettingsWithPrefs.assertSubcomponents = function (that, instantiatedSubcomponents) {
        fluid.each(gpii.tests.oauth2.privacySettingsWithPrefs.subcomponents, function (subcomponent) {
            if ($.inArray(subcomponent, instantiatedSubcomponents) === -1) {
                jqUnit.assertUndefined("The subcomponent " + subcomponent + " has not been instantiated", fluid.get(that, subcomponent));
            } else {
                jqUnit.assertNotUndefined("The subcomponent " + subcomponent + " has been instantiated", fluid.get(that, subcomponent));
            }
        });
    };

    gpii.tests.oauth2.privacySettingsWithPrefs.clickEdit = function (that, index) {
        var editButtons = that.locate("editButton");
        editButtons[index].click();
    };

    gpii.tests.oauth2.privacySettingsWithPrefs.verifyEditPrivacySettingsDialog = function (that, instantiatedSubcomponents) {
        gpii.tests.oauth2.privacySettingsWithPrefs.assertSubcomponents(that, instantiatedSubcomponents);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.privacySettingsWithPrefsTest"
        ]);
    });
})(jQuery);
