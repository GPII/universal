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
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        selectors: {
            user: ".gpiic-oauth2-authorization-user",
            logout: ".gpiic-oauth2-authorization-logout",
            transaction: ".gpiic-oauth2-authorization-transaction",
            description: ".gpiic-oauth2-authorization-description",
            allow: ".gpiic-oauth2-authorization-allow",
            cancel: ".gpiic-oauth2-authorization-cancel",
            directions: ".gpiic-oauth2-authorization-directions",
            selection: ".gpiic-oauth2-authorization-selection",
            selectionLabel: ".gpiic-oauth2-authorization-selectionLabel",
            selectionValue: ".gpiic-oauth2-authorization-selectionValue"
        },
        selectorsToIgnore: ["selection", "selectionValue"],
        strings: {
            description: "In order to personalise your experience, <strong>%service</strong> would like to access some of your Cloud for All preferences.",
            allow: "allow",
            cancel: "do not allow",
            directions: "To edit your privacy settings at any time, go to your Account settings in the Preference Management Tool",
            logout: "Log Out",
            selectionLabel: "Select the preferences you wish to share:"
        },
        model: {
            user: "",
            service: "",
            transactionID: "",
            availableAuthorizedPrefs: {}
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
            directions: {messagekey: "directions"},
            selectionLabel: {messagekey: "selectionLabel"}
        },
        renderOnInit: true,
        events: {
            afterAuthorizedPrefsSet: null,
            onCreateSelectionTree: {
                events: {
                    afterRender: "afterRender",
                    afterAuthorizedPrefsSet: "afterAuthorizedPrefsSet"
                },
                args: ["{that}"]
            }
        },
        availableAuthorizationsURL: "src/shared/data/available-authorized-preferences.json",
        selectionTreeTemplate: "src/components/selectionTree/html/selectionTreeTemplate.html",
        modelListeners: {
            "availableAuthorizedPrefs": {
                listener: "{that}.events.afterAuthorizedPrefsSet",
                excludeSource: "init"
            }
        },
        listeners: {
            "onCreate.fetchAuthPrefs": "{that}.fetchAvailableAuthorizedPrefs"
        },
        invokers: {
            fetchAvailableAuthorizedPrefs: {
                "this": "$",
                "method": "ajax",
                args: ["{that}.options.availableAuthorizationsURL", {
                    //TODO: Handle errors
                    dataType: "json",
                    success: "{that}.setAvailableAuthorizedPrefs"
                }]
            },
            setAvailableAuthorizedPrefs: {
                changePath: "availableAuthorizedPrefs",
                value: "{arguments}.0"
            }
        },
        distributeOptions: {
            source: "{that}.options.selectionTreeTemplate",
            target: "{that > selectionTree}.options.resources.template.href"
        },
        components: {
            selectionTree: {
                type: "gpii.oauth2.preferencesSelectionTree",
                container: "{that}.dom.selection",
                createOnEvent: "onCreateSelectionTree",
                options: {
                    requestedPrefs: "{authorization}.model.availableAuthorizedPrefs",
                    model: {
                        expander: {
                            funcName: "gpii.oauth2.selectionTree.toModel",
                            // The original model is expected to have nothing selected as no previous decisions have been made
                            args: [{}, "{that}.options.requestedPrefs"]
                        }
                    },
                    modelListeners: {
                        "": {
                            listener: "gpii.oauth2.authorization.setSelection",
                            args: ["{authorization}.dom.selectionValue", {
                                expander: {
                                    func: "{that}.toServerModel"
                                }
                            }]
                        }
                    }
                }
            }
        }
    });

    gpii.oauth2.authorization.setSelection = function (input, selectionModel) {
        input.val(JSON.stringify(selectionModel));
    };

})(jQuery, fluid);
