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

    gpii.tests.oauth2.privacySettings.requestInfos = fluid.extend(true, {}, gpii.tests.oauth2.privacySettings.basicRequestInfos, gpii.tests.oauth2.privacySettings.additionalRequestInfos);

    gpii.tests.oauth2.privacySettings.registerMockjax = function () {
        fluid.each(gpii.tests.oauth2.privacySettings.requestInfos, function (options) {
            $.mockjax(options);
        });
    };

    fluid.defaults("gpii.tests.oauth2.privacySettings.trackTooltips", {
        gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
        singleRootType: "gpii.tests.oauth2.privacySettings.trackTooltips",
        mergePolicy: {
            tooltipListeners: "noexpand"
        },
        members: {
            tooltipMap: {}
        },
        tooltipListeners: {
            "onCreate.trackTooltip": {
                funcName: "gpii.tests.oauth2.privacySettings.trackTooltip",
                priority: "last",
                args: ["{trackTooltips}", "{that}"]
            }
        },
        distributeOptions: {
            source: "{that}.options.tooltipListeners",
            removeSource: true,
            target: "{/ fluid.tooltip}.options.listeners"
        }
    });

    gpii.tests.oauth2.privacySettings.trackTooltip = function (that, tooltip) {
        var id = fluid.allocateSimpleId(tooltip.container);
        that.tooltipMap[id] = tooltip;
    };

    fluid.defaults("gpii.tests.oauth2.privacySettings", {
        gradeNames: ["gpii.tests.oauth2.privacySettings.trackTooltips", "gpii.oauth2.privacySettings"],
        requestInfos: gpii.tests.oauth2.privacySettings.basicRequestInfos,
        model: {
            user: "testUser"
        },
        testData: {
            buttonIndex: 0
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
                    listener: "{privacySettings}.events.onAddAuthorizationDialogClose",
                    priority: "last"
                }
            }
        }]
    });

    gpii.tests.oauth2.privacySettings.subcomponents = ["editPrivacySettingsDialog", "addAuthorizationDialog", "dialogForRemoval", "addServiceMenu"];

    fluid.defaults("gpii.tests.oauth2.privacySettingsTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            privacySettings: {
                type: "gpii.tests.oauth2.privacySettings",
                container: ".gpiic-oauth2-privacySettings"
            },
            privacySettingsTester: {
                type: "gpii.tests.oauth2.privacySettingsTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.privacySettingsTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 15,
                name: "Verify the initial rendering and component states",
                sequence: [{
                    func: "{privacySettings}.refreshView"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.assertRendering",
                    args: ["{privacySettings}"],
                    priority: "last",
                    event: "{privacySettings}.events.afterRender"
                }]
            }]
        }, {
            name: "Remove a decison",
            tests: [{
                expect: 5,
                name: "Verify the opening of the removal dialog and the remove button",
                sequence: [{
                    func: "gpii.tests.oauth2.privacySettings.triggerButtonEvt",
                    args: ["{privacySettings}", "removeButton", "{privacySettings}.options.testData.buttonIndex", "click"]
                }, {
                    func: "gpii.tests.oauth2.privacySettings.verifyDialogForRemoval",
                    args: ["{privacySettings}"]
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettings}.dialogForRemoval.okButton"
                }, {
                    listener: "jqUnit.assertTrue",
                    args: ["onRemovalSuccess event is fired", true],
                    event: "{privacySettings}.events.onRemovalSuccess",
                    priority: "last"
                }]
            }]
        }, {
            name: "Add authorization",
            tests: [{
                expect: 9,
                name: "Verify the entire process of adding an authorization",
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{privacySettings}.dom.addServiceButton"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.afterAddServiceButtonClicked",
                    args: ["{privacySettings}"],
                    spec: {path: "isMenuOpen", priority: "last"},
                    changeEvent: "{privacySettings}.addServiceMenu.applier.modelChanged"
                }, {
                    func: "gpii.tests.oauth2.privacySettings.selectOneService",
                    args: ["{privacySettings}.addServiceMenu.container", 0]
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.oneServiceSelected",
                    args: ["{privacySettings}"],
                    event: "{privacySettings}.events.onRenderAddAuthorizationDialog",
                    priority: "last"
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettings}.addAuthorizationDialog.dom.cancel"
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.addAuthorizationDialogClosed",
                    args: ["{privacySettings}"],
                    event: "{privacySettings}.events.onAddAuthorizationDialogClose",
                    priority: "last"
                }]
            }]
        }, {
            name: "Edit privacy settings",
            tests: [{
                expect: 13,
                name: "Verify the rendering and closing of the edit dialog",
                sequence: [{
                    func: "gpii.tests.oauth2.privacySettings.triggerButtonEvt",
                    args: ["{privacySettings}", "editButton", "{privacySettings}.options.testData.buttonIndex", "click"]
                }, {
                    listener: "gpii.tests.oauth2.privacySettings.verifyEditPrivacySettingsDialog",
                    args: ["{privacySettings}"],
                    priority: "last",
                    event: "{privacySettings}.events.onRenderEditDialog"
                }, {
                    jQueryTrigger: "click",
                    element: "{privacySettings}.editPrivacySettingsDialog.dom.cancel"
                }, {
                    func: "gpii.tests.oauth2.privacySettings.assertDialog",
                    args: ["{privacySettings}.editPrivacySettingsDialog", "closed"]
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

        gpii.tests.oauth2.privacySettings.assertTooltips(that.locate("editButton"), that.tooltipMap, that.options.strings.editLabel);
        gpii.tests.oauth2.privacySettings.assertTooltips(that.locate("removeButton"), that.tooltipMap, that.options.strings.removeLabel);

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

    gpii.tests.oauth2.privacySettings.assertTooltips = function (buttons, tooltipMap, tooltipContent) {
        fluid.each(buttons, function (button) {
            var id = $(button).attr("id");
            var tooltip = tooltipMap[id];
            jqUnit.assertNotUndefined("The tooltip for the edit button " + id + " has been created", tooltip);
            jqUnit.assertEquals("The tooltip content is expected", tooltipContent, tooltip.options.content);
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
        jqUnit.assertTrue("The focus returns back to the add service button", that.locate("addServiceButton").is(":focus"));
    };

    gpii.tests.oauth2.privacySettings.triggerButtonEvt = function (that, buttonSelector, index, evtName) {
        var buttons = that.locate(buttonSelector);
        buttons[index][evtName]();
    };

    gpii.tests.oauth2.privacySettings.verifyClientData = function (msg, data, elements, expected) {
        fluid.each(elements, function (elm) {
            var value = data[elm];
            if (elm === "authDecisionId" || elm === "oauth2ClientId") {
                value = value.toString();
            }
            jqUnit.assertEquals(msg + "aaThe value of " + elm + " is expected", expected[elm], value);
        });
    };

    gpii.tests.oauth2.privacySettings.verifyEditPrivacySettingsDialog = function (that) {
        gpii.tests.oauth2.privacySettings.verifyClientData("The model value for currentClientData: ", gpii.tests.oauth2.privacySettings.clientData, ["serviceName", "authDecisionId", "oauth2ClientId"], that.model.currentClientData);
        gpii.tests.oauth2.privacySettings.verifyClientData("The model value of clientData in editPrivacySettingsDialog: ", gpii.tests.oauth2.privacySettings.clientData, ["serviceName", "authDecisionId", "oauth2ClientId"], that.editPrivacySettingsDialog.model.clientData);

        gpii.tests.oauth2.privacySettings.assertSubcomponents(that, ["dialogForRemoval", "addServiceMenu", "addAuthorizationDialog", "editPrivacySettingsDialog"]);
        gpii.tests.oauth2.privacySettings.assertDialog(that.editPrivacySettingsDialog, "opened");
    };

    gpii.tests.oauth2.privacySettings.verifyDialogForRemoval = function (that) {
        var expectedDialogContent = fluid.stringTemplate(that.options.strings.removeDecisionContent, {serviceName: gpii.tests.oauth2.privacySettings.clientData.serviceName});
        jqUnit.assertEquals("The authDecisionId has been set correctly in dialogForRemoval subcomponent", gpii.tests.oauth2.privacySettings.clientData.authDecisionId, parseInt(that.dialogForRemoval.model.authDecisionId, 10));
        jqUnit.assertEquals("The dialogContent has been set correctly in dialogForRemoval subcomponent", expectedDialogContent, that.dialogForRemoval.model.dialogContent);
        jqUnit.isVisible("The dialog for removing the decision is visible", that.dialogForRemoval.container);
        jqUnit.assertTrue("The dialogForRemoval container should have been instantiated as a jQuery dialog", that.dialogForRemoval.container.hasClass("ui-dialog-content"));
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.privacySettingsTest"
        ]);
    });
})(jQuery);
