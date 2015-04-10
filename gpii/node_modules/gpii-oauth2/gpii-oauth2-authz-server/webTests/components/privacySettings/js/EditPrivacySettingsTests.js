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

        fluid.registerNamespace("gpii.tests");

        gpii.tests.clientData = {
            serviceName: "A Test Service",
            authDecisionId: 10,
            oauth2ClientId: 1
        };

        gpii.tests.requestInfos = {
            fetchDecisionPrefs: {
                url: "/editPrivacySettingss/" + gpii.tests.clientData.authDecisionId + "/preferences",
                dataType: "json",
                responseText: {
                    "increase-size": true
                }
            },
            saveDecisionPrefs: {
                url: "/editPrivacySettingss/" + gpii.tests.clientData.authDecisionId + "/preferences",
                type: "put",
                status: 200
            },
            fetchAvailableAuthorizedPrefs: {
                url: "/available-authorized-preferences/" + gpii.tests.clientData.oauth2ClientId,
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

        fluid.defaults("gpii.tests.oauth2.editPrivacySettings", {
            gradeNames: ["gpii.oauth2.editPrivacySettings", "autoInit"],
            requestInfos: gpii.tests.requestInfos,
            model: {
                clientData: gpii.tests.clientData
            },
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

        gpii.tests.oauth2.editPrivacySettings.cleanUp = function (dialog) {
            if (dialog.hasClass("ui-dialog-content")) {
                dialog.dialog("close");
            }
            $.mockjaxClear();
        };

        gpii.tests.oauth2.editPrivacySettings.runTest = function (msg, testFunc) {
            jqUnit.asyncTest(msg, function () {
                fluid.each(gpii.tests.requestInfos, function (options) {
                    $.mockjax(options);
                });

                gpii.tests.oauth2.editPrivacySettings(".gpiic-oauth2-privacySettings-editDecision-dialog", {
                    listeners: {
                        "onCreateSelectionTree.runTest": {
                            listener: function (that) {
                                testFunc(that);
                                gpii.tests.oauth2.editPrivacySettings.cleanUp(that.dialog);
                                jqUnit.start();
                            },
                            priority: "last"
                        }
                    }
                });
            });
        };

        gpii.tests.oauth2.editPrivacySettings.assertSelectedPreferences = function (that, expected) {
            var serverModel = that.selectionTree.toServerModel();
            jqUnit.assertDeepEq("The selectedPreferences should be set", expected, serverModel);
        };

        gpii.tests.oauth2.editPrivacySettings.assertAllowState = function (that) {
            var hasSelection = that.selectionTree.model.hasSelection;
            var isDisabled = that.locate("done").prop("disabled");

            if (hasSelection) {
                jqUnit.assertFalse("The done button should be enabled", isDisabled);
            } else {
                jqUnit.assertTrue("The done button should be disabled", isDisabled);
            }
        };

        gpii.tests.oauth2.editPrivacySettings.assertDialog = function (that, dialogState) {
            if (dialogState === "opened") {
                jqUnit.assertNotNull("The dialog should have been instantiated and attached", that.dialog);
                jqUnit.assertTrue("The dialog should have been instantiated as a jQuery dialog", that.dialog.hasClass("ui-dialog-content"));
            } else if (dialogState === "closed") {
                jqUnit.assertFalse("The dialog should have been destroyed", that.dialog.hasClass("ui-dialog-content"));
            }
        };

        gpii.tests.oauth2.editPrivacySettings.assertAjaxCalls = function (expected) {
            jqUnit.assertEquals(expected + " ajax calls have been made", expected, $.mockjax.mockedAjaxCalls().length);
        };

        gpii.tests.oauth2.editPrivacySettings.assertInit = function (that) {
            jqUnit.expect(9);
            var str = that.options.strings;

            jqUnit.assertEquals("The 'description' string should have been rendered", str.description, that.locate("description").html());
            jqUnit.assertEquals("The 'done' string should have been rendered", str.done, that.locate("done").text());
            jqUnit.assertEquals("The 'cancel' string should have been rendered", str.cancel, that.locate("cancel").text());
            jqUnit.assertTrue("The selectionTree subcomponent should have been initialized", that.selectionTree);

            gpii.tests.oauth2.editPrivacySettings.assertSelectedPreferences(that, {"increase-size": true});
            gpii.tests.oauth2.editPrivacySettings.assertAllowState(that);
            gpii.tests.oauth2.editPrivacySettings.assertDialog(that, "opened");
            gpii.tests.oauth2.editPrivacySettings.assertAjaxCalls(2);
        };

        gpii.tests.oauth2.editPrivacySettings.assertSelectionChange = function (that) {
            jqUnit.expect(5);
            that.selectionTree.applier.change("selections.value", "checked");
            gpii.tests.oauth2.editPrivacySettings.assertSelectedPreferences(that, {"": true});
            gpii.tests.oauth2.editPrivacySettings.assertAllowState(that);

            that.selectionTree.applier.change("selections.value", "unchecked");
            gpii.tests.oauth2.editPrivacySettings.assertSelectedPreferences(that, {});
            gpii.tests.oauth2.editPrivacySettings.assertAllowState(that);

            gpii.tests.oauth2.editPrivacySettings.assertAjaxCalls(2);
        };

        gpii.tests.oauth2.editPrivacySettings.assertCancel = function (that) {
            jqUnit.expect(2);
            that.locate("cancel").click();
            gpii.tests.oauth2.editPrivacySettings.assertDialog(that, "closed");
            gpii.tests.oauth2.editPrivacySettings.assertAjaxCalls(2);
        };

        gpii.tests.oauth2.editPrivacySettings.assertDone = function (that) {
            jqUnit.expect(2);
            that.locate("done").click();
            gpii.tests.oauth2.editPrivacySettings.assertDialog(that, "closed");
            gpii.tests.oauth2.editPrivacySettings.assertAjaxCalls(3);
        };

        gpii.tests.oauth2.editPrivacySettings.runTest("Initialization", gpii.tests.oauth2.editPrivacySettings.assertInit);
        gpii.tests.oauth2.editPrivacySettings.runTest("Selection change", gpii.tests.oauth2.editPrivacySettings.assertSelectionChange);
        gpii.tests.oauth2.editPrivacySettings.runTest("Cancel button", gpii.tests.oauth2.editPrivacySettings.assertCancel);
        gpii.tests.oauth2.editPrivacySettings.runTest("Done button", gpii.tests.oauth2.editPrivacySettings.assertDone);
    });
})(jQuery);
