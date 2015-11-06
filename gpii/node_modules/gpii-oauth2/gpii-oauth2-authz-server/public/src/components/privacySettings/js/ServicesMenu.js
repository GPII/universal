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
        gradeNames: ["fluid.viewComponent", "autoInit"],
        widgetOptions: {
            select: "{that}.fireServiceSelected"
        },
        events: {
            serviceSelected: null
        },
        model: {
            menuIsOpen: false
        },
        modelListeners: {
            menuIsOpen: {
                funcName: "gpii.oauth2.servicesMenu.updateVisibility",
                args: [
                    "{that}.container",
                    "{that}.model.menuIsOpen",
                    "{that}.options.styles.menuOpen",
                    "{that}.close"
                ]
            }
        },
        listeners: {
            "onCreate.setup": "gpii.oauth2.servicesMenu.setup"
        },
        invokers: {
            open: {
                funcName: "gpii.oauth2.servicesMenu.open",
                args: ["{that}"]
            },
            close: {
                funcName: "gpii.oauth2.servicesMenu.close",
                args: ["{that}"]
            },
            keepOpen: {
                funcName: "gpii.oauth2.servicesMenu.keepOpen",
                args: ["{that}.container"]
            },
            fireServiceSelected: {
                funcName: "gpii.oauth2.servicesMenu.fireServiceSelected",
                args: [
                    "{that}",
                    "{that}.options.selectors.serviceName",
                    "{that}.options.selectors.oauth2ClientId",
                    "{arguments}.0",
                    "{arguments}.1"
                ]
            }
        },
        selectors: {
            serviceName: ".gpiic-oauth2-servicesMenu-serviceName",
            oauth2ClientId: "[name=oauth2ClientId]"
        },
        styles: {
            menuOpen: "gpii-oauth2-servicesMenuOpen"
        }
    });

    gpii.oauth2.servicesMenu.setup = function (that) {
        that.container.menu(that.options.widgetOptions);
    };

    gpii.oauth2.servicesMenu.updateVisibility = function (container, isOpen, menuOpenStyle, closeFunc) {
        container.toggleClass(menuOpenStyle, isOpen);
        if (isOpen) {
            fluid.focus(container);
            gpii.oauth2.servicesMenu.registerGlobalDismissal(container, closeFunc);
        } else {
            gpii.oauth2.servicesMenu.removeGlobalDismissal(container);
        }
    };

    gpii.oauth2.servicesMenu.registerGlobalDismissal = function (container, closeFunc) {
        fluid.globalDismissal({ menu: container }, closeFunc);
    };

    gpii.oauth2.servicesMenu.removeGlobalDismissal = function (container) {
        fluid.globalDismissal({ menu: container }, null);
    };

    gpii.oauth2.servicesMenu.open = function (that) {
        that.applier.change("menuIsOpen", true);
    };

    gpii.oauth2.servicesMenu.close = function (that) {
        that.applier.change("menuIsOpen", false);
    };

    gpii.oauth2.servicesMenu.keepOpen = function (container) {
        gpii.oauth2.servicesMenu.removeGlobalDismissal(container);
    };

    gpii.oauth2.servicesMenu.fireServiceSelected = function (that, serviceNameSelector, oauth2ClientIdSelector, evt, ui) {
        var serviceName = ui.item.find(serviceNameSelector).text();
        var oauth2ClientId = ui.item.find(oauth2ClientIdSelector).attr("value");
        that.events.serviceSelected.fire(serviceName, oauth2ClientId);
    };

})(jQuery, fluid);
