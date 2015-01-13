/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.editPrivacySettings", {
        gradeNames: ["fluid.rendererRelayComponent","autoInit"],
        requestInfos: {
            fetchDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            saveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "put"
            },
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
            afterDecisionPrefsSet: null,
            afterAuthorizedPrefsSet: null,
            onCreateSelectionTree: {
                events: {
                    "afterDecisionPrefsSet": "afterDecisionPrefsSet",
                    "afterAuthorizedPrefsSet": "afterAuthorizedPrefsSet",
                    "afterRender": "afterRender"
                },
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.fetchAuthPrefs": "{that}.fetchAvailableAuthorizedPrefs",
            "onCreate.fetchDecisionPrefs": "{that}.fetchDecisionPrefs",
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
                args: "{that}.savePrefsAndExit"
            }
        },
        invokers: {
            closeDialog: {
                "this": "{that}.dialog",
                method: "dialog",
                args: ["close"]
            },
            fetchDecisionPrefs: {
                "this": "$",
                "method": "ajax",
                args: [{
                    expander: {
                        funcName: "{that}.composeRequestURL",
                        args: ["{that}.options.requestInfos.fetchDecisionPrefs.url"]
                    }
                }, {
                    type: "{that}.options.requestInfos.fetchDecisionPrefs.type",
                    dataType: "json",
                    success: "{that}.setDecisionPrefs"
                }]
            },
            saveDecisionPrefs: {
                "this": "$",
                "method": "ajax",
                args: [{
                    expander: {
                        funcName: "{that}.composeRequestURL",
                        args: ["{that}.options.requestInfos.saveDecisionPrefs.url"]
                    }
                }, {
                    type: "{that}.options.requestInfos.saveDecisionPrefs.type",
                    dataType: "json",
                    contentType: "application/json",
                    data: {
                        expander: {
                            funcName: "JSON.stringify",
                            args: ["{that}.selectedPrefs"]
                        }
                    }
                }]
            },
            fetchAvailableAuthorizedPrefs: {
                "this": "$",
                "method": "ajax",
                args: ["{that}.options.requestInfos.fetchAvailableAuthorizedPrefs.url", {
                    //TODO: Handle errors
                    dataType: "json",
                    success: "{that}.setAvailableAuthorizedPrefs"
                }]
            },
            setAvailableAuthorizedPrefs: {
                changePath: "availableAuthorizedPrefs",
                value: "{arguments}.0"
            },
            composeRequestURL: {
                funcName: "fluid.stringTemplate",
                args: ["{arguments}.0", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }]
            },
            setDecisionPrefs: {
                changePath: "decisionPrefs",
                value: "{arguments}.0"
            },
            savePrefsAndExit: {
                funcName: "gpii.oauth2.editPrivacySettings.savePrefsAndExit",
                args: ["{that}"]
            },
            setSelectedPrefs: {
                funcName: "fluid.set",
                args: ["{that}", "selectedPrefs", "{arguments}.0"]
            },
            setDoneState: {
                "funcName": "gpii.oauth2.editPrivacySettings.setDisabled",
                "args": ["{that}.dom.done", "{arguments}.0"]
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
            afterAuthorizedPrefsSet: null,
            decisionPrefs: null
        },
        modelListeners: {
            "availableAuthorizedPrefs": {
                listener: "{that}.events.afterAuthorizedPrefsSet",
                excludeSource: "init"
            },
            "decisionPrefs": {
                listener: "{that}.events.afterDecisionPrefsSet",
                excludeSource: "init"
            }
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
                            args: ["{editPrivacySettings}.model.decisionPrefs", "{editPrivacySettings}.model.availableAuthorizedPrefs"]
                        }
                    },
                    modelListeners: {
                        "": {
                            listener: "{editPrivacySettings}.setSelectedPrefs",
                            args: [{
                                expander: {
                                    func: "{that}.toServerModel"
                                }
                            }]
                        },
                        "value": {
                            listener: "{editPrivacySettings}.setDoneState",
                            args: ["{change}.value"]
                        }
                    }
                }
            }
        }
    });

    gpii.oauth2.editPrivacySettings.openDialog = function (that) {
        var dialogOptions = {
            dialogClass: that.options.styles.dialogCss
        };
        var fullDialogOptions = $.extend(true, {}, dialogOptions, that.options.dialogOptions);
        that.dialog = that.container.dialog(fullDialogOptions);
        that.dialog.dialog("open");
    };

    gpii.oauth2.editPrivacySettings.savePrefsAndExit = function (that) {
        that.saveDecisionPrefs();
        that.closeDialog();
    };

    gpii.oauth2.editPrivacySettings.setDisabled = function (elm, state) {
        var hasSelection = state && state !== "unchecked";
        elm.prop("disabled", !hasSelection);
    };

})(jQuery, fluid);
