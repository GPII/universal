/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This shared script defines migrated values for the GPII-4014 deployment.

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.migration.GPII4014");

// Migrated values
gpii.migration.GPII4014.oldSchemaVersion = "0.1";
gpii.migration.GPII4014.newSchemaVersion = "0.2";

gpii.migration.GPII4014.newValuesForNovaClientCredential = {
    "allowedIPBlocks": null,
    "allowedPrefsToWrite": [
        "http://registry.gpii.net/common/language",
        "http://registry.gpii.net/common/DPIScale",
        "http://registry.gpii.net/common/highContrast/enabled",
        "http://registry.gpii.net/common/highContrastTheme",
        "http://registry.gpii.net/common/selfVoicing/enabled",
        "http://registry.gpii.net/applications/com.microsoft.office"
    ],
    "isCreateGpiiKeyAllowed": true,
    "isCreatePrefsSafeAllowed": true
};

gpii.migration.GPII4014.newValuesForPublicClientCredential = {
    allowedIPBlocks: null,
    allowedPrefsToWrite: null,
    isCreateGpiiKeyAllowed: false,
    isCreatePrefsSafeAllowed: false
};
