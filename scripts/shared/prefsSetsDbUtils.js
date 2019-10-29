/*!
Copyright 2018 Raising the Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/**
 * This file contains utilities that are useful to generate keys data that
 * can be inserted into a CouchDB.
 *
 * Actually, these utils are used in:
 *   * convertPrefs.js
 *   * loadEmptyKeys.js
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.prefsSetsDbUtils");

/**
 * This is an empty preferences set.
 */
gpii.prefsSetsDbUtils.emptyPreferencesBlock = {
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {}
            }
        }
    }
};

/**
 * Generate the data for a key creation.
 *
 * The data contains both the gpiiKey and the preferences safe.
 *
 * @param  {String} gpiiKeyId - The identifier of the prefsSet (usually, a uuid).
 * @param  {Object} preferences - The preferences to include in the prefsSet.
 * @param  {String} prefsSafeType - The type of the prefsSafe, either "user" or "snapset".
 * @return {Object} A JSON object containing the documents ready to be inserted into DB.
 */
gpii.prefsSetsDbUtils.generateKeyData = function (gpiiKeyId, preferences, prefsSafeType) {
    var currentTime = new Date().toISOString();
    var prefsSafeId = "prefsSafe-" + gpiiKeyId;

    var newGpiiKey = {
        "_id": gpiiKeyId,
        "type": "gpiiKey",
        "schemaVersion": "0.2",
        "prefsSafeId": prefsSafeId,
        "prefsSetId": "gpii-default",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": currentTime,
        "timestampUpdated": null
    };

    var newPrefsSafe = {
        "_id": prefsSafeId,
        "type": "prefsSafe",
        "schemaVersion": "0.2",
        "prefsSafeType": prefsSafeType || "user",
        "name": gpiiKeyId,
        "email": null,
        "preferences": preferences || gpii.prefsSetsDbUtils.emptyPreferencesBlock,
        "timestampCreated": currentTime,
        "timestampUpdated": null
    };

    return { gpiiKey: newGpiiKey, prefsSafe: newPrefsSafe };
};
