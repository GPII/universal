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

    fluid.defaults("gpii.oauth2.addAuthorizationDialog", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog", "autoInit"],
        requestInfos: {
            addAuthorization: {
                url: "/authorizations",
                type: "post"
            }
        },
        events: {
            authorizationAdded: null
        },
        listeners: {
            "onCreate.setInitialSelectedPrefs": {
                listener: "{that}.setInitialSelectedPrefs",
                args: [ {} ]
            },
            onDone: {
                listener: "{that}.sendAddAuthorization"
            }
        },
        invokers: {
            selectionsAsServerModel: {
                func: "{selectionTree}.toServerModel",
                args: ["{selectionTree}.model.selections"]
            },
            fireAuthorizationAdded: {
                "this": "{that}.events.authorizationAdded",
                method: "fire"
            },
            sendAddAuthorization: {
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
                                    oauth2ClientId: "{that}.model.clientData.oauth2ClientId",
                                    selectedPreferences: "@expand:{that}.selectionsAsServerModel()"
                                }]
                            }
                        },
                        success: "{that}.fireAuthorizationAdded"
                    }
                ]
            }
        }
    });

})(jQuery, fluid);
