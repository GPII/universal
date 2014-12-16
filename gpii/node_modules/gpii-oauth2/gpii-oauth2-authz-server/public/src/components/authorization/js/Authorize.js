/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.authorization", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            user: ".gpiic-oauth2-authorization-user",
            logout: ".gpiic-oauth2-authorization-logout",
            transaction: ".gpiic-oauth2-authorization-transaction",
            description: ".gpiic-oauth2-authorization-description",
            allow: ".gpiic-oauth2-authorization-allow",
            cancel: ".gpiic-oauth2-authorization-cancel",
            directions: ".gpiic-oauth2-authorization-directions"
        },
        strings: {
            description: "In order to personalise your experience, <strong>%service</strong> would like to access some of your Cloud for All preferences.",
            allow: "allow",
            cancel: "do not allow",
            directions: "To edit your privacy settings at any time, go to your Account settings in the Preference Management Tool",
            logout: "Log Out"
        },
        model: {
            user: "",
            service: "",
            transactionID: ""
        },
        protoTree: {
            user: "${{that}.model.user}",
            logout: {messagekey: "logout"},
            transaction: "${{that}.model.transactionID}",
            description: {
                markup: {
                    messagekey: "description",
                    args: {service: "{that}.model.service"}
                }
            },
            allow: {messagekey: "allow"},
            cancel: {messagekey: "cancel"},
            directions: {messagekey: "directions"}
        },
        renderOnInit: true
    });
})(jQuery, fluid);
