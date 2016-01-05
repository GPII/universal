/*!
GPII OAuth2 server Tests

Copyright 2014-2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


// Declare dependencies
/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gpii.tests.oauth2.selectionTree");

        gpii.tests.oauth2.selectionTree.sampleClientAvailablePrefs = {
            "a.d": true,
            "b.e": true,
            "b.f.g": true,
            "c.h": true,
            "c.i.j": true,
            "c.k.l": true,
            "c.k.m": true
        };

        gpii.tests.oauth2.selectionTree.sampleComponentSelections = {
            value: "indeterminate",
            children: {
                a: {
                    value: "unchecked",
                    children: {
                        d: {
                            value: "unchecked"
                        }
                    }
                },
                b: {
                    value: "checked",
                    children: {
                        e: {
                            value: "checked"
                        },
                        f: {
                            value: "checked",
                            children: {
                                g: {
                                    value: "checked"
                                }
                            }
                        }
                    }
                },
                c: {
                    value: "indeterminate",
                    children: {
                        h: {
                            value: "unchecked"
                        },
                        i: {
                            value: "checked",
                            children: {
                                j: {
                                    value: "checked"
                                }
                            }
                        },
                        k: {
                            value: "indeterminate",
                            children: {
                                l: {
                                    value: "unchecked"
                                },
                                m: {
                                    value: "checked"
                                }
                            }
                        }
                    }
                }
            }
        };

        jqUnit.test("gpii.oauth2.selectionTree.deriveHasSelection", function () {
            var tests = [
                { value: "checked", expected: true },
                { value: "indeterminate", expected: true },
                { value: "unchecked", expected: false },
                { value: undefined, expected: false }
            ];

            fluid.each(tests, function (testcase) {
                jqUnit.assertEquals(testcase.value + " => " + testcase.expected, testcase.expected,
                    gpii.oauth2.selectionTree.deriveHasSelection({ rootSelectionsValue: testcase.value }));
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.getSelectionNode", function () {

            var selections = {
                value: "root",
                children: {
                    a: {
                        value: "a-val",
                        children: {
                            c: {
                                value: "c-val"
                            }
                        }
                    },
                    b: {
                        value: "b-val"
                    }
                }
            };

            var tests = {
                nullSelections: {
                    selections: null,
                    segs: ["a"],
                    expected: null
                },
                root: {
                    selections: selections,
                    segs: [],
                    expected: selections
                },
                missingNode1: {
                    selections: selections,
                    segs: ["z"],
                    expected: undefined
                },
                missingNode2: {
                    selections: selections,
                    segs: ["b", "c"],
                    expected: undefined
                },
                a: {
                    selections: selections,
                    segs: ["a"],
                    expected: selections.children.a
                },
                b: {
                    selections: selections,
                    segs: ["b"],
                    expected: selections.children.b
                },
                c: {
                    selections: selections,
                    segs: ["a", "c"],
                    expected: selections.children.a.children.c
                }
            };

            fluid.each(tests, function (testObj, testName) {
                var result = gpii.oauth2.selectionTree.getSelectionNode(testObj.selections, testObj.segs);
                jqUnit.assertEquals("Selections node '" + testName + "'", testObj.expected, result);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.toServerModel", function () {

            var testPaths = {
                "children.a.children.d": {},
                "children.b.children.e": {"": true},
                "children.c.children.k": {"m": true},
                "children.a": {},
                "children.b": {"": true},
                "children.c": {"i": true, "k.m": true},
                "": {"b": true, "c.i": true, "c.k.m": true}
            };

            fluid.each(testPaths, function (expected, path) {
                var selections = fluid.get(gpii.tests.oauth2.selectionTree.sampleComponentSelections, path);
                var result = gpii.oauth2.selectionTree.toServerModel(selections);
                jqUnit.assertDeepEq("The server model should be generated correctly for '" + path + "'", expected, result);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.pathsToSegs", function () {
            var tests = [{
                paths: {},
                expected: []
            }, {
                paths: {"": true},
                expected: [[]]
            }, {
                paths: {"a": true},
                expected: [["a"]]
            }, {
                paths: {"a.b": true},
                expected: [["a", "b"]]
            }, {
                paths: {"a.b": true, "c.d": true},
                expected: [["a", "b"], ["c", "d"]]
            }];

            fluid.each(tests, function (testObj) {
                var result = gpii.oauth2.selectionTree.pathsToSegs(testObj.paths);
                jqUnit.assertDeepEq("The segs array for path '" + testObj.paths + "'", testObj.expected, result);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.setValueAndAllDescendants", function () {
            var tests = {
                topLevel: {
                    selections: {
                        value: "unset"
                    },
                    expected: {
                        value: "set"
                    }
                },
                singleLevel: {
                    selections: {
                        value: "unset",
                        children: {
                            a: {
                                value: "unset"
                            }
                        }
                    },
                    expected: {
                        value: "set",
                        children: {
                            a: {
                                value: "set"
                            }
                        }
                    }
                },
                multiLevel: {
                    selections: {
                        value: "unset",
                        children: {
                            a: {
                                value: "unset"
                            },
                            b: {
                                value: "unset",
                                children: {
                                    c: {
                                        value: "unset"
                                    }
                                }
                            }
                        }
                    },
                    expected: {
                        value: "set",
                        children: {
                            a: {
                                value: "set"
                            },
                            b: {
                                value: "set",
                                children: {
                                    c: {
                                        value: "set"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.setValueAndAllDescendants(testObj.selections, "set");
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.selections);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.updateAncestors", function () {
            var tests = {
                topLevelChecked: {
                    selections: {
                        value: "checked"
                    },
                    segs: [],
                    expected: {
                        value: "checked"
                    }
                },
                topLevelUnChecked: {
                    selections: {
                        value: "unchecked"
                    },
                    segs: [],
                    expected: {
                        value: "unchecked"
                    }
                },
                topLevelIndeterminate: {
                    selections: {
                        value: "indeterminate"
                    },
                    segs: [],
                    expected: {
                        value: "indeterminate"
                    }
                },
                singleLevelChecked: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "checked"
                            }
                        }
                    },
                    segs: ["a"],
                    expected: {
                        value: "checked",
                        children: {
                            a: {
                                value: "checked"
                            }
                        }
                    }
                },
                singleLevelUnchecked: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "unchecked"
                            }
                        }
                    },
                    segs: ["a"],
                    expected: {
                        value: "unchecked",
                        children: {
                            a: {
                                value: "unchecked"
                            }
                        }
                    }
                },
                singleLevelIndeterminate: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "indeterminate"
                            }
                        }
                    },
                    segs: ["a"],
                    expected: {
                        value: "indeterminate",
                        children: {
                            a: {
                                value: "indeterminate"
                            }
                        }
                    }
                },
                multiLevelChecked: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "checked"
                            },
                            b: {
                                value: "",
                                children: {
                                    c: {
                                        value: "checked"
                                    }
                                }
                            }
                        }
                    },
                    segs: ["b", "c"],
                    expected: {
                        value: "checked",
                        children: {
                            a: {
                                value: "checked"
                            },
                            b: {
                                value: "checked",
                                children: {
                                    c: {
                                        value: "checked"
                                    }
                                }
                            }
                        }
                    }
                },
                multiLevelUnChecked: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "unchecked"
                            },
                            b: {
                                value: "",
                                children: {
                                    c: {
                                        value: "unchecked"
                                    }
                                }
                            }
                        }
                    },
                    segs: ["b", "c"],
                    expected: {
                        value: "unchecked",
                        children: {
                            a: {
                                value: "unchecked"
                            },
                            b: {
                                value: "unchecked",
                                children: {
                                    c: {
                                        value: "unchecked"
                                    }
                                }
                            }
                        }
                    }
                },
                multiLevelIndeterminate: {
                    selections: {
                        value: "",
                        children: {
                            a: {
                                value: "checked"
                            },
                            b: {
                                value: "",
                                children: {
                                    c: {
                                        value: "unchecked"
                                    }
                                }
                            }
                        }
                    },
                    segs: ["b", "c"],
                    expected: {
                        value: "indeterminate",
                        children: {
                            a: {
                                value: "checked"
                            },
                            b: {
                                value: "unchecked",
                                children: {
                                    c: {
                                        value: "unchecked"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.updateAncestors(testObj.selections, testObj.segs);
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.selections);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.setValueAndAllAncestors", function () {
            var tests = {
                topLevel: {
                    selections: {
                        value: "unset"
                    },
                    segs: [],
                    expected: {
                        value: "set"
                    }
                },
                singleLevel: {
                    selections: {
                        value: "unset",
                        children: {
                            a: {
                                value: "unset"
                            }
                        }
                    },
                    segs: ["a"],
                    expected: {
                        value: "set",
                        children: {
                            a: {
                                value: "set"
                            }
                        }
                    }
                },
                multiLevel: {
                    selections: {
                        value: "unset",
                        children: {
                            a: {
                                value: "unset"
                            },
                            b: {
                                value: "unset",
                                children: {
                                    c: {
                                        value: "unset"
                                    }
                                }
                            }
                        }
                    },
                    segs: ["b", "c"],
                    expected: {
                        value: "set",
                        children: {
                            a: {
                                value: "unset"
                            },
                            b: {
                                value: "set",
                                children: {
                                    c: {
                                        value: "set"
                                    }
                                }
                            }
                        }
                    }
                },
                multiLevelFromEmpty: {
                    selections: {},
                    segs: ["b", "c"],
                    expected: {
                        value: "set",
                        children: {
                            b: {
                                value: "set",
                                children: {
                                    c: {
                                        value: "set"
                                    }
                                }
                            }
                        }
                    }
                }
            };

            fluid.each(tests, function (testObj, testName) {
                gpii.oauth2.selectionTree.setValueAndAllAncestors(testObj.selections, testObj.segs, "set");
                jqUnit.assertDeepEq("The '" + testName + "' test object should be set correctly", testObj.expected, testObj.selections);
            });
        });

        jqUnit.test("gpii.oauth2.selectionTree.toSelectionsModel", function () {

            var tests = [{
                serverModel: {},
                expected: {
                    value: "unchecked",
                    children: {
                        a: {
                            value: "unchecked",
                            children: {
                                d: {
                                    value: "unchecked"
                                }
                            }
                        },
                        b: {
                            value: "unchecked",
                            children: {
                                e: {
                                    value: "unchecked"
                                },
                                f: {
                                    value: "unchecked",
                                    children: {
                                        g: {
                                            value: "unchecked"
                                        }
                                    }
                                }
                            }
                        },
                        c: {
                            value: "unchecked",
                            children: {
                                h: {
                                    value: "unchecked"
                                },
                                i: {
                                    value: "unchecked",
                                    children: {
                                        j: {
                                            value: "unchecked"
                                        }
                                    }
                                },
                                k: {
                                    value: "unchecked",
                                    children: {
                                        l: {
                                            value: "unchecked"
                                        },
                                        m: {
                                            value: "unchecked"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                serverModel: {"": true},
                expected: {
                    value: "checked",
                    children: {
                        a: {
                            value: "checked",
                            children: {
                                d: {
                                    value: "checked"
                                }
                            }
                        },
                        b: {
                            value: "checked",
                            children: {
                                e: {
                                    value: "checked"
                                },
                                f: {
                                    value: "checked",
                                    children: {
                                        g: {
                                            value: "checked"
                                        }
                                    }
                                }
                            }
                        },
                        c: {
                            value: "checked",
                            children: {
                                h: {
                                    value: "checked"
                                },
                                i: {
                                    value: "checked",
                                    children: {
                                        j: {
                                            value: "checked"
                                        }
                                    }
                                },
                                k: {
                                    value: "checked",
                                    children: {
                                        l: {
                                            value: "checked"
                                        },
                                        m: {
                                            value: "checked"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                serverModel: {"a": true},
                expected: {
                    value: "indeterminate",
                    children: {
                        a: {
                            value: "checked",
                            children: {
                                d: {
                                    value: "checked"
                                }
                            }
                        },
                        b: {
                            value: "unchecked",
                            children: {
                                e: {
                                    value: "unchecked"
                                },
                                f: {
                                    value: "unchecked",
                                    children: {
                                        g: {
                                            value: "unchecked"
                                        }
                                    }
                                }
                            }
                        },
                        c: {
                            value: "unchecked",
                            children: {
                                h: {
                                    value: "unchecked"
                                },
                                i: {
                                    value: "unchecked",
                                    children: {
                                        j: {
                                            value: "unchecked"
                                        }
                                    }
                                },
                                k: {
                                    value: "unchecked",
                                    children: {
                                        l: {
                                            value: "unchecked"
                                        },
                                        m: {
                                            value: "unchecked"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                serverModel: {"b.f": true},
                expected: {
                    value: "indeterminate",
                    children: {
                        a: {
                            value: "unchecked",
                            children: {
                                d: {
                                    value: "unchecked"
                                }
                            }
                        },
                        b: {
                            value: "indeterminate",
                            children: {
                                e: {
                                    value: "unchecked"
                                },
                                f: {
                                    value: "checked",
                                    children: {
                                        g: {
                                            value: "checked"
                                        }
                                    }
                                }
                            }
                        },
                        c: {
                            value: "unchecked",
                            children: {
                                h: {
                                    value: "unchecked"
                                },
                                i: {
                                    value: "unchecked",
                                    children: {
                                        j: {
                                            value: "unchecked"
                                        }
                                    }
                                },
                                k: {
                                    value: "unchecked",
                                    children: {
                                        l: {
                                            value: "unchecked"
                                        },
                                        m: {
                                            value: "unchecked"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, {
                serverModel: {"a": true, "b.f": true, "c.i": true, "c.k.m": true},
                expected: {
                    value: "indeterminate",
                    children: {
                        a: {
                            value: "checked",
                            children: {
                                d: {
                                    value: "checked"
                                }
                            }
                        },
                        b: {
                            value: "indeterminate",
                            children: {
                                e: {
                                    value: "unchecked"
                                },
                                f: {
                                    value: "checked",
                                    children: {
                                        g: {
                                            value: "checked"
                                        }
                                    }
                                }
                            }
                        },
                        c: {
                            value: "indeterminate",
                            children: {
                                h: {
                                    value: "unchecked"
                                },
                                i: {
                                    value: "checked",
                                    children: {
                                        j: {
                                            value: "checked"
                                        }
                                    }
                                },
                                k: {
                                    value: "indeterminate",
                                    children: {
                                        l: {
                                            value: "unchecked"
                                        },
                                        m: {
                                            value: "checked"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }];

            fluid.each(tests, function (testObj) {
                var result = gpii.oauth2.selectionTree.toSelectionsModel(testObj.serverModel, gpii.tests.oauth2.selectionTree.sampleClientAvailablePrefs);
                jqUnit.assertDeepEq("The component model should be generated correctly for '" + JSON.stringify(testObj.serverModel) + "'", testObj.expected, result);
            });

        });

        gpii.tests.oauth2.selectionTree.testRemoveLeaf = function (name, container) {
            container = $(container);
            var selectors = {
                removeElm: ".gpiic-oauth2-selectionTree-removeLeaf-removeElm",
                removed: ".gpiic-oauth2-selectionTree-removeLeaf-removed",
                preserved: ".gpiic-oauth2-selectionTree-removeLeaf-preserved"
            };

            var find = function (sel) {
                return container.find(selectors[sel]);
            };

            gpii.oauth2.selectionTree.removeLeaf(find("removeElm"), selectors.removed);

            jqUnit.assertTrue(name + ": the removeElm should no longer exist", find("removeElm").length === 0);
            jqUnit.assertTrue(name + ": the removed container should no longer exist", find("removed").length === 0);
            jqUnit.assertTrue(name + ": the preserved elm should still exist", find("preserved").length > 0);
        };

        jqUnit.test("gpii.oauth2.selectionTree.removeLeaf", function () {
            gpii.tests.oauth2.selectionTree.testRemoveLeaf("Top Level", ".gpiic-oauth2-selectionTree-removeLeaf-topLevel");
            gpii.tests.oauth2.selectionTree.testRemoveLeaf("Nested", ".gpiic-oauth2-selectionTree-removeLeaf-nested");
        });

        gpii.tests.oauth2.selectionTree.checkboxCleanup = function (checkbox) {
            checkbox.prop({
                "indeterminate": false,
                "checked": false
            });
        };

        jqUnit.test("gpii.oauth2.selectionTree.setCheckbox", function () {
            var checkbox = $(".gpiic-oauth2-selectionTree-testCheckbox");
            gpii.tests.oauth2.selectionTree.checkboxCleanup(checkbox);

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

            gpii.tests.oauth2.selectionTree.checkboxCleanup(checkbox);
        });

        fluid.defaults("gpii.tests.oauth2.preferencesSelectionTree", {
            gradeNames: ["gpii.oauth2.preferencesSelectionTree"],
            availablePrefs: {
                "increase-size": true,
                "increase-size.appearance": true,
                "increase-size.appearance.text-size": true,
                "simplify": true,
                "simplify.table-of-contents": true,
                "universal-volume": true,
                "universal-language": true,
                "visual-alternatives": true,
                "visual-alternatives.speak-text": true,
                "visual-alternatives.speak-text.rate": true,
                "visual-alternatives.speak-text.volume": true,
                "visual-styling": true,
                "visual-styling.change-contrast": true
            },
            resources: {
                template: {
                    href: "../../../../public/src/components/selectionTree/html/SelectionTreeTemplate.html"
                }
            }
        });

        // TODO: Cleanup and expand tests
        // - consider changing this to the IoC Testing framework
        // - add tests for visibility of collapsed leafs
        // - add tests for the various state changes (checked, unchecked, indeterminate)
        jqUnit.asyncTest("gpii.oauth2.preferencesSelectionTree", function () {
            var assertSelectionTree = function (that) {
                fluid.each(that.options.domMap, function (selector, selectorName) {
                    var elm = that.container.find(selector);
                    if (that.options.availablePrefs[selectorName] || selectorName === "") {
                        jqUnit.assertNodeExists("'" + selector + "' should exist", elm);
                    } else {
                        jqUnit.assertNodeNotExists("'" + selector + "' should not exist", elm);
                    }
                });

                // assert aria
                jqUnit.assertEquals("The tree role should be added", "tree", that.locate("tree").attr("role"));
                fluid.each(that.locate("branch"), function (branch, idx) {
                    branch = $(branch);
                    jqUnit.assertEquals("The group role should have been set on branch: " + idx, "group", branch.attr("role"));
                });
                fluid.each(that.locate("leaf"), function (leaf, idx) {
                    leaf = $(leaf);
                    jqUnit.assertEquals("The treeitem role should have been set on leaf: " + idx, "treeitem", leaf.attr("role"));
                });
                fluid.each(that.locate("branchToggle"), function (branchToggle, idx) {
                    branchToggle = $(branchToggle);
                    jqUnit.assertTrue("The aria-controls property should be set for branchToggle: " + idx, branchToggle.attr("aria-controls"));
                    jqUnit.assertEquals("The aria-expanded property should be set for branchToggle: " + idx, "false", branchToggle.attr("aria-expanded"));
                    jqUnit.assertTrue("The collapsed style should be applied", branchToggle.hasClass(that.options.styles.collapsed));
                    jqUnit.assertFalse("The expanded style should not be applied", branchToggle.hasClass(that.options.styles.expanded));
                });

                // assert expand and collapse
                var firstToggle = that.locate("branchToggle").eq(0);
                firstToggle.click();
                jqUnit.assertEquals("The aria-expanded state should be true", "true", firstToggle.attr("aria-expanded"));
                jqUnit.assertTrue("The expanded style should be applied", firstToggle.hasClass(that.options.styles.expanded));
                jqUnit.assertFalse("The collapsed style should not be applied", firstToggle.hasClass(that.options.styles.collapsed));
                firstToggle.click();
                jqUnit.assertEquals("The aria-expanded state should be false", "false", firstToggle.attr("aria-expanded"));
                jqUnit.assertTrue("The collapsed style should be applied", firstToggle.hasClass(that.options.styles.collapsed));
                jqUnit.assertFalse("The expanded style should not be applied", firstToggle.hasClass(that.options.styles.expanded));

                // continue test
                jqUnit.start();
            };

            gpii.tests.oauth2.preferencesSelectionTree(".gpiic-oauth2-selectionTree", {
                listeners: {
                    afterTemplateLoaded: {
                        func: assertSelectionTree,
                        priority: "last"
                    }
                }
            });
        });

        jqUnit.asyncTest("model.hasSelection is updated after selections model change", function () {
            var testHasSelection = function (that) {
                jqUnit.assertFalse("model.hasSelection is initially false", that.model.hasSelection);

                // load an all-checked preferences set
                gpii.oauth2.selectionTree.updateSelectionsFromServer(that, {"": true});
                jqUnit.assertEquals("model.selections.value is \"checked\" after loading an all-checked preferences set", "checked", that.model.selections.value);
                jqUnit.assertTrue("model.hasSelection is true after loading an all-checked preferences set", that.model.hasSelection);

                // uncheck root
                gpii.oauth2.selectionTree.updateSelectionsModel(that, "", "unchecked");
                jqUnit.assertEquals("model.selections.value is \"unchecked\" after unchecking root", "unchecked", that.model.selections.value);
                jqUnit.assertFalse("model.hasSelection is false after unchecking root", that.model.hasSelection);

                // check a child value
                gpii.oauth2.selectionTree.updateSelectionsModel(that, "simplify", "checked");
                jqUnit.assertEquals("model.selections.value is \"indeterminate\" after checking a child value", "indeterminate", that.model.selections.value);
                jqUnit.assertTrue("model.hasSelection is true after checking a child value", that.model.hasSelection);

                // continue test
                jqUnit.start();
            };

            gpii.tests.oauth2.preferencesSelectionTree(".gpiic-oauth2-selectionTree-testHasSelection", {
                listeners: {
                    afterTemplateLoaded: {
                        func: testHasSelection,
                        priority: "last"
                    }
                }
            });
        });

        jqUnit.asyncTest("The destroy of the selectionTree cleans up its container", function () {
            var testDestroy = function (that) {
                jqUnit.assertNotEquals("The selection tree is populated", "", that.container.html());
                that.destroy();
                jqUnit.assertEquals("The populated selection tree has been removed at the component destroy", "", that.container.html());

                jqUnit.start();
            };

            gpii.tests.oauth2.preferencesSelectionTree(".gpiic-oauth2-selectionTree-testDestory", {
                listeners: {
                    afterTemplateLoaded: {
                        func: testDestroy,
                        args: ["{that}"],
                        priority: "last"
                    }
                }
            });
        });

    });
})(jQuery);
