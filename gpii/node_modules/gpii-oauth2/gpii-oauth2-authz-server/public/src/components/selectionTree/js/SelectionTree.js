/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid */

var gpii = gpii || {};

(function () {
    "use strict";

    fluid.defaults("gpii.oauth2.selectionTree", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            checkboxes: ":checkbox",
            allInput: ".gpiic-oauth2-selectionTree-all",
            allLabel: ".gpiic-oauth2-selectionTree-allLabel"
        },
        strings: {
            allLabel: "All"
        },
        protoTree: {
            allLabel: {messagekey: "allLabel"}
        }
    });

    gpii.oauth2.selectionTree.setCheckbox = function (checkbox, state) {
        var checked = state === "checked" ? true : false;
        var indeterminate = state === "indeterminate" ? true : false;

        checkbox.prop({
            "indeterminate": indeterminate,
            "checked": checked
        });
    };

    gpii.oauth2.selectionTree.setAncestors = function (checkbox, until) {
        var siblingsAndDescendants = checkbox.closest("li").siblings().andSelf().find(":checkbox");
        var ancestors = checkbox(until, ":checkbox");
        var state;

        fluid.each(siblingsAndDescendants, function (chk) {
            var currentState = chk.prop("checked") ? "checked" : chk.prop("indeterminate") ? "indeterminate" : "unchecked";

            if (!state) {
                state = currentState;
            }

            if (currentState === "indeterminate" || state !== currentState) {
                state = "indeterminate";
                return false;
            }
        });

        gpii.oauth2.selectionTree.setCheckbox(ancestors, state);
    };

    gpii.oauth2.selectionTree.setDescendants = function (checkbox) {
        var state = checkbox.prop("checked") ? "checked" : "unchecked";
        var descendants = checkbox.closest("li").find("ul :checkbox");

        gpii.oauth2.selectionTree.setCheckbox(descendants, state);
    };
})();
