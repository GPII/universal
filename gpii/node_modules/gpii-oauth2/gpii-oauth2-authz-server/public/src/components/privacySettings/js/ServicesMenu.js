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
        listeners: {
            "onCreate.setup": "gpii.oauth2.servicesMenu.setup"
        },
        invokers: {
            open: {
                "this": "{that}.container",
                method: "toggleClass",
                args: ["{that}.options.styles.menuOpen", true]
            },
            fireServiceSelected: {
                funcName: "gpii.oauth2.servicesMenu.fireServiceSelected",
                args: ["{that}", "{that}.options.selectors.oauth2ClientId", "{arguments}.0", "{arguments}.1"]
            }
        },
        selectors: {
            oauth2ClientId: "[name=oauth2ClientId]"
        },
        styles: {
            menuOpen: "gpii-oauth2-servicesMenuOpen"
        }
    });

    gpii.oauth2.servicesMenu.setup = function (that) {
        that.container.menu(that.options.widgetOptions);
    };

    gpii.oauth2.servicesMenu.fireServiceSelected = function (that, oauth2ClientIdSelector, evt, ui) {
        var oauth2ClientId = ui.item.find(oauth2ClientIdSelector).attr("value");
        that.events.serviceSelected.fire(oauth2ClientId);
    };

})(jQuery, fluid);
