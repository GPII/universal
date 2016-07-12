/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid, gpii, jqUnit */

(function () {
    "use strict";

    fluid.registerNamespace("gpii.tests.oauth");

    fluid.defaults("gpii.tests.oauth2.login", {
        gradeNames: ["gpii.oauth2.login"],
        model: {
            loginFailure: false
        },
        renderOnInit: false
    });

    gpii.tests.oauth2.login.assertRendering = function (that) {
        var keys = ["header", "instructions", "usernameLabel", "passwordLabel"];

        fluid.each(keys, function (key) {
            var str = that.options.strings[key];
            jqUnit.assertEquals("The '" + key + "' string should have been rendered", str, that.locate(key).text());
        });

        jqUnit.assertEquals("The 'submit' string should have been rendered", that.options.strings.submit, that.locate("submit").val());

        jqUnit.assertEquals("The username should be empty", "", that.locate("usernameInput").val());
        jqUnit.assertEquals("The password should be empty", "", that.locate("passwordInput").val());
    };

    gpii.tests.oauth2.login.assertNoErrorMsg = function (that) {
        jqUnit.assertNodeNotExists("The error message should not be rendered", that.locate("error"));
        jqUnit.assertNodeNotExists("The error message icon should not be rendered", that.locate("errorIcon"));
    };

    gpii.tests.oauth2.login.assertErrorMsg = function (that) {
        jqUnit.assertNodeExists("The error message should be rendered", that.locate("error"));
        jqUnit.assertNodeExists("The error message icon should be rendered", that.locate("errorIcon"));
    };

    gpii.tests.oauth2.login.testLogin = function (that) {
        gpii.tests.oauth2.login.assertRendering(that);

        if (that.model.loginFailure) {
            gpii.tests.oauth2.login.assertErrorMsg(that);
        } else {
            gpii.tests.oauth2.login.assertNoErrorMsg(that);
        }
    };

    fluid.defaults("gpii.tests.oauth2.loginTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            login: {
                type: "gpii.tests.oauth2.login",
                container: ".gpiic-oauth2-login"
            },
            catTester: {
                type: "gpii.tests.oauth2.loginTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.loginTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [ {
            name: "Login tests",
            tests: [{
                name: "Rendering",
                expect: 18,
                sequence: [{
                    func: "{login}.refreshView"
                }, {
                    listener: "gpii.tests.oauth2.login.testLogin",
                    event: "{login}.events.afterRender"
                }, {
                    func: "{login}.applier.change",
                    args: ["loginFailure", true]
                }, {
                    listener: "gpii.tests.oauth2.login.testLogin",
                    event: "{login}.events.afterRender"
                }]
            }]
        }]
    });

    gpii.tests.oauth2.login.runTests = function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.loginTestTree"
        ]);
    };
})();
