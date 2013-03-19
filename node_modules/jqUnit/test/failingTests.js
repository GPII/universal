var fluid = require("infusion");
var jqUnit = fluid.require("../lib/jqUnit-node.js", require);

jqUnit.module("Failing Tests Module");

var colors = fluid.registerNamespace("colors");

jqUnit.onAllTestsDone.addListener(function(data) {
    if (data.passed === 0) {
        console.log(colors.stylize("jqUnit selfTest OK - all tests failed", ["green", "bold"]));
    } else {
        console.log("jqUnit selfTest failed - " + data.passed + " tests passed, all should fail");
    }
});

jqUnit.test("Simple assertions and counts", function() {
    jqUnit.assertTrue("Assert true", false);
    jqUnit.assertEquals("Assert equals", 1, 2);
    jqUnit.assertNotEquals("Assert not equals", 1, 1);
    jqUnit.assertValue("Assert value", undefined);
    jqUnit.assertNoValue("Assert no value", 1);
    var value = {a: 1, b: 2};
    jqUnit.assertDeepEq("Assert deep equals", value, {a: 1, b: 3});
    jqUnit.assertDeepNeq("Assert deep not equals", value, fluid.copy(value));
    jqUnit.assertLeftHand("Assert left hand", value, {a: 1});
    jqUnit.assertRightHand("Assert right hand", {a: 1}, value);
});