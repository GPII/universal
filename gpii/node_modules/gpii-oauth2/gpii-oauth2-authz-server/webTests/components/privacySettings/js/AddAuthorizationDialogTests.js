/*!
GPII OAuth2 server

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.oauth2.addAuthorizationDialog");

    gpii.tests.additionalRequestInfos = {
        addAuthorization: {
            url: "/authorizations",
            type: "post",
            data: "{\"oauth2ClientId\":1,\"selectedPreferences\":{\"\":true}}",
            status: 200,
            responseText: {
                isError: false
            }
        }
    };

    gpii.tests.requestInfos = fluid.extend(true, {}, gpii.tests.oauth2.privacySettings.basicRequestInfos, gpii.tests.additionalRequestInfos);

    gpii.tests.oauth2.addAuthorizationDialog.registerMockjax = function () {
        fluid.each(gpii.tests.requestInfos, function (options) {
            $.mockjax(options);
        });
    };

    fluid.defaults("gpii.tests.oauth2.addAuthorizationDialog", {
        gradeNames: ["gpii.oauth2.addAuthorizationDialog", "gpii.tests.oauth2.privacySettingsConfig"],
        // Using "gpii.tests.oauth2.privacySettings.basicRequestInfos" without including
        // "gpii.tests.additionalRequestInfos" is because otherwise the component instantiation
        // would try to resolve "data" value defined for "addAuthorization" request as this value
        // has curly brackets "{...}" in it
        requestInfos: gpii.tests.oauth2.privacySettings.basicRequestInfos,
        model: {
            clientData: gpii.tests.oauth2.privacySettings.clientData
        },
        listeners: {
            "onCreate.registerMockjax": {
                listener: "gpii.tests.oauth2.addAuthorizationDialog.registerMockjax",
                priority: "first"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.addAuthorizationDialogTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            addAuthorizationDialog: {
                type: "gpii.tests.oauth2.addAuthorizationDialog",
                container: ".gpiic-oauth2-privacySettings-addAuthorizationDialog"
            },
            dialogTester: {
                type: "gpii.tests.oauth2.addAuthorizationDialogTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.addAuthorizationDialogTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [ {
            name: "Add authorizations dialog tests",
            tests: [
                {
                    name: "Initial dialog state",
                    expect: 3,
                    sequence: [{
                        listener: "gpii.tests.oauth2.addAuthorizationDialog.assertInit",
                        event: "{addAuthorizationDialog}.events.onCreateSelectionTree",
                        priority: "last"
                    }]
                },
                {
                    name: "Cancel button",
                    expect: 1,
                    sequence: [{
                        element: "{addAuthorizationDialog}.dom.cancel",
                        jQueryTrigger: "click"
                    }, {
                        func: "gpii.tests.oauth2.privacySettings.assertAjaxCalls",
                        args: [1]
                    }]
                },
                {
                    name: "Done button",
                    expect: 3,
                    sequence: [{
                        func: "{addAuthorizationDialog}.selectionTree.applier.change",
                        args: ["selections.value", "checked"]
                    }, {
                        func: "gpii.tests.oauth2.privacySettings.assertSelectedPreferences",
                        args: ["{addAuthorizationDialog}", {"": true}]
                    }, {
                        element: "{addAuthorizationDialog}.dom.done",
                        jQueryTrigger: "click"
                    }, {
                        func: "gpii.tests.oauth2.privacySettings.assertAjaxCalls",
                        args: [2]
                    }, {
                        listener: "jqUnit.assertTrue",
                        args: ["The event authorizationAdded is fired when the addAuthorization request is successful.", true],
                        event: "{addAuthorizationDialog}.events.authorizationAdded"
                    }]
                }
            ]
        }]
    });

    gpii.tests.oauth2.addAuthorizationDialog.assertInit = function (that) {
        gpii.tests.oauth2.privacySettings.assertSelectedPreferences(that, {});
        gpii.tests.oauth2.privacySettings.assertAjaxCalls(1);
        jqUnit.assertDeepEq("The model value for initialSelectedPrefs has been set to empty", {}, that.model.initialSelectedPrefs);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.addAuthorizationDialogTest"
        ]);
    });

})(jQuery);
