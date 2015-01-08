/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid */

var gpii = gpii || {};

(function () {
    "use strict";

    fluid.defaults("gpii.oauth2.editPrivacySettings", {
        gradeNames: ["fluid.rendererRelayComponent","autoInit"],
        requestInfos: {
            retrieveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            retrieveClientRequiredPrefs: {
                url: "/available-authorized-preferences/%clientId",
                type: "get"
            }
        },
        dialogOptions: {
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 500,
            close: function () {
                // To restore the dialog container to the initial state for the next render.
                $(this).dialog("destroy");
            }
        },
        selectors: {
            title: ".gpiic-oauth2-privacySettings-editDecision-title",
            description: ".gpiic-oauth2-privacySettings-editDecision-description",
            selection: ".gpiic-oauth2-privacySettings-editDecision-selection",
            cancel: ".gpiic-oauth2-privacySettings-editDecision-cancel",
            done: ".gpiic-oauth2-privacySettings-editDecision-done"
        },
        selectorsToIgnore: ["selection", "cancel", "done"],
        styles: {
            dialogCss: "gpii-oauth2-privacySettings-editDecision-dialog"
        },
        strings: {
            description: "Select the preferences you wish to share:",
            done: "done",
            cancel: "cancel"
        },
        renderOnInit: true,
        protoTree: {
            title: "${{that}.model.clientData.serviceName}",
            description: {
                markup: {
                    messagekey: "description"
                }
            }
        },
        events: {
            onDecisoinPrefsReady: null,
            onClientRequiredPrefsReady: null,
            onSelectionTreeTemplateReady: null,
            onCreateSelectionTreeReady: {
                events: {
                    "onDecisoinPrefsReady": "onDecisoinPrefsReady",
                    "onClientRequiredPrefsReady": "onClientRequiredPrefsReady",
                    "onSelectionTreeTemplateReady": "onSelectionTreeTemplateReady",
                    "afterRender": "afterRender"
                }
            }
        },
        listeners: {
            "onCreate.fetchSelectionTreeTemplate": {
                listener: "gpii.oauth2.editPrivacySettings.fetchSelectionTreeTemplate",
                args: ["{that}"]
            },
            "onCreate.retrieveDecisionPrefs": "{that}.retrieveDecisionPrefs",
            "onCreate.retrieveClientRequiredPrefs": "{that}.retrieveClientRequiredPrefs",
            "afterRender.setCancelButtonText": {
                "this": "{that}.dom.cancel",
                method: "text",
                args: "{that}.options.strings.cancel"
            },
            "afterRender.setDoneButtonText": {
                "this": "{that}.dom.done",
                method: "text",
                args: "{that}.options.strings.done"
            },
            "afterRender.openDialog": {
                listener: "gpii.oauth2.editPrivacySettings.openDialog",
                args: ["{that}"]
            },
            "afterRender.bindCancel": {
                "this": "{that}.dom.cancel",
                method: "click",
                args: "{that}.closeDialog"
            },
            "afterRender.bindDone": {
                "this": "{that}.dom.done",
                method: "click",
                args: "{that}.closeDialog"
            }
        },
        invokers: {
            retrieveDecisionPrefs: {
                funcName: "gpii.oauth2.editPrivacySettings.retrieveDecisionPrefs",
                args: ["{that}"]
            },
            retrieveClientRequiredPrefs: {
                funcName: "gpii.oauth2.editPrivacySettings.retrieveClientRequiredPrefs",
                args: ["{that}"]
            },
            closeDialog: {
                funcName: "gpii.oauth2.editPrivacySettings.closeDialog",
                args: ["{that}.dialog"]
            }
        },
        selectionTreeResources: {
            template: {
                forceCache: true,
                url: "../html/SelectionTreeTemplate.html"
            }
        },
        model: {
            // clientData is in a structure of:
            // {
            //     serviceName: xx,
            //     authDecisionId: xx,
            //     oauth2ClientId: xx
            // }
            clientData: null
        },
        components: {
            selectionTree: {
                type: "gpii.oauth2.preferencesSelectionTree",
                container: "{that}.dom.selection",
                createOnEvent: "onCreateSelectionTreeReady",
                options: {
                    model: {
                        expander: {
                            funcName: "gpii.oauth2.selectionTree.toModel",
                            args: [{}, "{editPrivacySettings}.clientRequiredPrefs"]
                        }
                    },
                    listeners: {
                        "onCreate.debug": "console.log"
                    }
                }
            }
        }
    });

    gpii.oauth2.editPrivacySettings.fetchSelectionTreeTemplate = function (that) {
        fluid.fetchResources(that.options.selectionTreeResources, function () {
            that.locate("selection").append(that.options.selectionTreeResources.template.resourceText);
            that.events.onSelectionTreeTemplateReady.fire();
        });
    };

    gpii.oauth2.editPrivacySettings.openDialog = function (that) {
        var dialogOptions = {
            dialogClass: that.options.styles.dialogCss,
        };
        var fullDialogOptions = $.extend(true, {}, dialogOptions, that.options.dialogOptions);
        that.dialog = that.container.dialog(fullDialogOptions);
        that.dialog.dialog("open");
    };

    gpii.oauth2.editPrivacySettings.closeDialog = function (dialog) {
        dialog.dialog("close");
    };

    gpii.oauth2.editPrivacySettings.retrieveDecisionPrefs = function (that) {
        // $.ajax({
        //     url: fluid.stringTemplate(that.options.requestInfos.retrieveDecisionPrefs.url, {authDecisionId: that.model.clientData.authDecisionId}),
        //     type: that.options.requestInfos.retrieveDecisionPrefs.type,
        //     success: function (data) {
        //         console.log(data/*, JSON.parse(data)*/);
        //         // that.applier.change("decisionPrefs", JSON.parse(data));
        //         // that.events.onDecisoinPrefsReady.fire();
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         // console.log("in error", jqXHR, textStatus, errorThrown);
        //     }
        // });
        that.events.onDecisoinPrefsReady.fire();
    };

    gpii.oauth2.editPrivacySettings.retrieveClientRequiredPrefs = function (that) {
        var clientRequiredPrefs = {
            "increase-size": true,
            "increase-size.appearance": true,
            "increase-size.appearance.text-size": true,
            "increase-size.appearance.inputs-larger": true,
            "increase-size.appearance.line-spacing": true,
            "simplify": true,
            "simplify.table-of-contents": true,
            "visual-styling": true,
            "visual-styling.change-contrast": true,
            "visual-styling.emphasize-links": true,
            "visual-styling.text-style": true
        };

        that.clientRequiredPrefs = clientRequiredPrefs;
        that.events.onClientRequiredPrefsReady.fire();
        // $.ajax({
        //     url: fluid.stringTemplate(that.options.requestInfos.retrieveClientRequiredPrefs.url, {clientId: that.model.clientData.oauth2ClientId}),
        //     type: that.options.requestInfos.retrieveClientRequiredPrefs.type,
        //     success: function (data) {
        //         console.log(data/*, JSON.parse(data)*/);
        //         // that.applier.change("clientRequiredPrefs", JSON.parse(data));
        //         // that.events.onClientRequiredPrefsReady.fire();
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         // console.log("in error", jqXHR, textStatus, errorThrown);
        //     }
        // });
    };

})();
