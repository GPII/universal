/*!
Copyright 2015 OCAD University

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

    fluid.defaults("gpii.tests.OKCancelDialog", {
        gradeNames: ["gpii.OKCancelDialog"],
        model: {
            dialogContent: "Initial dialog content"
        }
    });

    fluid.defaults("gpii.tests.OKCancelDialogTestTree", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            dialog: {
                type: "gpii.tests.OKCancelDialog",
                container: ".gpiic-tests-OKCancelDialog"
            },
            dialogTester: {
                type: "gpii.tests.OKCancelDialogTester"
            }
        }
    });

    fluid.defaults("gpii.tests.OKCancelDialogTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        testOptions: {
            updatedContent: "Updated content"
        },
        modules: [ {
            name: "OKCancelDialog tests",
            tests: [
                {
                    name: "Initial dialog content",
                    expect: 1,
                    func: "gpii.tests.OKCancelDialog.verifyDialogContent",
                    args: ["Initial dialog content", "{dialog}.dom.dialogContent"]
                },
                {
                    name: "Widget is attached",
                    expect: 2,
                    func: "gpii.tests.OKCancelDialog.verifyWidgetIsAttached",
                    args: ["{dialog}"]
                },
                {
                    name: "Change dialog content",
                    expect: 1,
                    sequence: [
                        {
                            func: "{dialog}.applier.change",
                            args: ["dialogContent", "{that}.options.testOptions.updatedContent"]
                        }, {
                            spec: {path: "", priority: "last"},
                            changeEvent: "{dialog}.applier.modelChanged",
                            listener: "gpii.tests.OKCancelDialog.verifyDialogContent",
                            args: ["{that}.options.testOptions.updatedContent", "{dialog}.dom.dialogContent"]
                        }
                    ]
                },
                {
                    name: "Open, OK, Cancel",
                    expect: 3,
                    sequence: [
                        {
                            func: "{dialog}.open"
                        }, {
                            event: "{dialog}.events.open",
                            listener: "jqUnit.isVisible",
                            args: ["Dialog is open", "{dialog}.container"]
                        },
                        {
                            jQueryTrigger: "click",
                            element: "{dialog}.okButton"
                        }, {
                            event: "{dialog}.events.clickOK",
                            listener: "jqUnit.assert",
                            args: ["clickOK event fired"]
                        },
                        {
                            jQueryTrigger: "click",
                            element: "{dialog}.cancelButton"
                        }, {
                            event: "{dialog}.events.clickCancel",
                            listener: "jqUnit.assert",
                            args: ["clickCancel event fired"]
                        }
                    ]
                }
            ]
        } ]
    });

    gpii.tests.OKCancelDialog.verifyDialogContent = function (expected, elem) {
        jqUnit.assertEquals("Verify dialog content", expected, elem.html());
    };

    gpii.tests.OKCancelDialog.verifyWidgetIsAttached = function (dialog) {
        jqUnit.assertValue("dialog.widget is assigned", dialog.widget);
        jqUnit.assertTrue("dialog.widget has the dialogClass", dialog.widget.hasClass(dialog.options.styles.dialogClass));
    };

    gpii.tests.OKCancelDialog.runTests = function () {
        fluid.test.runTests([ "gpii.tests.OKCancelDialogTestTree" ]);
    };

})();
