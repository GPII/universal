/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// Declare dependencies
/* global fluid, gpii, jQuery */

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.oauth2.servicesMenu", {
        gradeNames: ["fluid.viewComponent"],
        widgetOptions: {
            select: "{that}.fireOnServiceSelected",
            focus: "{that}.addMenuItemFocusCss"
        },
        events: {
            onServiceSelected: null,
            onClose: null
        },
        model: {
            isMenuOpen: false
        },
        modelListeners: {
            isMenuOpen: [{
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.menuOpen", "{change}.value"]
            }, {
                funcName: "gpii.oauth2.servicesMenu.handleMenuState",
                args: [
                    "{that}.container",
                    "{that}.model.isMenuOpen",
                    "{that}.close",
                    "{that}.events.onClose"
                ],
                excludeSource: "init"
            }]
        },
        listeners: {
            "onCreate.setup": {
                "this": "{that}.container",
                method: "menu",
                args: ["{that}.options.widgetOptions"]
            },
            "onCreate.bindEscape": {
                "this": "{that}.container",
                method: "keydown",
                args: ["{that}.bindEscape"]
            }
        },
        invokers: {
            open: {
                changePath: "isMenuOpen",
                value: true
            },
            close: {
                changePath: "isMenuOpen",
                value: false
            },
            keepOpen: {
                funcName: "gpii.oauth2.servicesMenu.removeGlobalDismissal",
                args: ["{that}.container"]
            },
            bindEscape: {
                funcName: "gpii.oauth2.servicesMenu.bindEscape",
                args: ["{that}", "{arguments}.0"] // event
            },
            fireOnServiceSelected: {
                funcName: "gpii.oauth2.servicesMenu.fireOnServiceSelected",
                args: [
                    "{that}",
                    "{that}.options.selectors.serviceName",
                    "{that}.options.selectors.oauth2ClientId",
                    "{arguments}.0", // jQuery UI: event
                    "{arguments}.1"  // jQuery UI: ui
                ]
            },
            addMenuItemFocusCss: {
                funcName: "gpii.oauth2.servicesMenu.addMenuItemFocusCss",
                args: ["{arguments}.1.item", "{that}.options.styles.menuItemFocus"]
            }
        },
        selectors: {
            serviceName: ".gpiic-oauth2-servicesMenu-serviceName",
            oauth2ClientId: "[name=oauth2ClientId]"
        },
        styles: {
            menuOpen: "gpii-oauth2-servicesMenuOpen",
            menuItemFocus: "gpii-oauth2-servicesMenuItem-focused"
        }
    });

    gpii.oauth2.servicesMenu.handleMenuState = function (container, isOpen, closeFunc, onCloseEvt) {
        if (isOpen) {
            fluid.focus(container);
            gpii.oauth2.servicesMenu.registerGlobalDismissal(container, closeFunc);
        } else {
            gpii.oauth2.servicesMenu.removeGlobalDismissal(container);
            onCloseEvt.fire();
        }
    };

    gpii.oauth2.servicesMenu.registerGlobalDismissal = function (container, closeFunc) {
        fluid.globalDismissal({ menu: container }, closeFunc);
    };

    gpii.oauth2.servicesMenu.removeGlobalDismissal = function (container) {
        fluid.globalDismissal({ menu: container }, null);
    };

    gpii.oauth2.servicesMenu.bindEscape = function (that, evt) {
        if (evt.keyCode === $.ui.keyCode.ESCAPE) {
            that.close();
        }
    };

    gpii.oauth2.servicesMenu.fireOnServiceSelected = function (that, serviceNameSelector, oauth2ClientIdSelector, evt, ui) {
        var serviceName = ui.item.find(serviceNameSelector).text();
        var oauth2ClientId = ui.item.find(oauth2ClientIdSelector).attr("value");
        that.events.onServiceSelected.fire(serviceName, oauth2ClientId);
    };

    gpii.oauth2.servicesMenu.addMenuItemFocusCss = function (menuItem, cssClass) {
        // Remove the pre-applied focus css from other menu items
        menuItem.siblings("li").removeClass(cssClass);
        menuItem.addClass(cssClass);
    };

})(jQuery, fluid);
