/*!
GPII OAuth2 server

Copyright 2014 OCAD University

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
                transactionID: "testTransactionID"
            }
        });

        var assertStrings = function (that) {
            var str = that.options.strings;
            var expDesc = fluid.stringTemplate(str.description, {service: that.model.service});

            jqUnit.assertEquals("The 'description' string should have been rendered", expDesc, that.locate("description").html());
            jqUnit.assertEquals("The 'allow' string should have been rendered", str.allow, that.locate("allow").attr("value"));
            jqUnit.assertEquals("The 'cancel' string should have been rendered", str.cancel, that.locate("cancel").attr("value"));
            jqUnit.assertEquals("The 'directions' string should have been rendered", str.directions, that.locate("directions").text());
            jqUnit.assertEquals("The 'logout' string should have been rendered", str.logout, that.locate("logout").text());
        };

        var assertUsername = function (that) {
            jqUnit.assertEquals("The username should have been rendered", that.model.user, that.locate("user").text());
        };

        var assertForm = function (that) {
            jqUnit.assertEquals("The transactionID should be set", that.model.transactionID, that.locate("transaction").attr("value"));
        };

        jqUnit.test("Initialization", function () {
            gpii.tests.oauth2.authorization(".gpiic-oauth2-authorization", {
                listeners: {
                    afterRender: [assertStrings, assertUsername, assertForm]
                }
            });
        });
    });
})(jQuery);
