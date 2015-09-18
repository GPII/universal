/*!
GPII OAuth2 Add authorization dialog

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid, jQuery */

(function ($, fluid) {
    "use strict";

    // TODO: Factoring of gpii.oauth2.editPrivacySettings
    // Options:
    // 1. One grade that can be used for both editing and adding
    // 2. Three grades: a common base plus one for editing and one for adding

    fluid.defaults("gpii.oauth2.addAuthorizationDialog", {
        gradeNames: ["gpii.oauth2.editPrivacySettings", "autoInit"],
        requestInfos: {
            addAuthorization: {
                url: "/authorizations",
                type: "post"
            }
        },
        listeners: {
            "onCreate.fetchDecisionPrefs": {
                listener: "{that}.setDecisionPrefs",
                args: [ {} ]
            }
        },
        invokers: {
            selectionsAsServerModel: {
                func: "{selectionTree}.toServerModel",
                args: ["{selectionTree}.model.selections"]
            },
            saveDecisionPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: [
                    "{that}.options.requestInfos.addAuthorization.url",
                    {},
                    {
                        type: "{that}.options.requestInfos.addAuthorization.type",
                        contentType: "application/json",
                        data: {
                            expander: {
                                funcName: "JSON.stringify",
                                args: [{
                                    // TODO: Remove expander below after refactor grades
                                    expander: null, // Override the expander in gpii.oauth2.editPrivacySettings
                                    oauth2ClientId: "{that}.model.clientData.oauth2ClientId",
                                    selectedPreferences: "@expand:{that}.selectionsAsServerModel()"
                                }]
                            }
                        }
                    }
                ]
            }
        }
    });

})(jQuery, fluid);
