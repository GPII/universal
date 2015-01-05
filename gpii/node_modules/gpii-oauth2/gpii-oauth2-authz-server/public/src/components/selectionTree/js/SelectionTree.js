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
            leaf: ".gpiic-oauth2-selectionTree-leaf",
            domMap: {} // must supply a mapping with a key that is an ELPath and a value of the corresponding selector
        },
        model: {},
        requestedPrefs: [],
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
            updateDOMState: {
                funcName: "" // must implement a method for setting the DOM state
            },
            bindDOMListener: {
                funcName: "" // must implement a method for listening to the DOM state changes
            }
        }
    });

    fluid.defaults("gpii.oauth2.preferencesSelectionTree", {
        gradeNames: ["gpii.oauth2.selectionTree", "autoInit"],
        selectors: {
            domMap: {
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
            }
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

    // gpii.oauth2.selectionTree.setCheckbox = function (checkbox, state) {
    //     var checked = state === "checked" ? true : false;
    //     var indeterminate = state === "indeterminate" ? true : false;
    //
    //     checkbox.prop({
    //         "indeterminate": indeterminate,
    //         "checked": checked
    //     });
    // };
    //
    // gpii.oauth2.selectionTree.setAncestors = function (checkbox, until) {
    //     var siblingsAndDescendants = checkbox.closest("li").siblings().andSelf().find(":checkbox");
    //     var ancestors = checkbox(until, ":checkbox");
    //     var state;
    //
    //     fluid.each(siblingsAndDescendants, function (chk) {
    //         var currentState = chk.prop("checked") ? "checked" : chk.prop("indeterminate") ? "indeterminate" : "unchecked";
    //
    //         if (!state) {
    //             state = currentState;
    //         }
    //
    //         if (currentState === "indeterminate" || state !== currentState) {
    //             state = "indeterminate";
    //             return false;
    //         }
    //     });
    //
    //     gpii.oauth2.selectionTree.setCheckbox(ancestors, state);
    // };
    //
    // gpii.oauth2.selectionTree.setDescendants = function (checkbox) {
    //     var state = checkbox.prop("checked") ? "checked" : "unchecked";
    //     var descendants = checkbox.closest("li").find("ul :checkbox");
    //
    //     gpii.oauth2.selectionTree.setCheckbox(descendants, state);
    // };

    // gpii.oauth2.selectionTree.toUIModel = function (persistedModel) {
    //     return fluid.transform(persistedModel, function () {
    //         if (fluid.isPlainObject(state)) {
    //
    //         }
    //
    //         return state ? "checked" : "unchecked";
    //     });
    // };
    //
    // // TODO: remove value fields
    // gpii.oauth2.selectionTree.toPersistedModel = function (UIModel) {
    //     return fluid.transform(UIModel, function (state) {
    //         if (fluid.isPlainObject(state)) {
    //             return gpii.oauth2.selectionTree.toPersistedModel(state);
    //         }
    //
    //         return state === "checked";
    //     });
    // };

    // gpii.oauth2.selectionTree.getBranchState = function (model) {
    //     var state;
    //     fluid.each(model, function (prefState) {
    //         var currentState;
    //
    //         if(fluid.isPlainObject(prefState)) {
    //             currentState = gpii.oauth2.selectionTree.getBranchState(prefState);
    //         } else {
    //             currentState = prefState;
    //         }
    //
    //         state = state || currentState;
    //
    //         if (currentState === "indeterminate" || state !== currentState) {
    //             state = "indeterminate";
    //             return false;
    //         }
    //     });
    //     return state;
    // };
    //
    // gpii.oauth2.selectionTree.setBranchState = function () {
    //
    // };

/*
    {
        value: "tri-state",
        changeContrast: {
            value: "tri-state"
        },
        increaseSize: {
            value: "tri-state",
            appearance: {
                value: "tri-state",
                textSize: {
                    value: "tri-state"
                },
                cursorSize: {
                    value: "tri-state"
                }
            },
            magnifier: {
                value: "tri-state",
                magnificationLevel: {
                    value: "tri-state"
                }
            }
        },
        universalVolume: {
            value: "tri-state"
        }
    }
*/

/*

    {
        "shortest EL path": true,
        "increase-size": true
    }

*/

    gpii.oauth2.selectionTree.updateModelFromServer = function (that, serverModel) {
        var newModel = that.toModel(serverModel);
        that.applier.change("", newModel);
    };

    gpii.oauth2.selectionTree.DOMSetup = function (that) {
        var requestedPrefs = fluid.arrayToHash(that.options.requestedPrefs);
        fluid.each(that.options.selectors.domMap, function (selector, selectorName) {
            var elm = that.locate(selectorName);
            if (requestedPrefs[selectorName]) {
                // bind change event to update model (checked/unchecked)
                that.bindDOMListener(elm, selectorName);

                // bind modelListener to update dom (checked/indeterminate)
                that.applier.modelChanged.addListener(selectorName, function (value) {
                    that.updateDOMState(elm, value.value);
                });

            } else {
                that.removeLeaf(elm);
            }
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

    gpii.oauth2.selectionTree.toServerModel = function (model) {
        var pathValue = model.value;
        var paths = [];

        if (pathValue === "checked") {
            paths.push("");
        } else if (pathValue === "indeterminate") {
            fluid.each(model, function (state, seg) {
                if (fluid.isPlainObject(state)) {
                    var subPaths = gpii.oauth2.selectionTree.toServerModel(state);
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

    gpii.oauth2.selectionTree.setAllDescendants = function (model, value) {
        fluid.each(model, function (state, prop) {
            if(fluid.isPlainObject(state)) {
                gpii.oauth2.selectionTree.setAllDescendants(state, value);
            } else {
                model[prop] = value;
            }
        });
    };

    /**
     * Sets the "value" property of each ancestor by traversing backwards through the path segments.
     * The state is calculated by determining the states of all the children.
     * checked (all children checked), unchecked (all children unchecked), indeterminate (mixture of checked, unchecked, and/or indeterminate)
     */
    gpii.oauth2.selectionTree.setAncestors = function (model, ELPath) {
        var segs = gpii.oauth2.selectionTree.pathsToSegs(fluid.makeArray(ELPath))[0]; // get back just the array of segments

        do {
            segs.pop(); // remove last segment since we want to work on the parent.
            var state;
            var subModel = fluid.get(model, segs);
            fluid.each(subModel, function (value, key) {
                if (fluid.isPlainObject(value)) {
                    var currentState = fluid.get(subModel, [key, "value"]);

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

            var segsToSet = segs.concat(["value"]);
            fluid.set(model, segsToSet, state || fluid.get(model, segsToSet));
        } while (segs.length);
    };

    gpii.oauth2.selectionTree.pathsToSegs = function (pathsArray) {
        return fluid.transform(pathsArray, function (elPath) {
            return elPath.split(".");
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

        fluid.each(setPrefs, function (path) {
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
