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

// Declare dependencies
/* global fluid, gpii, jQuery */

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.privacySettingsDialog");

    gpii.tests.privacySettingsDialog.clientData = {
        serviceName: "A Test Service",
        authDecisionId: 10,
        oauth2ClientId: 1
    };

    gpii.tests.privacySettingsDialog.basicRequestInfos = {
        fetchAvailableAuthorizedPrefs: {
            url: "/available-authorized-preferences/" + gpii.tests.privacySettingsDialog.clientData.oauth2ClientId,
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

    fluid.defaults("gpii.tests.privacySettingsDialogConfig", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog", "autoInit"],
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

    gpii.tests.privacySettingsDialog.cleanUp = function (dialog) {
        if (dialog.hasClass("ui-dialog-content")) {
            dialog.dialog("close");
        }
        $.mockjaxClear();
    };

})(jQuery);
