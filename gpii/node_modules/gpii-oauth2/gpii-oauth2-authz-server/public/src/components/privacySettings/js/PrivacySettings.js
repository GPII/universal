/*!
GPII OAuth2 server

Copyright 2014 OCAD University

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

    fluid.defaults("gpii.oauth2.privacySettings", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            user: ".gpiic-oauth2-privacySettings-user",
            logout: ".gpiic-oauth2-privacySettings-logout",
            header: ".gpiic-oauth2-privacySettings-header",
            description: ".gpiic-oauth2-privacySettings-description",
            directions: ".gpiic-oauth2-privacySettings-directions",
            removeServiceLabel: ".gpiic-oauth2-privacySettings-removeServiceLabel"
        },
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
            removeServiceLabel: "remove"
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
            removeServiceLabel: {messagekey: "removeServiceLabel"}
        }
    });

})();
