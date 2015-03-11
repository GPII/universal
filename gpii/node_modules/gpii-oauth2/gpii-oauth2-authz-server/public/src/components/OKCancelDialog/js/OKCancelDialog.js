/*!
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

    fluid.defaults("gpii.OKCancelDialog", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        dialogOptions: {
            autoOpen: false,
            resizable: false,
            modal: true,
            buttons: {
                cancelButton: {
                    click: "{that}.events.clickCancel.fire",
                    text: "{that}.options.strings.cancel",
                    "class": "{that}.options.styles.cancelButtonClass"
                },
                okButton: {
                    click: "{that}.events.clickOK.fire",
                    text: "{that}.options.strings.ok",
                    "class": "{that}.options.styles.okButtonClass"
                }
            }
        },
        selectors: {
            dialogContent: ".gpiic-OKCancelDialog-content"
        },
        styles: {
            dialogClass: "gpii-OKCancelDialog",
            cancelButtonClass: "gpii-OKCancelDialog-cancel",
            okButtonClass: "gpii-OKCancelDialog-ok"
        },
        strings: {
            cancel: "cancel",
            ok: "OK"
        },
        model: {
            dialogContent: "Dialog text"
        },
        modelListeners: {
            dialogContent: {
                funcName: "gpii.OKCancelDialog.updateContent",
                args: ["{that}.container", "{that}.options.selectors.dialogContent", "{change}.value"]
            }
        },
        events: {
            clickCancel: null,
            clickOK: null
        },
        listeners: {
            "onCreate.initDialog": {
                funcName: "gpii.OKCancelDialog.initDialog",
                args: ["{that}.container", "{that}.options.styles.dialogClass", "{that}.options.dialogOptions"]
            },
            "onCreate.setInitialDialogContent": {
                funcName: "gpii.OKCancelDialog.updateContent",
                args: ["{that}.container", "{that}.options.selectors.dialogContent", "{that}.model.dialogContent"]
            },
            "clickCancel.closeDialog": "{that}.close"
        },
        invokers: {
            open: {
                "this": "{that}.container",
                method: "dialog",
                args: ["open"]
            },
            close: {
                "this": "{that}.container",
                method: "dialog",
                args: ["close"]
            }
        }
    });

    gpii.OKCancelDialog.initDialog = function (container, dialogClass, dialogOptions) {
        container.dialog($.extend(true, {}, {dialogClass: dialogClass}, dialogOptions));
    };

    gpii.OKCancelDialog.updateContent = function (container, selector, content) {
        container.find(selector).html(content);
    };

})(jQuery, fluid);
