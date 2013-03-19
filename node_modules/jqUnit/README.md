[jQUnit-node] - A JavaScript Unit Testing framework.
================================

The XUnit testing style (first seen in JUnit and the like) is a popular style
for writing test fixtures. jqUnit-node is a port of this idiom to JavaScript for use
within the node.js server-side JavaScript framework. It uses the Fluid framework
and module loading system for resolution, and expects that the code under test
does the same.

To run a file containing test fixtures, simply execute it with node - 
```
node fixtureFile.js
```

To write a fixture file, begin with
```
var fluid = require("infusion");
var jqUnit = fluid.require(jqUnit); 
```

You may use also use plain "require" to load jqUnit, although it is essential that it itself may resolve the fluid framework (infusion).

Then begin by starting a "module" and then issue some tests:
```
jqUnit.module("My Module");

jqUnit.test("My test case", function() {
    jqUnit.assertTrue("I assert that this is true", true);
    }
);
```