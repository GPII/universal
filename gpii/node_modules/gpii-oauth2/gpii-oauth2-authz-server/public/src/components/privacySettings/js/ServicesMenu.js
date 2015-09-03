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
/* global alert, fluid, gpii, jQuery */

(function ($, fluid) {

    "use strict";

    fluid.defaults("gpii.oauth2.servicesMenu", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        widgetOptions: {
            select: "{that}.selectMenuItem"
        },
        invokers: {
            /*
            open: {
                funcName: "gpii.oauth2.servicesMenu.openMenu",
                args: ["{that}"],
                dynamic: true
            },
             */
            open: {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["gpii-oauth2-privacySettings-servicesMenu"]
            },
            selectMenuItem: {
                funcName: "gpii.oauth2.servicesMenu.selectMenuItem",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            }
        },
        listeners: {
            "onCreate.setup": "gpii.oauth2.servicesMenu.setup"
        },
        styles: {
            menuOpen: "gpii-oauth2-privacySettings-servicesMenuOpen"
        }
    });

    gpii.oauth2.servicesMenu.openMenu = function (that) {
        // that.container.toggleClass(that.options.styles.menuOpen, true);
        // that.container.menu("widget").toggleClass("gpii-oauth2-privacySettings-servicesMenu");
        that.container.toggleClass("gpii-oauth2-privacySettings-servicesMenu");
        // that.container.show();
    };

    gpii.oauth2.servicesMenu.setup = function (that) {
        that.container.menu(that.options.widgetOptions);
        $("#toggleMenu").click(that.open);
    };

    gpii.oauth2.servicesMenu.selectMenuItem = function (that, event, ui) {
        alert("SELECT MENU ITEM: " + ui.item.text());
    };

})(jQuery, fluid);
