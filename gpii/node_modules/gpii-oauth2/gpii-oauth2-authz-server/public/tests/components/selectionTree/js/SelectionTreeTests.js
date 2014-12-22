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

        fluid.registerNamespace("gpii.tests.oauth2.selectionTree");

        jqUnit.test("gpii.oauth2.selectionTree.setCheckbox", function () {
            var checkbox = $(".gpiic-ouath2-selectionTree-testCheckbox");

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "checked");
            jqUnit.assertTrue("The checkbox should be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "indeterminate");
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertTrue("The checkbox should be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox, "unchecked");
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));

            gpii.oauth2.selectionTree.setCheckbox(checkbox);
            jqUnit.assertFalse("The checkbox should not be checked", checkbox.prop("checked"));
            jqUnit.assertFalse("The checkbox should not be indeterminate", checkbox.prop("indeterminate"));
        });

        gpii.tests.oauth2.selectionTree.testSetDescendants = function (container, parentIsChecked) {
            var parent = $(container).find(".gpiic-ouath2-selectionTree-testDescendants-parent");
            var siblings = $(container).find(".gpiic-ouath2-selectionTree-testDescendants-sibling");
            var descendants = $(container).find(".gpiic-ouath2-selectionTree-testDescendants-descendant");
            var assertSiblings;
            var assertDescendants;

            if (parentIsChecked) {
                assertSiblings = function (state) {
                    jqUnit.assertFalse("The sibling checkbox should be unchecked", state);
                };
                assertDescendants = function (state) {
                    jqUnit.assertTrue("The descendant checkbox should be checked", state);
                };
            } else {
                assertSiblings = function (state) {
                    jqUnit.assertTrue("The sibling checkbox should be checked", state);
                };
                assertDescendants = function (state) {
                    jqUnit.assertFalse("The descendant checkbox should be unchecked", state);
                };
            }

            parent.prop("checked", parentIsChecked);
            descendants.prop("checked", !parentIsChecked);
            siblings.prop("checked", !parentIsChecked);

            gpii.oauth2.selectionTree.setDescendants(parent);

            siblings.each(function (idx, elm) {
                var state = $(elm).prop("checked");
                assertSiblings(state);
            });

            descendants.each(function (idx, elm) {
                var state = $(elm).prop("checked");
                assertDescendants(state);
            });
        };

        jqUnit.test("gpii.oauth2.selectionTree.setDescendants - checked", function () {
            gpii.tests.oauth2.selectionTree.testSetDescendants(".gpiic-ouath2-selectionTree-testDescendants-checked", true);
        });

        jqUnit.test("gpii.oauth2.selectionTree.setDescendants - unchecked", function () {
            gpii.tests.oauth2.selectionTree.testSetDescendants(".gpiic-ouath2-selectionTree-testDescendants-checked", false);
        });

        //
        // fluid.defaults("gpii.tests.oauth2.privacySettings", {
        //     gradeNames: ["gpii.oauth2.privacySettings", "autoInit"],
        //     model: {
        //         user: "testUser"
        //     }
        // });
        //
        // var assertRenderedText = function (that, root, paths, method) {
        //     fluid.each(paths, function (path) {
        //         var expected = fluid.get(root, path);
        //         jqUnit.assertEquals("The '" + path + "' string should have been rendered", expected, that.locate(path)[method]());
        //     });
        // };
        //
        // var assertRendering = function (that) {
        //     assertRenderedText(that, that.options.strings, ["logout", "header", "directions", "removeServiceLabel"], "text");
        //     assertRenderedText(that, that.model, ["user"], "text");
        //     assertRenderedText(that, that.options.strings, ["description"], "html");
        // };
        //
        // jqUnit.test("Initialization", function () {
        //     gpii.tests.oauth2.privacySettings(".gpiic-oauth2-privacySettings", {
        //         listeners: {
        //             afterRender: assertRendering
        //         }
        //     });
        // });
    });
})(jQuery);
