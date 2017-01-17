/*
 * Copyright 2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion");

fluid.defaults("gpii.app", {
    gradeNames: ["fluid.component"],
    components: {
        appImpl: {
            type: "fluid.component",
            options: {
                listeners: {
                    "onCreate.log": {
                        listener: "console.log",
                        args: ["!!! The app component has been created!"]
                    }
                }
            }
        }
    }
});
