var fluid = require("infusion");
var jqUnit = fluid.require("../lib/jqUnit-node.js", require);

jqUnit.module("Passing Tests Module");

console.log("\nNote: for a pass, a total of 12 tests should be seen, including \"Deep equivalence tests\" and \"IoC-driven Cat test case\"\n");

jqUnit.test("Simple assertions and counts", function() {
    jqUnit.expect(6);
    jqUnit.assert("Simple assertion");
    jqUnit.assertTrue("Assert true", true);
    jqUnit.assertEquals("Assert equals", 1, 1);
    jqUnit.assertNotEquals("Assert not equals", 1, 2);
    jqUnit.assertValue("Assert value", 1);
    jqUnit.assertNoValue("Assert no value", null);
});

jqUnit.test("Deep equivalence tests", function() {
    jqUnit.expect(4);
    var value = {a: 1, b: 2};
    jqUnit.assertDeepEq("Assert deep equals", value, fluid.copy(value));
    jqUnit.assertDeepNeq("Assert deep not equals", value, {a: 1, b: 3});
    jqUnit.assertLeftHand("Assert left hand", {a: 1}, value);
    jqUnit.assertRightHand("Assert right hand", value, {a: 1});
});
fluid.defaults("fluid.tests.myTestTree", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    components: {
        cat: {
            type: "fluid.tests.cat"
        },
        catTester: {
            type: "fluid.tests.catTester"
        }
    }
});

/** Test IoC testing framework **/

fluid.defaults("fluid.tests.cat", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
});

fluid.tests.cat.preInit = function (that) {
    that.makeSound = function () {
        return "meow";
    };
};

/** Test Case Holder - holds declarative representation of test cases **/

fluid.defaults("fluid.tests.catTester", {
    gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
    modules: [ /* declarative specification of tests */ {
        name: "IoC-driven Cat test case",
        tests: [{
            expect: 1,
            name: "Test Meow",
            func: "{that}.testMeow",
            args: "{cat}"
        }, {
            expect: 1,
            name: "Test Global Meow",
            func: "fluid.tests.globalCatTest",
            args: "{cat}"
        }
        ]
    }]
});

fluid.tests.globalCatTest = function (catt) {
    jqUnit.assertEquals("Sound", "meow", catt.makeSound());
};

fluid.tests.catTester.preInit = function (that) {
    that.testMeow = fluid.tests.globalCatTest;
};

fluid.test.runTests([
    "fluid.tests.myTestTree"
]);