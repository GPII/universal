var fluid = require("infusion");

// Begin testing functions which rely on the Fluid framework
// These functions rescued from Infusion framework TestUtil.sjs

fluid.registerNamespace("fluid.testUtils");

/** Sort a component tree into canonical order, to facilitate comparison with
 * deepEq */

fluid.testUtils.sortTree = function (tree) {
    function comparator(ela, elb) {
        var ida = ela.ID || "";
        var idb = elb.ID || "";
        var cola = ida.indexOf(":") === -1;
        var colb = idb.indexOf(":") === -1;
        if (cola && colb) { // if neither has a colon, compare by IDs if they have IDs
            return ida.localeCompare(idb);
        }
        else {
            return cola - colb; 
        }
    }
    if (fluid.isArrayable(tree)) {
        tree.sort(comparator);
    }
    fluid.each(tree, function (value) {
        if (!fluid.isPrimitive(value)) {
            fluid.testUtils.sortTree(value);
        }
    });
      
};

fluid.testUtils.canonicaliseFunctions = function (tree) {
    return fluid.transform(tree, function(value) {
        if (fluid.isPrimitive(value)) {
            if (typeof(value) === "function") {
                return fluid.identity;
            }
            else return value;
        }
        else return fluid.testUtils.canonicaliseFunctions(value);
    });
};

// This object has already been created by jqUnit.js
var jqUnit = fluid.registerNamespace("jqUnit"); 

/** Assert that two trees are equal after applying a "canonicalisation function". This can be used in 
 * cases where the criterion for equivalence is looser than exact object equivalence - for example, 
 * when using renderer trees, "fluid.testUtils.sortTree" can be used for canonFunc", or in the case
 * of a resourceSpec, "fluid.testUtils.canonicaliseFunctions". **/

jqUnit.assertCanoniseEqual = function (message, expected, actual, canonFunc) {
    var expected2 = canonFunc(expected);
    var actual2 = canonFunc(actual);
    jqUnit.assertDeepEq(message, expected2, actual2);  
};

/** Assert that the expected value object is a subset (considered in terms of shallow key coincidence) of the
 * "actual" value object **/ 

jqUnit.assertLeftHand = function(message, expected, actual) {
    jqUnit.assertDeepEq(message, expected, fluid.filterKeys(actual, fluid.keys(expected)));  
};

/** Assert that the expected value object is a superset of the "actual" value object **/

jqUnit.assertRightHand = function(message, expected, actual) {
    jqUnit.assertDeepEq(message, fluid.filterKeys(expected, fluid.keys(actual)), actual);  
};
