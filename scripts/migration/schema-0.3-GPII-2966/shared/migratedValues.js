/*!
Copyright 2019 Raising the Floor - US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This shared script defines migrated values for the GPII-4014 deployment.

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.migration.GPII2966");

// Migrated values
gpii.migration.GPII2966.oldSchemaVersion = "0.2";
gpii.migration.GPII2966.newSchemaVersion = "0.3";

gpii.migration.GPII2966.passwordFieldName = "password";
