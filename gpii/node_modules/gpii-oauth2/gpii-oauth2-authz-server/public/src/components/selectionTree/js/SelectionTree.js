/*!
GPII OAuth2 server

Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/* global fluid, jQuery */

var gpii = gpii || {};

(function ($) {
    "use strict";

    fluid.defaults("gpii.oauth2.selectionTree", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
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
        model: {},
        requestedPrefs: {},
        invokers: {
            toModel: {
                funcName: "gpii.oauth2.selectionTree.toModel",
                args: ["{arguments}.0", "{that}.options.requestedPrefs"]
            },
            toServerModel: {
                funcName:"gpii.oauth2.selectionTree.toServerModel",
                args: ["{that}.model"]
            },
            updateModelFromServer: {
                funcName: "gpii.oauth2.selectionTree.updateModelFromServer",
                args: ["{that}", "{arguments}.0"]
            },
            updateModel: {
                funcName: "gpii.oauth2.selectionTree.updateModel",
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
            updateDOMState: {
                funcName: "" // must implement a method for setting the DOM state
            },
            bindDOMListener: {
                funcName: "" // must implement a method for listening to the DOM state changes
            }
        },
        listeners: {
            "onCreate.initDOM": {
                listener: "{that}.initDOM",
                priority: "first"
            },
            "onCreate.addAria": {
                listener: "gpii.oauth2.selectionTree.addAria",
                args: ["{that}"]
            },
            "onCreate.bindToggles": {
                "this": "{that}.dom.branchToggle",
                "method": "click",
                "args": ["{that}.toggleBranch"]
            },
            "onCreate.collapseTree": {
                listener: "{that}.setBranches",
                args: [false]
            },
            //TODO: Modify keyboard a11y to use arrows instead of tabs.
            // http://oaa-accessibility.org/example/41/
            "onCreate.makeTabbable": {
                listener: "fluid.tabbable",
                args: ["{that}.dom.prefereces"]
            },
            "onCreate.addKeyboardActivation": {
                funcName: "fluid.activatable",
                args: ["{that}.dom.prefereces", "{that}.relayClick"]
            }
        }
    });

    fluid.defaults("gpii.oauth2.preferencesSelectionTree", {
        gradeNames: ["gpii.oauth2.selectionTree", "autoInit"],
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
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{that}.updateModel"]
            }
        }
    });

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

        if (arguments.length === 3) {
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

    gpii.oauth2.selectionTree.updateModelFromServer = function (that, serverModel) {
        var newModel = that.toModel(serverModel);
        that.applier.change("", newModel);
    };

    gpii.oauth2.selectionTree.DOMSetup = function (that) {
        fluid.each(that.options.domMap, function (selector, selectorName) {
            var elm = that.container.find(selector);
            if (that.options.requestedPrefs[selectorName] || selectorName === "") {
                // bind change event to update model (checked/unchecked)
                that.bindDOMListener(elm, selectorName);
            } else {
                that.removeLeaf(elm);
            }
        });

        // bind modelListener to update dom (checked/indeterminate)
        that.applier.modelChanged.addListener("", function (newModel, oldModel) {
            var requestedPrefs = [""].concat(fluid.keys(that.options.requestedPrefs));
            fluid.each(requestedPrefs, function (requestedPref) {
                var segs = gpii.oauth2.selectionTree.expandSegs(requestedPref);
                var newVal = fluid.get(newModel, segs);
                var oldVal = fluid.get(oldModel, segs);

                if (newVal !== oldVal) {
                    var elm = that.container.find(that.options.domMap[requestedPref]);
                    that.updateDOMState(elm, newVal);
                }
            });
        });
    };

    gpii.oauth2.selectionTree.updateModel = function (that, ELPath, state) {
        var model = fluid.copy(that.model);

        gpii.oauth2.selectionTree.setAllDescendants(fluid.get(model, ELPath), state);
        gpii.oauth2.selectionTree.setAncestors(model, ELPath);

        that.applier.change("", model);
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

    gpii.oauth2.selectionTree.gatherPaths = function (model) {
        var pathValue = model.value;
        var paths = [];

        if (pathValue === "checked") {
            paths.push("");
        } else if (pathValue === "indeterminate") {
            fluid.each(model, function (subModel, seg) {
                if (fluid.isPlainObject(subModel)) {
                    var subPaths = gpii.oauth2.selectionTree.gatherPaths(subModel);
                    fluid.each(subPaths, function (path) {
                        if (path) {
                            paths.push(seg + "." + path);
                        } else {
                            paths.push(seg);
                            return false;
                        }
                    });
                }
            });
        }

        return paths;
    };

    gpii.oauth2.selectionTree.toServerModel = function (model) {
        var paths = gpii.oauth2.selectionTree.gatherPaths(model);

        return fluid.arrayToHash(paths);
    };

    gpii.oauth2.selectionTree.setAllDescendants = function (model, value) {
        fluid.each(model, function (state, key) {
            if(fluid.isPlainObject(state)) {
                gpii.oauth2.selectionTree.setAllDescendants(state, value);
            } else {
                model[key] = value;
            }
        });
    };

    gpii.oauth2.selectionTree.expandSegs = function (ELPath) {
        var segs = fluid.model.pathToSegments(ELPath);
        return segs.concat(["value"]);
    };

    /**
     * Sets the "value" property of each ancestor by traversing backwards through the path segments.
     * The state is calculated by determining the states of all the children.
     * checked (all children checked), unchecked (all children unchecked), indeterminate (mixture of checked, unchecked, and/or indeterminate)
     */
    gpii.oauth2.selectionTree.setAncestors = function (model, ELPath) {
        var segs = fluid.model.pathToSegments(ELPath);

        do {
            segs.pop(); // remove last segment since we want to work on the parent.
            var state;
            var subModel = fluid.get(model, segs);
            fluid.each(subModel, function (value, key) {
                if (fluid.isPlainObject(value)) {
                    var currentState = fluid.get(subModel, gpii.oauth2.selectionTree.expandSegs(key));

                    if (!state) {
                        state = currentState;
                    }

                    if (currentState === "indeterminate" || state !== currentState) {
                        state = "indeterminate";
                        return false;
                    }
                }
            // The function needs to be supplied to fluid.each and requires access
            // to the state variable.
            }); // jshint ignore:line

            var segsToSet = gpii.oauth2.selectionTree.expandSegs(segs);
            fluid.set(model, segsToSet, state || fluid.get(model, segsToSet));
        } while (segs.length);
    };

    gpii.oauth2.selectionTree.pathsToSegs = function (paths) {
        var pathsArray = fluid.keys(paths);
        return fluid.transform(pathsArray, function (elPath) {
            return fluid.model.pathToSegments(elPath);
        });
    };

    gpii.oauth2.selectionTree.setEachSeg = function (model, segs, value, prop) {
        var propSeg = [prop || "value"];
        while (segs.length) {
            var modelPath = segs.concat(propSeg);
            fluid.set(model, modelPath, value);
            segs.pop();
        }
        fluid.set(model, propSeg, value);
    };

    gpii.oauth2.selectionTree.toModel = function (setPrefs, reqPrefs) {
        var model = {};
        var reqPrefsSegs = gpii.oauth2.selectionTree.pathsToSegs(reqPrefs);
        var setPrefsSegs = gpii.oauth2.selectionTree.pathsToSegs(setPrefs);


        fluid.each(reqPrefsSegs, function (segs) {
            gpii.oauth2.selectionTree.setEachSeg(model, segs, "unchecked");
        });

        fluid.each(setPrefsSegs, function (path) {
            gpii.oauth2.selectionTree.setAllDescendants(fluid.get(model, path), "checked");
        });

        fluid.each(setPrefsSegs, function (segs) {
            // if there are no segs all are unchecked, if segs[0] === "" all are checked
            if (segs.length && segs[0]) {
                segs.pop(); // remove last segment as it was checked
                gpii.oauth2.selectionTree.setEachSeg(model, segs, "indeterminate");
            }
        });

        return model;
    };

})(jQuery);
