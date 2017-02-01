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

/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests");

        gpii.tests.additionalRequestInfos = {
            fetchDecisionPrefs: {
                url: "/authorizations/" + gpii.tests.oauth2.privacySettings.clientData.authDecisionId + "/preferences",
                type: "get",
                dataType: "json",
                responseText: {
                    "increase-size": true
                }
            },
            saveDecisionPrefs: {
                url: "/authorizations/" + gpii.tests.oauth2.privacySettings.clientData.authDecisionId + "/preferences",
                type: "put",
                data: "{\"\":true}",
                status: 200,
                responseText: {
                    isError: false
                }
            }
        };

        gpii.tests.requestInfos = fluid.extend(true, {}, gpii.tests.oauth2.privacySettings.basicRequestInfos, gpii.tests.additionalRequestInfos);

        fluid.defaults("gpii.tests.oauth2.editPrivacySettingsDialog", {
            gradeNames: ["gpii.oauth2.editPrivacySettingsDialog", "gpii.tests.oauth2.privacySettingsConfig"],
            requestInfos: gpii.tests.requestInfos,
            model: {
                clientData: gpii.tests.oauth2.privacySettings.clientData
            }
        });

        gpii.tests.oauth2.editPrivacySettingsDialog.runTest = function (msg, testFunc) {
            jqUnit.asyncTest(msg, function () {
                fluid.each(gpii.tests.requestInfos, function (options) {
                    $.mockjax(options);
                });

                gpii.tests.oauth2.editPrivacySettingsDialog(".gpiic-oauth2-privacySettings-editDecision-dialog", {
                    listeners: {
                        "onCreateSelectionTree.runTest": {
                            listener: function (that) {
                                testFunc(that);
                                gpii.tests.oauth2.privacySettings.cleanUp(that.dialog);
                                jqUnit.start();
                            },
                            priority: "last"
                        }
                    }
                });
            });
        };

        gpii.tests.oauth2.editPrivacySettingsDialog.assertInit = function (that) {
            jqUnit.expect(2);
            gpii.tests.oauth2.privacySettings.assertSelectedPreferences(that, {"increase-size": true});
            gpii.tests.oauth2.privacySettings.assertAjaxCalls(2);
        };

        gpii.tests.oauth2.editPrivacySettingsDialog.assertCancel = function (that) {
            jqUnit.expect(1);
            that.locate("cancel").click();
            gpii.tests.oauth2.privacySettings.assertAjaxCalls(2);
        };

        gpii.tests.oauth2.editPrivacySettingsDialog.assertDone = function (that) {
            jqUnit.expect(3);
            that.selectionTree.applier.change("selections.value", "checked");
            gpii.tests.oauth2.privacySettings.assertSelectedPreferences(that, {"": true});
            that.locate("done").click();
            gpii.tests.oauth2.privacySettings.assertDialog(that, "closed");
            gpii.tests.oauth2.privacySettings.assertAjaxCalls(3);
        };

        gpii.tests.oauth2.editPrivacySettingsDialog.runTest("Initialization", gpii.tests.oauth2.editPrivacySettingsDialog.assertInit);
        gpii.tests.oauth2.editPrivacySettingsDialog.runTest("Cancel button", gpii.tests.oauth2.editPrivacySettingsDialog.assertCancel);
        gpii.tests.oauth2.editPrivacySettingsDialog.runTest("Done button", gpii.tests.oauth2.editPrivacySettingsDialog.assertDone);
    });

})(jQuery);
