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
            retrieveAvailableAuthorizedPrefs: {
                url: "src/shared/data/available-authorized-preferences.json",
                // url: "/available-authorized-preferences/%clientId",
                // type: "get"
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
            afterAuthorizedPrefsSet: null,
            onSelectionTreeTemplateReady: null,
            onCreateSelectionTree: {
                events: {
                    "onDecisoinPrefsReady": "onDecisoinPrefsReady",
                    "afterAuthorizedPrefsSet": "afterAuthorizedPrefsSet",
                    "onSelectionTreeTemplateReady": "onSelectionTreeTemplateReady",
                    "afterRender": "afterRender"
                },
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.appendSelectionTreeTemplate": {
                listener: "gpii.oauth2.editPrivacySettings.appendSelectionTreeTemplate",
                args: ["{that}"]
            },
            "onCreate.fetchAuthPrefs": "{that}.fetchAvailableAuthorizedPrefs",
            "onCreate.retrieveAvailableAuthorizedPrefs": "{that}.retrieveAvailableAuthorizedPrefs",
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
            retrieveAvailableAuthorizedPrefs: {
                funcName: "gpii.oauth2.editPrivacySettings.retrieveAvailableAuthorizedPrefs",
                args: ["{that}"]
            },
            closeDialog: {
                funcName: "gpii.oauth2.editPrivacySettings.closeDialog",
                args: ["{that}.dialog"]
            },
            fetchAvailableAuthorizedPrefs: {
                "this": "$",
                "method": "ajax",
                args: ["{that}.options.requestInfos.retrieveAvailableAuthorizedPrefs.url", {
                    //TODO: Handle errors
                    // type: "{that}.options.requestInfos.retrieveAvailableAuthorizedPrefs.type"
                    dataType: "json",
                    success: "{that}.setAvailableAuthorizedPrefs"
                }]
            },
            setAvailableAuthorizedPrefs: {
                changePath: "availableAuthorizedPrefs",
                value: "{arguments}.0"
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
            clientData: null,
            afterAuthorizedPrefsSet: {}
        },
        components: {
            selectionTree: {
                type: "gpii.oauth2.preferencesSelectionTree",
                container: "{that}.dom.selection",
                createOnEvent: "onCreateSelectionTree",
                options: {
                    requestedPrefs: "{editPrivacySettings}.model.availableAuthorizedPrefs",
                    model: {
                        expander: {
                            funcName: "gpii.oauth2.selectionTree.toModel",
                            args: [{"increase-size.appearance.text-size": true}, "{editPrivacySettings}.model.availableAuthorizedPrefs"]
                        }
                    },
                    listeners: {
                        "onCreate.debug": "console.log"
                    }
                }
            }
        },
        modelListeners: {
            "availableAuthorizedPrefs": {
                listener: "{that}.events.afterAuthorizedPrefsSet",
                excludeSource: "init"
            }
        },
    });

    gpii.oauth2.editPrivacySettings.appendSelectionTreeTemplate = function (that) {
        var template = that.options.selectionTreeResources.template.resourceText;
        fluid.fetchResources(that.options.selectionTreeResources, function () {
            that.locate("selection").html(that.options.selectionTreeResources.template.resourceText);
            that.events.onSelectionTreeTemplateReady.fire();
        });
    };

    gpii.oauth2.editPrivacySettings.openDialog = function (that) {
        var dialogOptions = {
            dialogClass: that.options.styles.dialogCss
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

    gpii.oauth2.editPrivacySettings.retrieveAvailableAuthorizedPrefs = function (that) {
        // $.ajax({
        //     url: fluid.stringTemplate(that.options.requestInfos.retrieveAvailableAuthorizedPrefs.url, {clientId: that.model.clientData.oauth2ClientId}),
        //     type: that.options.requestInfos.retrieveAvailableAuthorizedPrefs.type,
        //     success: function (data) {
        //         console.log(data/*, JSON.parse(data)*/);
        //         // that.applier.change("clientRequiredPrefs", JSON.parse(data));
        //         // that.events.afterAuthorizedPrefsSet.fire();
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         // console.log("in error", jqXHR, textStatus, errorThrown);
        //     }
        // });
    };

})();
