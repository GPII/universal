/*!
GPII OAuth 2 Base Data Store

Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion");

fluid.registerNamespace("gpii.oauth2");

fluid.defaults("gpii.oauth2.dataStore", {
    gradeNames: "fluid.component"
});
