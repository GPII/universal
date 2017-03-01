/*!
GPII OAuth2 server

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.oauth2.privacySettings");

    gpii.tests.oauth2.privacySettings.clientData = {
        serviceName: "A Test Service",
        authDecisionId: 10,
        oauth2ClientId: 1
    };

    gpii.tests.oauth2.privacySettings.basicRequestInfos = {
        fetchAvailableAuthorizedPrefs: {
            url: "/available-authorized-preferences/" + gpii.tests.oauth2.privacySettings.clientData.oauth2ClientId,
            dataType: "json",
            responseText: {
                "increase-size": true,
                "increase-size.appearance": true,
                "increase-size.appearance.text-size": true,
                "increase-size.magnifier": true,
                "simplify": true,
                "simplify.table-of-contents": true
            }
        }
    };

    fluid.defaults("gpii.tests.oauth2.privacySettingsConfig", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog"],
        components: {
            selectionTree: {
                options: {
                    resources: {
                        template: {
                            href: "../../../../public/src/components/selectionTree/html/SelectionTreeTemplate.html"
                        }
                    }
                }
            }
        }
    });

    gpii.tests.oauth2.privacySettings.assertSelectedPreferences = function (that, expected) {
        var serverModel = that.selectionTree.toServerModel();
        jqUnit.assertDeepEq("The selectedPreferences should be set", expected, serverModel);
    };

    gpii.tests.oauth2.privacySettings.assertDialog = function (that, dialogState) {
        if (dialogState === "opened") {
            jqUnit.assertNotNull("The dialog should have been instantiated and attached", that.dialog);
            jqUnit.assertTrue("The dialog should have been instantiated as a jQuery dialog", that.dialog.hasClass("ui-dialog-content"));
        } else if (dialogState === "closed") {
            jqUnit.assertFalse("The dialog should have been destroyed", that.dialog.hasClass("ui-dialog-content"));
        }
    };

    gpii.tests.oauth2.privacySettings.assertAjaxCalls = function (expected) {
        jqUnit.assertEquals(expected + " ajax calls have been made", expected, $.mockjax.mockedAjaxCalls().length);
    };

    gpii.tests.oauth2.privacySettings.cleanUp = function (dialog) {
        if (dialog.hasClass("ui-dialog-content")) {
            dialog.dialog("close");
        }
        $.mockjax.clear();
    };

})(jQuery);
