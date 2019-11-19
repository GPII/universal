/*!
GPII Universal Production Tests

Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

WARNING:  Do not run these tests directly.  They are called from within the
"vagrantCloudBasedContainers.sh" after it has initialized the environment.
*/

"use strict";

var fluid = require("infusion"),
    kettle = fluid.require("kettle");

// Ensure this happens first, to catch errors during code loading.
kettle.loadTestingSupport();

// Pass the current `require` to `fluid.require`, as nyc's instrumentation is hooked into it.
fluid.require("%gpii-universal", require);

var testIncludes = [
    "./CloudStatusProductionTests.js",
    "./SettingsGetProductionTests.js",
    "./SettingsPutProductionTests.js"
];

fluid.each(testIncludes, function (path) {
    require(path);
});
