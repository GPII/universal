/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


// Declare dependencies
/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.oauth2.editPrivacySettingsDialog", {
        gradeNames: ["gpii.oauth2.privacySettingsDialog"],
        requestInfos: {
            fetchDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "get"
            },
            saveDecisionPrefs: {
                url: "/authorizations/%authDecisionId/preferences",
                type: "put"
            }
        },
        events: {
            onInitialSelectedPrefsFetched: null
        },
        listeners: {
            "onCreate.fetchDecisionPrefs": "{that}.fetchDecisionPrefs",
            "onInitialSelectedPrefsFetched.setInitialSelectedPrefs": "{that}.setInitialSelectedPrefs",
            "onDone.savePrefsAndExit": {
                listener: "{that}.savePrefsAndExit"
            }
        },
        invokers: {
            fetchDecisionPrefs: {
                funcName: "gpii.oauth2.ajax",
                args: ["{that}.options.requestInfos.fetchDecisionPrefs.url", {
                    authDecisionId: "{that}.model.clientData.authDecisionId"
                }, {
                    type: "{that}.options.requestInfos.fetchDecisionPrefs.type",
                    dataType: "json",
                    success: "{that}.events.onInitialSelectedPrefsFetched.fire"
                }]
            },
            savePrefsAndExit: {
                funcName: "gpii.oauth2.editPrivacySettingsDialog.savePrefsAndExit",
                args: ["{that}"]
            },
            saveDecisionPrefs: {
                funcName: "gpii.oauth2.editPrivacySettingsDialog.saveDecisionPrefs",
                args: ["{that}"]
            }
        }
    });

    gpii.oauth2.editPrivacySettingsDialog.saveDecisionPrefs = function (that) {
        var url = that.options.requestInfos.saveDecisionPrefs.url,
            selectionTree = that.selectionTree,
            selectedPreferences = selectionTree.toServerModel(selectionTree.model.selections),
            data = JSON.stringify(selectedPreferences);

        gpii.oauth2.ajax(url, {
            authDecisionId: that.model.clientData.authDecisionId
        }, {
            type: that.options.requestInfos.saveDecisionPrefs.type,
            contentType: "application/json",
            data: data
        });
    };

    gpii.oauth2.editPrivacySettingsDialog.savePrefsAndExit = function (that) {
        that.saveDecisionPrefs();
        that.closeDialog();
    };

})(jQuery, fluid);
