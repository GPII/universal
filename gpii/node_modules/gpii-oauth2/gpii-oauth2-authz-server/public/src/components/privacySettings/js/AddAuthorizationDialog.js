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

// Declare dependencies
/* global fluid, gpii, jQuery */

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.addAuthorizationDialog", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog"],
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
            "onDone.sendAddAuthorization": {
                listener: "{that}.sendAddAuthorization"
            }
        },
        invokers: {
            sendAddAuthorization: {
                funcName: "gpii.oauth2.addAuthorizationDialog.sendAddAuthorization",
                args: ["{that}"]
            }
        }
    });

    // TODO: update to use the dataSource system once it is migrated out of Kettle up into Infusion
    gpii.oauth2.addAuthorizationDialog.sendAddAuthorization = function (that) {
        var url = that.options.requestInfos.addAuthorization.url,
            selectionTree = that.selectionTree,
            selectedPreferences, data;

        if (selectionTree) {
            selectedPreferences = selectionTree.toServerModel(selectionTree.model.selections);
        }

        data = JSON.stringify({
            oauth2ClientId: that.model.clientData.oauth2ClientId,
            selectedPreferences: selectedPreferences
        });

        gpii.oauth2.ajax(url, {}, {
            type: that.options.requestInfos.addAuthorization.type,
            contentType: "application/json",
            data: data,
            success: that.events.authorizationAdded.fire
        });
    };

})(jQuery, fluid);
