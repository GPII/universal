var testrunner = require("qunit");

testrunner.run({
    code: "../../src/MatchMaker.js",
    tests: "./tests.js"
});