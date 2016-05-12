/*!
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

    fluid.defaults("gpii.OKCancelDialog", {
        gradeNames: ["fluid.viewComponent"],
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
            },
            create: "{that}.fireCreateDialogWidget",
            open: "{that}.events.open.fire",
            close: "{that}.events.close.fire"
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
            createDialogWidget: null,
            open: null,
            close: null,
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
            "createDialogWidget.registerWidget": {
                funcName: "gpii.OKCancelDialog.registerWidget",
                args: ["{that}", "{arguments}.0"]
            },
            "createDialogWidget.registerButtonElements": {
                funcName: "gpii.OKCancelDialog.registerButtonElements",
                args: ["{that}", "{arguments}.0"]
            },
            "clickCancel.closeDialog": "{that}.close",
            onDestroy: {
                "this": "{that}.container",
                method: "dialog",
                args: ["destroy"]
            }
        },
        invokers: {
            fireCreateDialogWidget: {
                funcName: "gpii.OKCancelDialog.fireCreateDialogWidget",
                args: ["{that}"]
            },
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
        container.dialog(fluid.extend(true, {}, {dialogClass: dialogClass}, dialogOptions));
    };

    gpii.OKCancelDialog.fireCreateDialogWidget = function (that) {
        that.events.createDialogWidget.fire(that.container.dialog("widget"));
    };

    gpii.OKCancelDialog.registerWidget = function (that, widget) {
        that.widget = widget;
    };

    gpii.OKCancelDialog.registerButtonElements = function (that, widget) {
        that.okButton = widget.find("." + that.options.styles.okButtonClass);
        that.cancelButton = widget.find("." + that.options.styles.cancelButtonClass);
    };

    gpii.OKCancelDialog.updateContent = function (container, selector, content) {
        container.find(selector).html(content);
    };

})(jQuery, fluid);
