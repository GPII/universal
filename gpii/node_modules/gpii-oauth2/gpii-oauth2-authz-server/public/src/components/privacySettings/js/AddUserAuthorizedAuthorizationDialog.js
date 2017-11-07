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

    fluid.defaults("gpii.oauth2.addUserAuthorizedAuthorizationDialog", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog"],
        requestInfos: {
            addUserAuthorizedAuthorization: {
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
            "onDone.sendAddUserAuthorizedAuthorization": {
                listener: "{that}.sendAddUserAuthorizedAuthorization"
            }
        },
        invokers: {
            sendAddUserAuthorizedAuthorization: {
                funcName: "gpii.oauth2.addUserAuthorizedAuthorizationDialog.sendAddUserAuthorizedAuthorization",
                args: ["{that}"]
            }
        }
    });

    // TODO: update to use the dataSource system once it is migrated out of Kettle up into Infusion
    gpii.oauth2.addUserAuthorizedAuthorizationDialog.sendAddUserAuthorizedAuthorization = function (that) {
        var url = that.options.requestInfos.addUserAuthorizedAuthorization.url,
            selectionTree = that.selectionTree,
            selectedPreferences, data;

        if (selectionTree) {
            selectedPreferences = selectionTree.toServerModel(selectionTree.model.selections);
        }

        data = JSON.stringify({
            clientId: that.model.clientData.clientId,
            selectedPreferences: selectedPreferences
        });

        gpii.oauth2.ajax(url, {}, {
            type: that.options.requestInfos.addUserAuthorizedAuthorization.type,
            contentType: "application/json",
            data: data,
            success: that.events.authorizationAdded.fire
        });
    };

})(jQuery, fluid);
