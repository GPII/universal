"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2");

var testDefs = require("./AcceptanceTests_chrome.js");

gpii.tests.cloud.oauth2.chrome = {
	client_id: "org.chrome.cloud4chrome",
	redirect_uri: "http://the-clients-uri/",
	state: "The Client's Unique State"
};

gpii.test.cloudBased.oauth2.bootstrap(testDefs, gpii.tests.cloud.oauth2.chrome, __dirname);
