/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


// Declare dependencies
/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.privacySettingsDialog", {
        gradeNames: ["fluid.rendererComponent"],
        requestInfos: {
            fetchAvailableAuthorizedPrefs: {
                url: "/available-authorized-preferences/%clientId",
                type: "get"
            }
        },
        dialogOptions: {
            autoOpen: false,
            resizable: false,
            modal: true,
            width: 500,
            close: "{that}.dialogCloseHandler"
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
            description: "To allow access, please select one or more preferences to share:",
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
            afterInitialSelectedPrefsSet: null,
            afterAuthorizedPrefsSet: null,
            onCreateSelectionTree: {
                events: {
                    "afterInitialSelectedPrefsSet": "afterInitialSelectedPrefsSet",
                    "afterAuthorizedPrefsSet": "afterAuthorizedPrefsSet",
                    "afterRender": "afterRender"
                },
                args: ["{that}"]
            },
            onDone: null,
            onClose: null,
            onFetchAvailableAuthorizedPrefsSuccess: null,
            onFetchAvailableAuthorizedPrefsError: null
        },
        listeners: {
            "onCreate.fetchAuthPrefs": "{that}.fetchAvailableAuthorizedPrefs",
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
                listener: "gpii.oauth2.privacySettingsDialog.openDialog",
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
                args: "{that}.fireDone"
            },
            "onFetchAvailableAuthorizedPrefsSuccess.setAvailableAuthorizedPrefs": "{that}.setAvailableAuthorizedPrefs",
            "onFetchAvailableAuthorizedPrefsError.handleFetchPrefsError": "{that}.handleFetchPrefsError"
        },
        invokers: {
            closeDialog: {
                "this": "{that}.dialog",
                method: "dialog",
                args: ["close"]
            },
            fetchAvailableAuthorizedPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: ["{that}.options.requestInfos.fetchAvailableAuthorizedPrefs.url", {
                    clientID: "{that}.model.clientData.oauth2ClientId"
                }, {
                    dataType: "json",
                    success: "{that}.events.onFetchAvailableAuthorizedPrefsSuccess.fire",
                    error: "{that}.events.onFetchAvailableAuthorizedPrefsError.fire"
                }]
            },
            setAvailableAuthorizedPrefs: {
                funcName: "gpii.oauth2.privacySettingsDialog.setAvailableAuthorizedPrefs",
                args: ["{that}", "{arguments}.0"]
            },
            handleFetchPrefsError: {
                funcName: "fluid.fail",
                args: ["{arguments}.0.responseText"]
            },
            composeRequestURL: {
                funcName: "fluid.stringTemplate",
                args: ["{arguments}.0", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }]
            },
            setInitialSelectedPrefs: {
                funcName: "gpii.oauth2.privacySettingsDialog.setInitialSelectedPrefs",
                args: ["{that}", "{arguments}.0"]
            },
            fireDone: {
                "this": "{that}.events.onDone",
                method: "fire"
            },
            dialogCloseHandler: {
                funcName: "gpii.oauth2.privacySettingsDialog.dialogCloseHandler",
                args: ["{that}.dialog", "{that}.events.onClose"]
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
            availableAuthorizedPrefs: null,
            initialSelectedPrefs: null,
            doneButtonEnabled: false
        },
        modelListeners: {
            "availableAuthorizedPrefs": {
                listener: "{that}.events.afterAuthorizedPrefsSet",
                excludeSource: "init"
            },
            "initialSelectedPrefs": {
                listener: "{that}.events.afterInitialSelectedPrefsSet",
                excludeSource: "init"
            },
            "doneButtonEnabled": {
                listener: "gpii.oauth2.setEnabled",
                args: ["{that}.dom.done", "{that}.model.doneButtonEnabled"]
            }
        },
        components: {
            selectionTree: {
                type: "gpii.oauth2.preferencesSelectionTree",
                container: "{privacySettingsDialog}.dom.selection",
                createOnEvent: "onCreateSelectionTree",
                options: {
                    availablePrefs: "{privacySettingsDialog}.model.availableAuthorizedPrefs",
                    model: {
                        selections: {
                            expander: {
                                funcName: "gpii.oauth2.selectionTree.toSelectionsModel",
                                args: ["{privacySettingsDialog}.model.initialSelectedPrefs", "{privacySettingsDialog}.model.availableAuthorizedPrefs"]
                            }
                        }
                    },
                    modelRelay: {
                        source: "{selectionTree}.model.hasSelection",
                        target: "{privacySettingsDialog}.model.doneButtonEnabled",
                        backward: "never",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            }
        }
    });

    gpii.oauth2.privacySettingsDialog.openDialog = function (that) {
        var dialogOptions = {
            dialogClass: that.options.styles.dialogCss
        };
        var fullDialogOptions = fluid.extend(true, {}, dialogOptions, that.options.dialogOptions);
        that.dialog = that.container.dialog(fullDialogOptions);
        that.dialog.dialog("open");
    };

    gpii.oauth2.privacySettingsDialog.dialogCloseHandler = function (dialog, onCloseEvt) {
        // To restore the dialog container to the initial state for the next rendering
        dialog.dialog("destroy");
        // And fire close event
        onCloseEvt.fire();
    };

    gpii.oauth2.privacySettingsDialog.setAvailableAuthorizedPrefs = function (that, availablePrefs) {
        // fluid.isDestroyed() is to work around the issue with the IoC testing framework
        // when this function is called by the ajax call back to set the model value, due to
        // the asynchronous nature of ajax calls, the component itself sometimes has been
        // destroyed which then causes javascript errors.
        if (!fluid.isDestroyed(that)) {
            that.applier.change("availableAuthorizedPrefs", availablePrefs);
        }
    };

    gpii.oauth2.privacySettingsDialog.setInitialSelectedPrefs = function (that, initialSelectedPrefs) {
        // fluid.isDestroyed() is to work around the issue with the IoC testing framework
        // when this function is called by the ajax call back to set the model value, due to
        // the asynchronous nature of ajax calls, the component itself sometimes has been
        // destroyed which then causes javascript errors.
        if (!fluid.isDestroyed(that)) {
            that.applier.change("initialSelectedPrefs", initialSelectedPrefs);
        }
    };

})(jQuery, fluid);
