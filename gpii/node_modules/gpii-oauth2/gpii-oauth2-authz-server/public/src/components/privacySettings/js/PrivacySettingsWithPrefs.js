/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid, jQuery, location */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.privacySettingsWithPrefs", {
        gradeNames: ["gpii.oauth2.privacySettings","autoInit"],
        members: {
            dialogForRemoval: {
                expander: {
                    funcName: "gpii.oauth2.privacySettingsWithPrefs.initDialog",
                    args: ["{that}.dom.removeDecisionDialog", "{that}.options.styles.dialogForRemovalCss", "{that}.options.dialogOptionsForRemoval"]
                }
            }
        },
        requestInfos: {
            removeDecision: {
                url: "/authorizations",
                type: "DELETE"
            },
            fetchDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            saveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "put"
            },
            fetchAvailableAuthorizedPrefs: {
                url: "src/shared/data/available-authorized-preferences.json"
            }
        },
        components: {
            editPrivacySettings: {
                type: "gpii.oauth2.editPrivacySettings",
                container: "{privacySettingsWithPrefs}.dom.editDecisionDialog",
                createOnEvent: "onRenderEditDialog",
                options: {
                    requestInfos: "{privacySettingsWithPrefs}.options.requestInfos",
                    model: {
                        clientData: "{privacySettingsWithPrefs}.model.currentClientData"
                    }
                }
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
            dialogForRemovalCss: "gpii-oauth2-privacySettings-dialogForRemoval",
            okButtonCss: "gpii-oauth2-privacySettings-removeDecision-ok",
            cancelButtonCss: "gpii-oauth2-privacySettings-removeDecision-cancel"
        },
        selectorsToIgnore: ["editButton", "removeButton", "serviceName", "authDecisionId", "oauth2ClientId", "removeDecisionDialog", "removeDecisionContent", "editDecisionDialog"],
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
            directions: {messagekey: "directions"}
        },
        tooltipOptions: {
            delay: 0,
            duration: 0,
            position: {
                my: "left+35 bottom-10"
            }
        },
        dialogOptionsForRemoval: {
            autoOpen: false,
            resizable: false,
            modal: true
        },
        events: {
            onRenderEditDialog: null
        },
        listeners: {
            "afterRender.createTooltips": {
                listener: "gpii.oauth2.privacySettingsWithPrefs.createTooltips",
                args: ["{that}"]
            },
            "afterRender.bindRemove": {
                "this": "{that}.dom.removeButton",
                method: "click",
                args: "{that}.popupDialogForRemoval"
            },
            "afterRender.bindEdit": {
                "this": "{that}.dom.editButton",
                method: "click",
                args: "{that}.renderDialogForEdit"
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
            renderDialogForEdit: {
                funcName: "gpii.oauth2.privacySettingsWithPrefs.renderDialogForEdit",
                args: ["{arguments}.0", "{that}"]
            }
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

    gpii.oauth2.privacySettingsWithPrefs.initDialog = function (dialogContainer, dialogForRemovalCss, dialogOptions) {
        return dialogContainer.dialog($.extend(true, {}, {dialogClass: dialogForRemovalCss}, dialogOptions));
    };

    gpii.oauth2.privacySettingsWithPrefs.createTooltips = function (that) {
        var editButtons = that.locate("editButton");
        var removeButtons = that.locate("removeButton");

        var tooltipOptionsForEdit = $.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.editLabel});
        var tooltipOptionsForRemove = $.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.removeLabel});

        fluid.each(editButtons, function (thisEditButton) {
            fluid.tooltip(thisEditButton, tooltipOptionsForEdit);
        });
        fluid.each(removeButtons, function (thisRemoveButton) {
            fluid.tooltip(thisRemoveButton, tooltipOptionsForRemove);
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
                    "class": that.options.styles.cancelButtonCss
                },
                okButton: {
                    click: function () {
                        // send a request to remove the authorization
                        $.ajax({
                            url: that.options.requestInfos.removeDecision.url + "/" + clientData.authDecisionId,
                            type: that.options.requestInfos.removeDecision.type,
                            success: function () {
                                if (that.options.requestInfos.removeDecision.redirectTo) {
                                    location.reload(true);
                                }
                            }
                        });
                        $(this).dialog("close");
                    },
                    text: that.options.strings.ok,
                    "class": that.options.styles.okButtonCss
                }
            }
        };

        dialogForRemoval.dialog("option", dialogOptions);
        dialogForRemoval.dialog("open");
    };

    gpii.oauth2.privacySettingsWithPrefs.renderDialogForEdit = function (evt, that) {
        that.applier.change("currentClientData", that.getClientData(evt.target));
        that.events.onRenderEditDialog.fire();
    };

    fluid.defaults("gpii.oauth2.selectionTreeTemplate", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        selectionTreeTemplate: "../../selectionTree/html/SelectionTreeTemplate.html",
        distributeOptions: {
            source: "{that}.options.selectionTreeTemplate",
            target: "{that selectionTree}.options.resources.template.href"
        }
    });
})(jQuery, fluid);
