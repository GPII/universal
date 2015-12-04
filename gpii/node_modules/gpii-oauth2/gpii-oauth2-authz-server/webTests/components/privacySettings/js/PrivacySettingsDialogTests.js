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
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests");

        gpii.tests.initialSelectedPrefs = {
            "increase-size": true
        };

        fluid.defaults("gpii.tests.oauth2.privacySettingsDialog", {
            gradeNames: ["gpii.oauth2.privacySettingsDialog", "gpii.tests.privacySettingsDialogConfig", "autoInit"],
            members: {
                doneButtonClicked: false
            },
            requestInfos: gpii.tests.privacySettingsDialog.basicRequestInfos,
            model: {
                clientData: gpii.tests.privacySettingsDialog.clientData
            },
            listeners: {
                "onDone.eventFired": {
                    listener: "fluid.set",
                    args: ["{that}", "doneButtonClicked", true]
                }
            }
        });

        gpii.tests.oauth2.privacySettingsDialog.runTest = function (msg, testFunc) {
            jqUnit.asyncTest(msg, function () {
                fluid.each(gpii.tests.privacySettingsDialog.basicRequestInfos, function (options) {
                    $.mockjax(options);
                });

                gpii.tests.oauth2.privacySettingsDialog(".gpiic-oauth2-privacySettings-editDecision-dialog", {
                    listeners: {
                        "onCreate.setInitialSelectedPrefs": {
                            listener: "{that}.setInitialSelectedPrefs",
                            args: [gpii.tests.initialSelectedPrefs]
                        },
                        "onCreateSelectionTree.runTest": {
                            listener: function (that) {
                                testFunc(that);
                                gpii.tests.privacySettingsDialog.cleanUp(that.dialog);
                                jqUnit.start();
                            },
                            priority: "last"
                        }
                    }
                });
            });
        };

        gpii.tests.oauth2.privacySettingsDialog.assertSelectedPreferences = function (that, expected) {
            var serverModel = that.selectionTree.toServerModel();
            jqUnit.assertDeepEq("The selectedPreferences should be set", expected, serverModel);
        };

        gpii.tests.oauth2.privacySettingsDialog.assertAllowState = function (that) {
            var hasSelection = that.selectionTree.model.hasSelection;
            var isDisabled = that.locate("done").prop("disabled");

            if (hasSelection) {
                jqUnit.assertFalse("The done button should be enabled", isDisabled);
            } else {
                jqUnit.assertTrue("The done button should be disabled", isDisabled);
            }
        };

        gpii.tests.oauth2.privacySettingsDialog.assertDialog = function (that, dialogState) {
            if (dialogState === "opened") {
                jqUnit.assertNotNull("The dialog should have been instantiated and attached", that.dialog);
                jqUnit.assertTrue("The dialog should have been instantiated as a jQuery dialog", that.dialog.hasClass("ui-dialog-content"));
            } else if (dialogState === "closed") {
                jqUnit.assertFalse("The dialog should have been destroyed", that.dialog.hasClass("ui-dialog-content"));
            }
        };

        gpii.tests.oauth2.privacySettingsDialog.assertInit = function (that) {
            jqUnit.expect(8);
            var str = that.options.strings;

            jqUnit.assertEquals("The 'description' string should have been rendered", str.description, that.locate("description").html());
            jqUnit.assertEquals("The 'done' string should have been rendered", str.done, that.locate("done").text());
            jqUnit.assertEquals("The 'cancel' string should have been rendered", str.cancel, that.locate("cancel").text());
            jqUnit.assertTrue("The selectionTree subcomponent should have been initialized", that.selectionTree);

            gpii.tests.oauth2.privacySettingsDialog.assertSelectedPreferences(that, {"increase-size": true});
            gpii.tests.oauth2.privacySettingsDialog.assertAllowState(that);
            gpii.tests.oauth2.privacySettingsDialog.assertDialog(that, "opened");
        };

        gpii.tests.oauth2.privacySettingsDialog.assertSelectionChange = function (that) {
            jqUnit.expect(4);
            that.selectionTree.applier.change("selections.value", "checked");
            gpii.tests.oauth2.privacySettingsDialog.assertSelectedPreferences(that, {"": true});
            gpii.tests.oauth2.privacySettingsDialog.assertAllowState(that);

            that.selectionTree.applier.change("selections.value", "unchecked");
            gpii.tests.oauth2.privacySettingsDialog.assertSelectedPreferences(that, {});
            gpii.tests.oauth2.privacySettingsDialog.assertAllowState(that);
        };

        gpii.tests.oauth2.privacySettingsDialog.assertCancel = function (that) {
            jqUnit.expect(1);
            that.locate("cancel").click();
            gpii.tests.oauth2.privacySettingsDialog.assertDialog(that, "closed");
        };

        gpii.tests.oauth2.privacySettingsDialog.assertDone = function (that) {
            jqUnit.expect(1);
            that.locate("done").click();
            jqUnit.assertTrue("The event onDone has been fired", that.doneButtonClicked);
        };

        gpii.tests.oauth2.privacySettingsDialog.runTest("Initialization", gpii.tests.oauth2.privacySettingsDialog.assertInit);
        gpii.tests.oauth2.privacySettingsDialog.runTest("Selection change", gpii.tests.oauth2.privacySettingsDialog.assertSelectionChange);
        gpii.tests.oauth2.privacySettingsDialog.runTest("Cancel button", gpii.tests.oauth2.privacySettingsDialog.assertCancel);
        gpii.tests.oauth2.privacySettingsDialog.runTest("Done button", gpii.tests.oauth2.privacySettingsDialog.assertDone);
    });
})(jQuery);
