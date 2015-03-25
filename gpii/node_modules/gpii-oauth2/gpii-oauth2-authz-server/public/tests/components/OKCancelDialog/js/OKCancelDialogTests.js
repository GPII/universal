/*!
Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid, gpii, jqUnit */

"use strict";

fluid.defaults("gpii.tests.OKCancelDialog", {
    gradeNames: ["gpii.OKCancelDialog", "autoInit"],
    dialogOptions: {
        create: "{that}.fireCreateDialogWidget"
    },
    model: {
        dialogContent: "Initial dialog content"
    },
    events: {
        createDialogWidget: null
    },
    listeners: {
        "createDialogWidget.registerButtonElements": {
            funcName: "gpii.tests.OKCancelDialog.registerButtonElements",
            args: ["{that}", "{arguments}.0"]
        }
    },
    invokers: {
        "fireCreateDialogWidget": {
            funcName: "gpii.tests.OKCancelDialog.fireCreateDialogWidget",
            args: ["{that}"]
        }
    }
});

fluid.defaults("gpii.tests.OKCancelDialogTestTree", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
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
    gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
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

gpii.tests.OKCancelDialog.fireCreateDialogWidget = function (that) {
    that.events.createDialogWidget.fire(that.container.dialog("widget"));
};

gpii.tests.OKCancelDialog.registerButtonElements = function (that, widget) {
    that.okButton = widget.find("." + that.options.styles.okButtonClass);
    that.cancelButton = widget.find("." + that.options.styles.cancelButtonClass);
};

gpii.tests.OKCancelDialog.verifyDialogContent = function (expected, elem) {
    jqUnit.assertEquals("Verify dialog content", expected, elem.html());
};

gpii.tests.OKCancelDialog.runTests = function () {
    fluid.test.runTests([ "gpii.tests.OKCancelDialogTestTree" ]);
};
