"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.cloud.oauth2");

require("./OAuth2AcceptanceDataStore.js");

var testDefs = require("./AcceptanceTests_chrome.js");

gpii.tests.cloud.oauth2.chrome = {
    client_id: "org.chrome.cloud4chrome",
    client_secret: "client_secret_chrome",
    redirect_uri: "http://org.chrome.cloud4chrome/the-client%27s-uri/",
    state: "The Client's Unique State",
    username: "bob",
    password: "b"
};

gpii.test.cloudBased.oauth2.bootstrap(testDefs, gpii.tests.cloud.oauth2.chrome, __dirname);
