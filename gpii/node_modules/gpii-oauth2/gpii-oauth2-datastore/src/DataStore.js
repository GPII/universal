/*!
GPII OAuth 2 Base Data Store

Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    fluid.registerNamespace("gpii.oauth2");

    fluid.defaults("gpii.oauth2.dataStore", {
        gradeNames: "fluid.component"
    });

})();
