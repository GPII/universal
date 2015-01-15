/*!
GPII OAuth2 server

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests");

        fluid.defaults("gpii.tests.oauth2.authorization", {
            gradeNames: ["gpii.oauth2.authorization", "autoInit"],
            model: {
                user: "testUser",
                service: "testService",
                clientID: "com.bdigital.easit4all",
                transactionID: "testTransactionID"
            },
            availableAuthorizationsURL: "../../../../src/core/available-authorized-preferences/%clientID.json",
            selectionTreeTemplate: "../../../../src/components/selectionTree/html/SelectionTreeTemplate.html"
        });

        gpii.tests.oauth2.authorization.assertSelectedPreferences = function (that) {
            var serverModel = that.selectionTree.toServerModel();
            jqUnit.assertEquals("The selectedPreferences should be set", JSON.stringify(serverModel), that.locate("selectionValue").val());
        };

        gpii.tests.oauth2.authorization.assertAllowState = function (that) {
            var noSelections = that.selectionTree.model.value === "unchecked";
            var isDisabled = that.locate("allow").prop("disabled");

            if (noSelections) {
                jqUnit.assertTrue("The allow button should be disabled", isDisabled);
            } else {
                jqUnit.assertFalse("The allow button should be enabled", isDisabled);
            }
        };

        gpii.tests.oauth2.authorization.assertInit = function (that) {
            var str = that.options.strings;
            var expDesc = fluid.stringTemplate(str.description, {service: that.model.service});

            jqUnit.assertEquals("The 'description' string should have been rendered", expDesc, that.locate("description").html());
            jqUnit.assertEquals("The 'allow' string should have been rendered", str.allow, that.locate("allow").attr("value"));
            jqUnit.assertEquals("The 'cancel' string should have been rendered", str.cancel, that.locate("cancel").attr("value"));
            jqUnit.assertEquals("The 'directions' string should have been rendered", str.directions, that.locate("directions").text());
            jqUnit.assertEquals("The 'logout' string should have been rendered", str.logout, that.locate("logout").text());
            jqUnit.assertEquals("The username should have been rendered", that.model.user, that.locate("user").text());
            jqUnit.assertTrue("The selectionTree subcomponent should have been initialized", that.selectionTree);
            jqUnit.assertEquals("The transactionID should be set", that.model.transactionID, that.locate("transaction").val());

            gpii.tests.oauth2.authorization.assertSelectedPreferences(that);
            gpii.tests.oauth2.authorization.assertAllowState(that);
            jqUnit.start();
        };

        gpii.tests.oauth2.authorization.assertSelectionChange = function (that) {
            that.selectionTree.applier.change("value", "checked");
            gpii.tests.oauth2.authorization.assertSelectedPreferences(that);
            gpii.tests.oauth2.authorization.assertAllowState(that);

            that.selectionTree.applier.change("value", "unchecked");
            gpii.tests.oauth2.authorization.assertSelectedPreferences(that);
            gpii.tests.oauth2.authorization.assertAllowState(that);

            jqUnit.start();
        };

        jqUnit.asyncTest("Initialization", function () {
            gpii.tests.oauth2.authorization(".gpiic-oauth2-authorization", {
                listeners: {
                    "onCreateSelectionTree.test": {
                        listener: "gpii.tests.oauth2.authorization.assertInit",
                        priority: "last"
                    }
                }
            });
        });

        jqUnit.asyncTest("Selection Change", function () {
            gpii.tests.oauth2.authorization(".gpiic-oauth2-authorization", {
                listeners: {
                    "onCreateSelectionTree.test": {
                        listener: "gpii.tests.oauth2.authorization.assertSelectionChange",
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);
