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
/* global fluid, jQuery, window */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.privacySettings", {
        gradeNames: ["fluid.rendererComponent"],
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
                url: "src/core/available-authorized-preferences/%clientID.json"
            }
        },
        components: {
            editPrivacySettingsDialog: {
                type: "gpii.oauth2.editPrivacySettingsDialog",
                container: "{privacySettings}.dom.editDecisionDialog",
                createOnEvent: "onRenderEditDialog",
                options: {
                    requestInfos: "{privacySettings}.options.requestInfos",
                    model: {
                        clientData: "{privacySettings}.model.currentClientData"
                    }
                }
            },
            addAuthorizationDialog: {
                type: "gpii.oauth2.addAuthorizationDialog",
                container: "{privacySettings}.dom.addAuthorizationDialog",
                createOnEvent: "onRenderAddAuthorizationDialog",
                options: {
                    requestInfos: "{privacySettings}.options.requestInfos",
                    model: {
                        clientData: "{privacySettings}.model.currentClientData"
                    },
                    listeners: {
                        "authorizationAdded.reload": "gpii.oauth2.privacySettings.reload",
                        "onClose.closeAddServiceMenu": {
                            "this": "{addServiceMenu}",
                            method: "close"
                        }
                    }
                }
            },
            dialogForRemoval: {
                type: "gpii.OKCancelDialog",
                container: "{privacySettings}.dom.removeDecisionDialog",
                options: {
                    selectors: {
                        dialogContent: "{privacySettings}.options.selectors.removeDecisionContent"
                    },
                    styles: {
                        dialogClass: "{privacySettings}.options.styles.dialogForRemovalClass",
                        cancelButtonClass: "{privacySettings}.options.styles.cancelButtonClass",
                        okButtonClass: "{privacySettings}.options.styles.okButtonClass"
                    },
                    model: {
                        authDecisionId: null
                    },
                    listeners: {
                        "clickOK.removeDecision": {
                            funcName: "gpii.oauth2.privacySettings.removeDecision",
                            args: [
                                "{that}",
                                "{privacySettings}.options.requestInfos.removeDecision.url",
                                "{privacySettings}.options.requestInfos.removeDecision.type",
                                "{that}.model.authDecisionId",
                                "{privacySettings}.events.onRemovalSuccess"
                            ]
                        }
                    }
                }
            },
            addServiceMenu: {
                type: "gpii.oauth2.servicesMenu",
                container: "{privacySettings}.dom.addServiceMenu",
                createOnEvent: "afterRender",
                options: {
                    listeners: {
                        "onServiceSelected.addService": {
                            funcName: "gpii.oauth2.privacySettings.addService",
                            args: ["{privacySettings}", "{addServiceMenu}", "{arguments}.0", "{arguments}.1"]
                        },
                        "onClose.setFocus": {
                            funcName: "fluid.focus",
                            args: ["{privacySettings}.dom.addServiceButton"]
                        }
                    },
                    modelListeners: {
                        isMenuOpen: {
                            "this": "{privacySettings}.dom.addService",
                            method: "toggleClass",
                            args: ["{privacySettings}.options.styles.addServiceSelected", "{change}.value"]
                        }
                    }
                }
            }
        },
        selectors: {
            user: ".gpiic-oauth2-privacySettings-user",
            logout: ".gpiic-oauth2-privacySettings-logout",
            header: ".gpiic-oauth2-privacySettings-header",
            description: ".gpiic-oauth2-privacySettings-description",
            directions: ".gpiic-oauth2-privacySettings-directions",
            removeServiceLabel: ".gpiic-oauth2-privacySettings-removeServiceLabel",
            editButton: ".gpiic-oauth2-privacySettings-edit",
            removeButton: ".gpiic-oauth2-privacySettings-removeService",
            serviceName: ".gpiic-oauth2-privacySettings-serviceName",
            authDecisionId: ".gpiic-oauth2-privacySettings-authDecisionId",
            oauth2ClientId: ".gpiic-oauth2-privacySettings-oauth2ClientId",
            removeDecisionDialog: ".gpiic-oauth2-privacySettings-removeDecision-dialog",
            removeDecisionContent: ".gpiic-oauth2-privacySettings-removeDecision-content",
            editDecisionDialog: ".gpiic-oauth2-privacySettings-editDecision-dialog",
            addService: ".gpiic-oauth2-privacySettings-addService",
            addServiceButton: ".gpiic-oauth2-privacySettings-addServiceButton",
            addServiceMenu: ".gpiic-oauth2-privacySettings-addServiceMenu",
            addAuthorizationDialog: ".gpiic-oauth2-privacySettings-addAuthorizationDialog"
        },
        styles: {
            dialogForRemovalClass: "gpii-oauth2-privacySettings-dialogForRemoval",
            okButtonClass: "gpii-oauth2-privacySettings-removeDecision-ok",
            cancelButtonClass: "gpii-oauth2-privacySettings-removeDecision-cancel",
            addServiceSelected: "gpii-oauth2-privacySettings-addService-selected"
        },
        selectorsToIgnore: ["editButton", "removeButton", "serviceName", "authDecisionId", "oauth2ClientId", "removeDecisionDialog", "removeDecisionContent", "editDecisionDialog", "addService", "addServiceButton", "addServiceMenu", "addAuthorizationDialog"],
        strings: {
            logout: "Log Out",
            header: "Privacy",
            description: "<p>Services listed here will be able to access your " +
                         "GPII preferences. For services which do not appear " +
                         "in this list, you will be given the option to allow " +
                         "or deny access when first encountering each service.</p>" +
                         "<p>Services may include things like a social media web " +
                         "application or an online banking website.</p>",
            directions: "Allow the following services to access my preferences:",
            removeServiceLabel: "remove",
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
        events: {
            onRenderEditDialog: null,
            onRenderAddAuthorizationDialog: null,
            onRemovalSuccess: null    // fired with an argument: authDecisionId
        },
        listeners: {
            "afterRender.createTooltips": {
                listener: "gpii.oauth2.privacySettings.createTooltips",
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
            },
            "afterRender.bindAddService": {
                "this": "{that}.dom.addServiceButton",
                method: "click",
                args: "{that}.openAddServiceMenu"
            },
            "onRemovalSuccess.reload": "gpii.oauth2.privacySettings.reload"
        },
        invokers: {
            getClientData: {
                funcName: "gpii.oauth2.privacySettings.getClientData",
                args: ["{arguments}.0", "{arguments}.1", "{that}.options.selectors.serviceName", "{that}.options.selectors.authDecisionId", "{that}.options.selectors.oauth2ClientId"]
            },
            popupDialogForRemoval: {
                funcName: "gpii.oauth2.privacySettings.popupDialogForRemoval",
                args: ["{arguments}.0", "{that}"]
            },
            renderDialogForEdit: {
                funcName: "gpii.oauth2.privacySettings.renderDialogForEdit",
                args: ["{arguments}.0", "{that}"]
            },
            openAddServiceMenu: {
                funcName: "gpii.oauth2.privacySettings.openAddServiceMenu",
                args: ["{addServiceMenu}", "{arguments}.0"] // event
            }
        }
    });

    gpii.oauth2.privacySettings.getClientData = function (element, buttonSelector, serviceNameSelector, authDecisionIdSelector, oauth2ClientIdSelector) {
        element = $(element).closest(buttonSelector);
        return {
            serviceName: element.siblings(serviceNameSelector).attr("value"),
            authDecisionId: element.siblings(authDecisionIdSelector).attr("value"),
            oauth2ClientId: element.siblings(oauth2ClientIdSelector).attr("value")
        };
    };

    gpii.oauth2.privacySettings.createTooltips = function (that) {
        var editButtons = that.locate("editButton");
        var removeButtons = that.locate("removeButton");

        var tooltipOptionsForEdit = fluid.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.editLabel});
        var tooltipOptionsForRemove = fluid.extend(true, {}, that.options.tooltipOptions, {content: that.options.strings.removeLabel});

        fluid.each(editButtons, function (thisEditButton) {
            fluid.tooltip(thisEditButton, tooltipOptionsForEdit);
        });
        fluid.each(removeButtons, function (thisRemoveButton) {
            fluid.tooltip(thisRemoveButton, tooltipOptionsForRemove);
        });
    };

    gpii.oauth2.privacySettings.popupDialogForRemoval = function (evt, that) {
        var clientData = that.getClientData(evt.target, that.options.selectors.removeButton);
        var dialogContent = fluid.stringTemplate(that.options.strings.removeDecisionContent, {serviceName: clientData.serviceName});

        var dialogForRemoval = that.dialogForRemoval;
        dialogForRemoval.applier.change("dialogContent", dialogContent);
        dialogForRemoval.applier.change("authDecisionId", clientData.authDecisionId);

        dialogForRemoval.open();
    };

    gpii.oauth2.privacySettings.removeDecision = function (dialog, url, type, authDecisionId, removalSuccessEvt) {
        gpii.oauth2.ajax(url + "/" + authDecisionId, {}, {
            type: type,
            success: function () {
                removalSuccessEvt.fire(authDecisionId);
            }
        });
        dialog.close();
    };

    gpii.oauth2.privacySettings.renderDialogForEdit = function (evt, that) {
        that.applier.change("currentClientData", that.getClientData(evt.target, that.options.selectors.editButton));
        that.events.onRenderEditDialog.fire();
    };

    gpii.oauth2.privacySettings.openAddServiceMenu = function (menu, event) {
        event.stopPropagation();
        menu.open();
    };

    gpii.oauth2.privacySettings.addService = function (that, menu, serviceName, oauth2ClientId) {
        menu.keepOpen();
        var clientDataForAdd = {
            serviceName: serviceName,
            oauth2ClientId: oauth2ClientId,
            // TODO: The line below can be removed by uncommenting line 307
            // when the infusion used by GPII is upgraded, which currently is in
            // this pull request: https://github.com/GPII/universal/pull/425
            authDecisionId: undefined
        };
        // that.applier.fireChangeRequest({path: "currentClientData.authDecisionId", type: "DELETE"});
        that.applier.change("currentClientData", clientDataForAdd);
        that.events.onRenderAddAuthorizationDialog.fire();
    };

    // The use of this function is not made declaratively on the component tree is to work around
    // an IE issue - https://issues.gpii.net/browse/GPII-1522
    gpii.oauth2.privacySettings.reload = function () {
        window.location.reload(true);
    };

    fluid.defaults("gpii.oauth2.selectionTreeTemplate", {
        gradeNames: ["fluid.component"],
        selectionTreeTemplate: "../../selectionTree/html/SelectionTreeTemplate.html",
        distributeOptions: {
            source: "{that}.options.selectionTreeTemplate",
            target: "{that selectionTree}.options.resources.template.href"
        }
    });
})(jQuery, fluid);
