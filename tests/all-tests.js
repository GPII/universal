/*!
GPII Universal Tests

Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require, __dirname*/
// This loads universal.
var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii");

(function () {

    fluid.require("../gpii/node_modules/gpiiFramework/test/DataSourceTests.js", require);
    fluid.require("../gpii/node_modules/gpiiFramework/test/DataSourceTests.js", require);
    fluid.require("../gpii/node_modules/settingsHandlers/test/JSONSettingsHandlerTests.js", require);
    fluid.require("../gpii/node_modules/settingsHandlers/test/XMLSettingsHandlerTests.js", require);

}());