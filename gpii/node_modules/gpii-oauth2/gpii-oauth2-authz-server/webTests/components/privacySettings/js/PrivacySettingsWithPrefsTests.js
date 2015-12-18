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

    fluid.registerNamespace("gpii.tests.oauth2.privacySettings");

    gpii.tests.oauth2.privacySettings.additionalRequestInfos = {
        addAuthorization: {
            url: "/authorizations",
            type: "post",
            data: "{\"oauth2ClientId\":1,\"selectedPreferences\":{\"\":true}}",
            status: 200,
            responseText: {
                isError: false
            }
        },
        removeDecision: {
            url: "/authorizations/10",
            type: "DELETE",
            status: 200
        },
        fetchDecisionPrefs: {
            url: "/authorizations/" + gpii.tests.oauth2.privacySettings.clientData.authDecisionId + "/preferences",
            type: "get",
            dataType: "json",
            status: 200,
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

    gpii.tests.oauth2.privacySettings.requestInfos = $.extend(true, {}, gpii.tests.oauth2.privacySettings.basicRequestInfos, gpii.tests.oauth2.privacySettings.additionalRequestInfos);

    gpii.tests.oauth2.privacySettings.registerMockjax = function () {
        fluid.each(gpii.tests.oauth2.privacySettings.requestInfos, function (options) {
            $.mockjax(options);
        });
    };

    fluid.defaults("gpii.tests.oauth2.privacySettingsWithPrefs", {
        gradeNames: ["gpii.oauth2.privacySettingsWithPrefs", "autoInit"],
        requestInfos: gpii.tests.oauth2.privacySettings.basicRequestInfos,
        model: {
            user: "testUser"
        },
        events: {
            onAddAuthorizationDialogClose: null
        },
        listeners: {
            "onCreate.registerMockjax": {
                listener: "gpii.tests.oauth2.privacySettings.registerMockjax",
                priority: "first"
            },
            // Override the page reload listener when a decision is successfully removed
            "onRemovalSuccess.reload": "fluid.identity"
        },
        distributeOptions: [{
            // Override the page reload listener when a service is successfully added
            target: "{that addAuthorizationDialog}.options.listeners",
            record: {
                "authorizationAdded.reload": "fluid.identity"
            }
        }, {
            // Override the page reload listener when a service is successfully added
            target: "{that addAuthorizationDialog}.options.listeners",
            record: {
                "onClose.escalate": {
                    listener: "{privacySettingsWithPrefs}.events.onAddAuthorizationDialogClose",
                    priority: "last"
                }
            }
        }]
    });

    gpii.tests.oauth2.privacySettings.subcomponents = ["editPrivacySettings", "addAuthorizationDialog", "dialogForRemoval", "addServiceMenu"];

    fluid.defaults("gpii.tests.oauth2.privacySettingsTest", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            privacySettingsWithPrefs: {
                type: "gpii.tests.oauth2.privacySettingsWithPrefs",
                container: ".gpiic-oauth2-privacySettings"
            },
            privacySettingsTester: {
                type: "gpii.tests.oauth2.privacySettingsTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.privacySettingsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 11,
                sequence: [{
                    func: "{privacySettingsWithPrefs}.refreshView"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.assertRendering",
                    args: ["{privacySettingsWithPrefs}"],
                    priority: "last",
                    event: "{privacySettingsWithPrefs}.events.afterRender"
                }]
            }]
        }, {
            name: "Remove a decison",
            tests: [{
                expect: 5,
                sequence: [{
                    func: "gpii.tests.oauth2.privacySettings.clickButtonOnDecision",
                    args: ["{privacySettingsWithPrefs}", "removeButton", 0]
                }, {
                    func: "gpii.tests.oauth2.privacySettings.verifyDialogForRemoval",
                    args: ["{privacySettingsWithPrefs}"]
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettingsWithPrefs}.dialogForRemoval.okButton"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.verifyRemoval",
                    args: ["{privacySettingsWithPrefs}"],
                    event: "{privacySettingsWithPrefs}.events.onRemovalSuccess",
                    priority: "last"
                }]
            }]
        }, {
            name: "Add authorization",
            tests: [{
                expect: 9,
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{privacySettingsWithPrefs}.dom.addServiceButton"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.afterAddServiceButtonClicked",
                    args: ["{privacySettingsWithPrefs}"],
                    spec: {path: "isMenuOpen", priority: "last"},
                    changeEvent: "{privacySettingsWithPrefs}.addServiceMenu.applier.modelChanged"
                }, {
                    func: "gpii.tests.oauth2.privacySettings.selectOneService",
                    args: ["{privacySettingsWithPrefs}.addServiceMenu.container", 0]
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.oneServiceSelected",
                    args: ["{privacySettingsWithPrefs}"],
                    event: "{privacySettingsWithPrefs}.events.onRenderAddAuthorizationDialog",
                    priority: "last"
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettingsWithPrefs}.addAuthorizationDialog.dom.cancel"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.addAuthorizationDialogClosed",
                    args: ["{privacySettingsWithPrefs}"],
                    event: "{privacySettingsWithPrefs}.events.onAddAuthorizationDialogClose",
                    priority: "last"
                }]
            }]
        }, {
            name: "Edit privacy settings",
            tests: [{
                expect: 13,
                sequence: [{
                    func: "gpii.tests.oauth2.privacySettings.clickButtonOnDecision",
                    args: ["{privacySettingsWithPrefs}", "editButton", 0]
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.verifyEditPrivacySettings",
                    args: ["{privacySettingsWithPrefs}"],
                    priority: "last",
                    event: "{privacySettingsWithPrefs}.events.onRenderEditDialog"
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettingsWithPrefs}.editPrivacySettings.dom.cancel"
                }, {
                    func: "gpii.tests.oauth2.privacySettings.assertDialog",
                    args: ["{privacySettingsWithPrefs}.editPrivacySettings", "closed"]
                }]
            }]
        }]
    });

    gpii.tests.oauth2.privacySettings.assertRendering = function (that) {
        gpii.tests.oauth2.privacySettings.assertRenderedText(that, that.options.strings, ["logout", "header", "directions"], "text");
        gpii.tests.oauth2.privacySettings.assertRenderedText(that, that.model, ["user"], "text");
        gpii.tests.oauth2.privacySettings.assertRenderedText(that, that.options.strings, ["description"], "html");

        gpii.tests.oauth2.privacySettings.assertSubcomponents(that, ["dialogForRemoval", "addServiceMenu"]);
        jqUnit.assertFalse("The add service menu is initially closed", that.addServiceMenu.model.isMenuOpen);
        jqUnit.assertFalse("The selected css class is not applied to the add service container", that.locate("addService").hasClass(that.options.styles.addServiceSelected));
    };

    gpii.tests.oauth2.privacySettings.assertRenderedText = function (that, root, paths, method) {
        fluid.each(paths, function (path) {
            var expected = fluid.get(root, path);
            jqUnit.assertEquals("The '" + path + "' string should have been rendered", expected, that.locate(path)[method]());
        });
    };

    gpii.tests.oauth2.privacySettings.assertSubcomponents = function (that, instantiatedSubcomponents) {
        fluid.each(gpii.tests.oauth2.privacySettings.subcomponents, function (subcomponent) {
            var assertFunc = $.inArray(subcomponent, instantiatedSubcomponents) === -1 ? "assertUndefined" : "assertNotUndefined",
                msg = $.inArray(subcomponent, instantiatedSubcomponents) === -1 ? " not" : "";
            jqUnit[assertFunc]("The subcomponent " + subcomponent + " has" + msg + " been instantiated", fluid.get(that, subcomponent));
        });
    };

    gpii.tests.oauth2.privacySettings.afterAddServiceButtonClicked = function (that) {
        jqUnit.assertTrue("The add service menu is opened", that.addServiceMenu.model.isMenuOpen);
        jqUnit.assertTrue("The selected css class has been applied to the add service container", that.locate("addService").hasClass(that.options.styles.addServiceSelected));
    };

    gpii.tests.oauth2.privacySettings.selectOneService = function (addServiceMenu, index) {
        var menuItem = addServiceMenu.find("a")[index];
        menuItem.click();
    };

    gpii.tests.oauth2.privacySettings.oneServiceSelected = function (that) {
        gpii.tests.oauth2.privacySettings.assertSubcomponents(that, ["dialogForRemoval", "addServiceMenu", "addAuthorizationDialog"]);

        var expectedClientData = {
            serviceName: "Service 1",
            oauth2ClientId: "2"
        };

        jqUnit.assertDeepEq("The model value of currentClientData has been set correctly", expectedClientData, that.model.currentClientData);
        jqUnit.assertDeepEq("The value of currentClientData has been passed to addAuthorizationDialog.model.clientData", expectedClientData, that.addAuthorizationDialog.model.clientData);
    };

    gpii.tests.oauth2.privacySettings.addAuthorizationDialogClosed = function (that) {
        jqUnit.assertDeepEq("The focus returns back to the add service button", that.locate("addServiceButton").is(":focus"));
    };

    gpii.tests.oauth2.privacySettings.clickButtonOnDecision = function (that, buttonSelector, index) {
        var buttons = that.locate(buttonSelector);
        buttons[index].click();
    };

    gpii.tests.oauth2.privacySettings.verifyClientData = function (msg, data, elements, expected) {
        fluid.each(elements, function (elm) {
            var value = data[elm];
            if (elm === "authDecisionId" || elm === "oauth2ClientId") {
                value = parseInt(value);
            }
            jqUnit.assertEquals(msg + "The value of " + elm + " is expected", expected[elm], value);
        });
    };

    gpii.tests.oauth2.privacySettings.verifyEditPrivacySettings = function (that) {
        gpii.tests.oauth2.privacySettings.verifyClientData("The model value for currentClientData: ", gpii.tests.oauth2.privacySettings.clientData, ["serviceName", "authDecisionId", "oauth2ClientId"], that.model.currentClientData);
        gpii.tests.oauth2.privacySettings.verifyClientData("The model value of clientData in editPrivacySettings: ", gpii.tests.oauth2.privacySettings.clientData, ["serviceName", "authDecisionId", "oauth2ClientId"], that.editPrivacySettings.model.clientData);

        gpii.tests.oauth2.privacySettings.assertSubcomponents(that, ["dialogForRemoval", "addServiceMenu", "addAuthorizationDialog", "editPrivacySettings"]);
        gpii.tests.oauth2.privacySettings.assertDialog(that.editPrivacySettings, "opened");
    };

    gpii.tests.oauth2.privacySettings.verifyDialogForRemoval = function (that) {
        var expectedDialogContent = fluid.stringTemplate(that.options.strings.removeDecisionContent, {serviceName: gpii.tests.oauth2.privacySettings.clientData.serviceName});
        jqUnit.assertEquals("The authDecisionId has been set correctly in dialogForRemoval subcomponent", gpii.tests.oauth2.privacySettings.clientData.authDecisionId, that.dialogForRemoval.model.authDecisionId);
        jqUnit.assertEquals("The dialogContent has been set correctly in dialogForRemoval subcomponent", expectedDialogContent, that.dialogForRemoval.model.dialogContent);
        jqUnit.isVisible("The dialog for removing the decision is visible", that.dialogForRemoval.container);
        jqUnit.assertTrue("The dialogForRemoval container should have been instantiated as a jQuery dialog", that.dialogForRemoval.container.hasClass("ui-dialog-content"));
    };

    gpii.tests.oauth2.privacySettings.verifyRemoval = function (that) {
        jqUnit.assertTrue("onRemovalSuccess event is fired", true);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.privacySettingsTest"
        ]);
    });
})(jQuery);
