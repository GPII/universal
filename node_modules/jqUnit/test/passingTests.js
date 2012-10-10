var fluid = require("infusion");
var jqUnit = fluid.require("jqUnit");

jqUnit.module("Passing Tests Module");

jqUnit.test("Simple assertions and counts", function() {
    jqUnit.expect(10);
    jqUnit.assert("Simple assertion");
    jqUnit.assertTrue("Assert true", true);
    jqUnit.assertEquals("Assert equals", 1, 1);
    jqUnit.assertNotEquals("Assert not equals", 1, 2);
    jqUnit.assertValue("Assert value", 1);
    jqUnit.assertNoValue("Assert no value", null);
    var value = {a: 1, b: 2};
    jqUnit.assertDeepEq("Assert deep equals", value, fluid.copy(value));
    jqUnit.assertDeepNeq("Assert deep not equals", value, {a: 1, b: 3});
    jqUnit.assertLeftHand("Assert left hand", {a: 1}, value);
    jqUnit.assertRightHand("Assert right hand", value, {a: 1});
});