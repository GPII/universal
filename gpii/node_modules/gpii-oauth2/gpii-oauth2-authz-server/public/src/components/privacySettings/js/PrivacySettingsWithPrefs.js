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

    fluid.defaults("gpii.oauth2.privacySettingsWithPrefs", {
        gradeNames: ["gpii.oauth2.privacySettings","autoInit"],
        members: {
            dialogForRemoval: {
                expander: {
                    funcName: "gpii.oauth2.privacySettingsWithPrefs.initDialog",
                    args: ["{that}.dom.removeDecisionDialog", "{that}.options.styles.dialogForRemovalClass"]
                }
            },
            dialogForEdit: {
                expander: {
                    funcName: "gpii.oauth2.privacySettingsWithPrefs.initDialog",
                    args: ["{that}.dom.editDecisionDialog", "{that}.options.styles.dialogForEditClass"]
                }
            }
        },
        requestInfos: {
            removeDecision: {
                url: "/authorization",
                type: "DELETE",
                redirectTo: "/authorized-services"
            }
        },
        selectors: {
            editButton: ".gpiic-oauth2-privacySettings-edit",
            removeButton: ".gpiic-oauth2-privacySettings-removeService",
            serviceName: "#gpiic-oauth2-privacySettings-serviceName",
            authDecisionId: "#gpiic-oauth2-privacySettings-authDecisionId",
            oauth2ClientId: "#gpiic-oauth2-privacySettings-oauth2ClientId",
            removeDecisionDialog: ".gpiic-oauth2-privacySettings-removeDecision-dialog",
            removeDecisionContent: ".gpiic-oauth2-privacySettings-removeDecision-content",
            editDecisionDialog: ".gpiic-oauth2-privacySettings-editDecision-dialog"
        },
        styles: {
            dialogForRemovalClass: "gpii-oauth2-privacySettings-dialogForRemoval",
            dialogForRemovalOkButton: "gpii-oauth2-privacySettings-removeDecision-ok",
            dialogForRemovalCancelButton: "gpii-oauth2-privacySettings-removeDecision-cancel",
            dialogForEditClass: "gpii-oauth2-privacySettings-dialogForEdit"
        },
        selectorsToIgnore: ["editButton", "removeButton", "serviceName", "authDecisionId", "oauth2ClientId", "removeDecisionDialog", "removeDecisionContent"],
        strings: {
            editLabel: "edit",
            removeLabel: "delete",
            removeDecisionContent: "Remove %serviceName from your list of allowed services?",
            ok: "OK",
            cancel: "cancel"
        },
        model: {
            user: "username"
        },
        renderOnInit: true,
        protoTree: {
            user: "${{that}.model.user}",
            logout: {messagekey: "logout"},
            header: {messagekey: "header"},
            description: {
                markup: {
                    messagekey: "description"
                }
            },
            directions: {messagekey: "directions"},
        },
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left+35 bottom-10"
            }
        },
        components: {
            tooltipForEdit: {
                type: "fluid.tooltip",
                container: "{privacySettingsWithPrefs}.dom.editButton",
                createOnEvent: "afterRender",
                options: {
                    content: "{privacySettingsWithPrefs}.options.strings.editLabel"
                }
            },
            tooltipForDelete: {
                type: "fluid.tooltip",
                container: "{privacySettingsWithPrefs}.dom.removeButton",
                createOnEvent: "afterRender",
                options: {
                    content: "{privacySettingsWithPrefs}.options.strings.removeLabel"
                }
            }
        },
        events: {
            onRenderEditContent: null
        },
        listeners: {
            "afterRender.bindRemove": {
                "this": "{that}.dom.removeButton",
                method: "click",
                args: "{that}.popupDialogForRemoval"
            },
            "afterRender.bindEdit": {
                "this": "{that}.dom.editButton",
                method: "click",
                args: "{that}.populateDialogForEdit"
            }
        },
        invokers: {
            getClientData: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.getClientData",
                args: ["{arguments}.0", "{that}.options.selectors.serviceName", "{that}.options.selectors.authDecisionId", "{that}.options.selectors.oauth2ClientId"]
            },
            popupDialogForRemoval: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.popupDialogForRemoval",
                args: ["{arguments}.0", "{that}"]
            },
            populateDialogForEdit: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.populateDialogForEdit",
                args: ["{arguments}.0", "{that}"]
            }
        },
        distributeOptions: {
            source: "{that}.options.tooltipOptions",
            target: "{that > fluid.tooltip}.options"
        }
    });

    gpii.oauth2.privacySettingsWithPrefs.getClientData = function (element, serviceNameSelector, authDecisionIdSelector, oauth2ClientIdSelector) {
        element = $(element);
        return {
            serviceName: element.siblings(serviceNameSelector).attr("value"),
            authDecisionId: element.siblings(authDecisionIdSelector).attr("value"),
            oauth2ClientId: element.siblings(oauth2ClientIdSelector).attr("value")
        };
    };

    gpii.oauth2.privacySettingsWithPrefs.initDialog = function (dialogContainer, dialogForRemovalClass) {
        return dialogContainer.dialog({
            autoOpen: false,
            resizable: false,
            model: true,
            dialogClass: dialogForRemovalClass
        });
    };

    gpii.oauth2.privacySettingsWithPrefs.popupDialogForRemoval = function (evt, that) {
        var clientData = that.getClientData(evt.target);
        var dialogForRemoval = that.dialogForRemoval;
        var dialogContent = fluid.stringTemplate(that.options.strings.removeDecisionContent, {serviceName: clientData.serviceName});
        dialogForRemoval.find(that.options.selectors.removeDecisionContent).html(dialogContent);

        var dialogOptions = {
            buttons: {
                cancelButton: {
                    click: function () {
                        $(this).dialog("close");
                    },
                    text: that.options.strings.cancel,
                    "class": that.options.styles.dialogForRemovalCancelButton
                },
                okButton: {
                    click: function () {
                        // send a request to remove the authorization
                        $.ajax({
                            url: that.options.requestInfos.removeDecision.url,
                            type: that.options.requestInfos.removeDecision.type,
                            data: "remove=" + clientData.authDecisionId,
                            success: function () {
                                if (that.options.requestInfos.removeDecision.redirectTo) {
                                    window.location = that.options.requestInfos.removeDecision.redirectTo;
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                // console.log("in error", jqXHR, textStatus, errorThrown);
                            }
                        });
                        $(this).dialog("close");
                    },
                    text: that.options.strings.ok,
                    "class": that.options.styles.dialogForRemovalOkButton
                }
            }
        };

        dialogForRemoval.dialog("option", dialogOptions);
        dialogForRemoval.dialog("open");
    };

    gpii.oauth2.privacySettingsWithPrefs.populateDialogForEdit = function (evt, that) {
        that.currentClientData = that.getClientData(evt.target);
        that.events.onRenderEditContent.fire();
    };
})();
