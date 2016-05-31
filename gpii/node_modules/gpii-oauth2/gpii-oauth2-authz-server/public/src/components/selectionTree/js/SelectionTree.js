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

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.oauth2.selectionTree");

    gpii.oauth2.selectionTree.preventDefault = function (e) {
        e.preventDefault();
    };

    fluid.defaults("gpii.oauth2.selectionTree", {
        gradeNames: ["fluid.viewComponent"],
        selectors: {
            tree: ".gpiic-oauth2-selectionTree-tree",
            leaf: ".gpiic-oauth2-selectionTree-leaf",
            branch: ".gpiic-oauth2-selectionTree-branch",
            branchToggle: ".gpiic-oauth2-selectionTree-branchToggle",
            prefereces: "label"
        },
        domMap: {}, // must supply a mapping with a key that is an ELPath and a value of the corresponding selector
        styles: {
            collapsed: "gpii-icon-plus-small",
            expanded: "gpii-icon-minus-small",
            select: "gpii-oauth2-focus"
        },
        model: {
            selections: {},
            hasSelection: false
        },
        modelRelay: {
            target: "{that}.model.hasSelection",
            singleTransform: {
                type: "fluid.transforms.free",
                args: {
                    rootSelectionsValue: "{that}.model.selections.value"
                },
                func: "gpii.oauth2.selectionTree.deriveHasSelection"
            }
        },
        availablePrefs: {},
        resources: {
            template: {
                href: "../html/SelectionTreeTemplate.html",
                forceCache: true
            }
        },
        invokers: {
            refresh: {
                funcName: "gpii.oauth2.selectionTree.refresh",
                args: ["{that}"]
            },
            toSelectionsModel: {
                funcName: "gpii.oauth2.selectionTree.toSelectionsModel",
                args: ["{arguments}.0", "{that}.options.availablePrefs"]
            },
            toServerModel: {
                funcName: "gpii.oauth2.selectionTree.toServerModel",
                args: ["{that}.model.selections"]
            },
            // TODO: Currently the Security UI's are a mixture of
            // payload (ajax) and markup-driven (via handlebars rendering).
            // In the future this will all be moved to payload driven, at
            // which point all of the serverModel logic should be moved out
            // of this implementation.
            updateSelectionsFromServer: {
                funcName: "gpii.oauth2.selectionTree.updateSelectionsFromServer",
                args: ["{that}", "{arguments}.0"]
            },
            updateSelectionsModel: {
                funcName: "gpii.oauth2.selectionTree.updateSelectionsModel",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            removeLeaf: {
                funcName: "gpii.oauth2.selectionTree.removeLeaf",
                args: ["{arguments}.0", "{that}.dom.leaf"]
            },
            initDOM: {
                funcName: "gpii.oauth2.selectionTree.DOMSetup",
                args: ["{that}"]
            },
            toggleBranch: {
                funcName: "gpii.oauth2.selectionTree.toggleBranch",
                args: ["{that}", "{arguments}.0.target"]
            },
            setBranches: {
                funcName: "gpii.oauth2.selectionTree.toggleBranches",
                args: ["{that}", "{that}.dom.branchToggle", "{arguments}.0"]
            },
            relayClick: {
                funcName: "gpii.oauth2.selectionTree.relayClick",
                args: ["{arguments}.0.target"]
            },
            select: {
                funcName: "gpii.oauth2.selectionTree.toggleClass",
                args: ["{arguments}.0", "{that}.options.styles.select", true]
            },
            unselect: {
                funcName: "gpii.oauth2.selectionTree.toggleClass",
                args: ["{arguments}.0", "{that}.options.styles.select", false]
            },
            updateDOMFromSelectionsModel: {
                funcName: "gpii.oauth2.selectionTree.updateDOMFromSelectionsModel",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            updateDOMState: {
                funcName: "" // must implement a method for setting the DOM state
            },
            bindDOMListener: {
                funcName: "" // must implement a method for listening to the DOM state changes
            }
        },
        events: {
            "afterTemplateLoaded": null
        },
        listeners: {
            "onCreate.fetchTemplate": {
                listener: "gpii.oauth2.selectionTree.fetchResources",
                args: ["{that}"]
            },
            "afterTemplateLoaded.initDOM": {
                listener: "{that}.initDOM",
                priority: "first"
            },
            "afterTemplateLoaded.addAria": {
                listener: "gpii.oauth2.selectionTree.addAria",
                args: ["{that}"]
            },
            "afterTemplateLoaded.bindToggles": {
                "this": "{that}.dom.branchToggle",
                "method": "click",
                "args": ["{that}.toggleBranch"]
            },
            "afterTemplateLoaded.preventDefault": {
                "this": "{that}.dom.branchToggle",
                "method": "click",
                "args": [gpii.oauth2.selectionTree.preventDefault]
            },
            "afterTemplateLoaded.collapseTree": {
                listener: "{that}.setBranches",
                args: [false]
            },
            "afterTemplateLoaded.setState": {
                listener: "{that}.updateDOMFromSelectionsModel",
                args: ["{that}.model.selections"]
            },
            // TODO: Modify keyboard a11y to use arrows instead of tabs.
            // http://oaa-accessibility.org/example/41/
            "afterTemplateLoaded.makeTabbable": {
                listener: "fluid.tabbable",
                args: ["{that}.dom.prefereces"]
            },
            "afterTemplateLoaded.addKeyboardActivation": {
                funcName: "fluid.activatable",
                args: ["{that}.dom.prefereces", "{that}.relayClick"]
            },
            // Clean up the tree view for the next rendering, as it isn't automatically
            // emptied at component destroy: https://issues.gpii.net/browse/GPII-1523
            "onDestroy.emptyContainer": {
                "this": "{that}.container",
                method: "empty"
            }
        }
    });

    fluid.defaults("gpii.oauth2.preferencesSelectionTree", {
        gradeNames: ["gpii.oauth2.selectionTree"],
        domMap: {
            "": ".gpiic-oauth2-selectionTree-all",
            "increase-size": ".gpiic-oauth2-prefSelection-increase-size",
            "increase-size.appearance": ".gpiic-oauth2-prefSelection-increase-size_appearance",
            "increase-size.appearance.text-size": ".gpiic-oauth2-prefSelection-increase-size_appearance_text-size",
            "increase-size.appearance.cursor-size": ".gpiic-oauth2-prefSelection-increase-size_appearance_cursor-size",
            "increase-size.appearance.inputs-larger": ".gpiic-oauth2-prefSelection-increase-size_appearance_inputs-larger",
            "increase-size.appearance.line-spacing": ".gpiic-oauth2-prefSelection-increase-size_appearance_line-spacing",
            "increase-size.magnifier": ".gpiic-oauth2-prefSelection-increase-size_magnifier",
            "increase-size.magnifier.magnification-level": ".gpiic-oauth2-prefSelection-increase-size_magnifier_magnification-level",
            "increase-size.magnifier.magnifier-position": ".gpiic-oauth2-prefSelection-increase-size_magnifier_magnifier-position",
            "increase-size.magnifier.follows": ".gpiic-oauth2-prefSelection-increase-size_magnifier_follows",
            "increase-size.magnifier.emphasize-location": ".gpiic-oauth2-prefSelection-increase-size_magnifier_emphasize-location",
            "simplify": ".gpiic-oauth2-prefSelection-simplify",
            "simplify.table-of-contents": ".gpiic-oauth2-prefSelection-simplify_table-of-contents",
            "universal-volume": ".gpiic-oauth2-prefSelection-universal-volume",
            "universal-language": ".gpiic-oauth2-prefSelection-universal-language",
            "visual-alternatives": ".gpiic-oauth2-prefSelection-visual-alternatives",
            "visual-alternatives.speak-text": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text",
            "visual-alternatives.speak-text.rate": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_rate",
            "visual-alternatives.speak-text.volume": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_volume",
            "visual-alternatives.speak-text.pitch": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_pitch",
            "visual-alternatives.speak-text.language": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_language",
            "visual-alternatives.speak-text.announce": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_announce",
            "visual-alternatives.speak-text.read-back": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_read-back",
            "visual-alternatives.speak-text.text-highlighting": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_text-highlighting",
            "visual-alternatives.speak-text.follows": ".gpiic-oauth2-prefSelection-visual-alternatives_speak-text_follows",
            "visual-alternatives.braille": ".gpiic-oauth2-prefSelection-visual-alternatives_braille",
            "visual-styling": ".gpiic-oauth2-prefSelection-visual-styling",
            "visual-styling.change-contrast": ".gpiic-oauth2-prefSelection-visual-styling_change-contrast",
            "visual-styling.emphasize-links": ".gpiic-oauth2-prefSelection-visual-styling_emphasize-links",
            "visual-styling.text-style": ".gpiic-oauth2-prefSelection-visual-styling_text-style"
        },
        invokers: {
            updateDOMState: {
                funcName: "gpii.oauth2.selectionTree.setCheckbox"
            },
            bindDOMListener: {
                funcName: "gpii.oauth2.selectionTree.bindDOMListener",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{that}.updateSelectionsModel"]
            }
        }
    });

    gpii.oauth2.selectionTree.fetchResources = function (that) {
        fluid.fetchResources(that.options.resources, function () {
            that.refresh();
        });
    };

    gpii.oauth2.selectionTree.refresh = function (that) {
        that.container.html(that.options.resources.template.resourceText);
        that.events.afterTemplateLoaded.fire(that);
    };

    gpii.oauth2.selectionTree.addAria = function (that) {
        that.locate("tree").attr("role", "tree");
        that.locate("leaf").attr("role", "treeitem");
        that.locate("branch").attr("role", "group");
        that.locate("branchToggle").attr("aria-expanded", false);
    };

    gpii.oauth2.selectionTree.toggleBranch = function (that, elm, state) {
        elm = $(elm);
        var collapseState;
        var expandState;

        if (state !== undefined) {
            collapseState = !state;
            expandState = state;
        } else {
            var wasExpanded = elm.attr("aria-expanded") === "true" ? true : false;
            collapseState = wasExpanded;
            expandState = !wasExpanded;
        }

        elm.toggleClass(that.options.styles.collapsed, collapseState);
        elm.toggleClass(that.options.styles.expanded, expandState);
        elm.attr("aria-expanded", expandState);

        elm.closest(that.locate("leaf")).children("ul").toggle(expandState);
    };

    gpii.oauth2.selectionTree.toggleBranches = function (that, elms, state) {
        fluid.each(elms, function (elm) {
            gpii.oauth2.selectionTree.toggleBranch(that, elm, state);
        });
    };

    gpii.oauth2.selectionTree.deriveHasSelection = function (args) {
        return args.rootSelectionsValue === "checked" || args.rootSelectionsValue === "indeterminate";
    };

    gpii.oauth2.selectionTree.updateSelectionsFromServer = function (that, serverModel) {
        var newSelections = that.toSelectionsModel(serverModel);
        that.applier.change("selections", newSelections);
    };

    gpii.oauth2.selectionTree.updateDOMFromSelectionsModel = function (that, newSelections, oldSelections) {
        var availablePrefs = [""].concat(fluid.keys(that.options.availablePrefs));
        fluid.each(availablePrefs, function (availablePref) {
            var segs = fluid.model.pathToSegments(availablePref);
            var newVal = gpii.oauth2.selectionTree.getSelectionNodeValue(newSelections, segs);
            var oldVal = gpii.oauth2.selectionTree.getSelectionNodeValue(oldSelections, segs);

            if (newVal !== oldVal) {
                var elm = that.container.find(that.options.domMap[availablePref]);
                that.updateDOMState(elm, newVal);
            }
        });
    };

    gpii.oauth2.selectionTree.DOMSetup = function (that) {
        fluid.each(that.options.domMap, function (selector, selectorName) {
            var elm = that.container.find(selector);
            if (that.options.availablePrefs[selectorName] || selectorName === "") {
                // bind change event to update model (checked/unchecked)
                that.bindDOMListener(elm, selectorName);
            } else {
                that.removeLeaf(elm);
            }
        });

        // bind modelListener to update dom (checked/indeterminate)
        that.applier.modelChanged.addListener("selections", that.updateDOMFromSelectionsModel);
    };

    gpii.oauth2.selectionTree.updateSelectionsModel = function (that, ELPath, state) {
        var newSelections = fluid.copy(that.model.selections);

        var segs = fluid.model.pathToSegments(ELPath);
        gpii.oauth2.selectionTree.setValueAndAllDescendants(gpii.oauth2.selectionTree.getSelectionNode(newSelections, segs), state);
        gpii.oauth2.selectionTree.updateAncestors(newSelections, segs);

        that.applier.change("selections", newSelections);
    };

    gpii.oauth2.selectionTree.bindDOMListener = function (that, elm, ELPath, updateModelFn) {
        elm.change(function (e) {
            var state = $(e.target).prop("checked") ? "checked" : "unchecked";
            updateModelFn(ELPath, state);
        });
    };

    gpii.oauth2.selectionTree.relayClick = function (elm) {
        $(elm).click();
    };

    gpii.oauth2.selectionTree.toggleClass = function (elm, classes, state) {
        $(elm).toggleClass(classes, state);
    };

    gpii.oauth2.selectionTree.removeLeaf = function (elm, leafSel) {
        elm.closest(leafSel).remove();
    };

    gpii.oauth2.selectionTree.setCheckbox = function (checkbox, state) {
        var checked = state === "checked";
        var indeterminate = state === "indeterminate";

        checkbox.prop({
            "indeterminate": indeterminate,
            "checked": checked
        });
    };

    gpii.oauth2.selectionTree.getSelectionNode = function (selections, segs) {
        var nodePath = [];
        fluid.each(segs, function (seg) {
            nodePath.push("children");
            nodePath.push(seg);
        });
        return fluid.get(selections, nodePath);
    };

    gpii.oauth2.selectionTree.getSelectionNodeValue = function (selections, segs) {
        var node = gpii.oauth2.selectionTree.getSelectionNode(selections, segs);
        return node ? node.value : undefined;
    };

    gpii.oauth2.selectionTree.setValueAndAllDescendants = function (newSelections, value) {
        newSelections.value = value;
        fluid.each(newSelections.children, function (child) {
            gpii.oauth2.selectionTree.setValueAndAllDescendants(child, value);
        });
    };

    gpii.oauth2.selectionTree.setValueAndAllAncestors = function (newSelections, segs, value) {
        newSelections.value = value;
        if (segs.length > 0) {
            // build out the structure if it doesn't exist yet
            if (!newSelections.children) {
                newSelections.children = {};
            }
            if (!newSelections.children[segs[0]]) {
                newSelections.children[segs[0]] = {};
            }
            // recurse down the segs
            gpii.oauth2.selectionTree.setValueAndAllAncestors(newSelections.children[segs[0]], segs.slice(1), value);
        }
    };

    /**
     * Sets the "value" property of each ancestor by traversing backwards through the path segments.
     * The state is calculated by determining the states of all the children.
     * checked (all children checked), unchecked (all children unchecked), indeterminate (mixture of checked, unchecked, and/or indeterminate)
     */
    gpii.oauth2.selectionTree.updateAncestors = function (newSelections, segs) {
        var parentSegs = fluid.copy(segs);
        while (parentSegs.length > 0) {
            parentSegs.pop();
            var parent = gpii.oauth2.selectionTree.getSelectionNode(newSelections, parentSegs);
            parent.value = gpii.oauth2.selectionTree.calculateValueFromChildren(parent);
        }
    };

    gpii.oauth2.selectionTree.calculateValueFromChildren = function (selection) {
        var calculatedValue;
        fluid.each(selection.children, function (child) {
            var childValue = child.value;
            if (!calculatedValue) {
                calculatedValue = childValue;
            }
            if (childValue === "indeterminate" || calculatedValue !== childValue) {
                calculatedValue = "indeterminate";
            }
        });
        return calculatedValue;
    };

    gpii.oauth2.selectionTree.gatherPaths = function (paths, prefix, selections) {
        var nodeValue = selections.value;
        if (nodeValue === "checked") {
            paths.push(prefix.join("."));
        } else if (nodeValue === "indeterminate") {
            fluid.each(selections.children, function (child, seg) {
                prefix.push(seg);
                gpii.oauth2.selectionTree.gatherPaths(paths, prefix, child);
                prefix.pop();
            });
        }
    };

    gpii.oauth2.selectionTree.toServerModel = function (selections) {
        var paths = [];
        gpii.oauth2.selectionTree.gatherPaths(paths, [], selections);
        return fluid.arrayToHash(paths);
    };

    gpii.oauth2.selectionTree.pathsToSegs = function (paths) {
        var pathsArray = fluid.keys(paths);
        return fluid.transform(pathsArray, function (elPath) {
            return fluid.model.pathToSegments(elPath);
        });
    };

    gpii.oauth2.selectionTree.toSelectionsModel = function (setPrefs, availablePrefs) {
        var newSelections = {};
        var clientAvailablePrefsSegs = gpii.oauth2.selectionTree.pathsToSegs(availablePrefs);
        var setPrefsSegs = gpii.oauth2.selectionTree.pathsToSegs(setPrefs);

        // build out the model, setting each client available pref to "unchecked"
        fluid.each(clientAvailablePrefsSegs, function (segs) {
            gpii.oauth2.selectionTree.setValueAndAllAncestors(newSelections, segs, "unchecked");
        });

        // set each user selected pref value to "checked"
        fluid.each(setPrefsSegs, function (segs) {
            gpii.oauth2.selectionTree.setValueAndAllDescendants(gpii.oauth2.selectionTree.getSelectionNode(newSelections, segs), "checked");
        });

        fluid.each(setPrefsSegs, function (segs) {
            // if there are no segs all are unchecked, if segs[0] === "" all are checked
            // otherwise, set each non-leaf node value to "indeterminate"
            if ((segs.length > 0) && (segs[0] !== "")) {
                segs.pop(); // remove last segment as it was checked
                gpii.oauth2.selectionTree.setValueAndAllAncestors(newSelections, segs, "indeterminate");
            }
        });

        return newSelections;
    };

})(jQuery);
