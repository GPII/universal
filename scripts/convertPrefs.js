// This script reads files from a directory that has old preferences data, such as testData/preferences/, and convert them to json files of
// GPII keys and preferences safes in the new GPII data model: https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences

// Example command to run this script:
// node convertPrefs.js testData/preferences/ testData/dbData/gpiiKeys.json testData/dbData/prefsSafes.json

"use strict";

var fs = require("fs");

var inputDir = process.argv[2];
var gpiiKeysFile = process.argv[3];
var prefsSafesFile = process.argv[4];

var prefsSafes = [];
var gpiiKeys = [];
var count = 0;

var filenames = fs.readdirSync(inputDir);

filenames.forEach(function (filename) {
    if (filename.substr(filename.length - 5) === ".json") {
        var gpiiKey = filename.substr(0, filename.length - 5);
        var preferences = fs.readFileSync(inputDir + filename, "utf-8");
        var currentTime = new Date().toISOString();
        var prefsSafeId = "prefsSafe-" + ++count;

        var oneGpiiKey = {
            "_id": gpiiKey,
            "type": "gpiiKey",
            "schemaVersion": "0.1",
            "prefsSafeId": prefsSafeId,
            "prefsSetId": "gpii-default",
            "revoked": false,
            "revokedReason": null,
            "timestampCreated": currentTime,
            "timestampUpdated": null
        };
        gpiiKeys.push(oneGpiiKey);

        var onePrefsSafe = {
            "_id": prefsSafeId,
            "type": "prefsSafe",
            "schemaVersion": "0.1",
            "prefsSafeType": "user",
            "name": null,
            "password": null,
            "email": null,
            "preferences": JSON.parse(preferences),
            "timestampCreated": currentTime,
            "timestampUpdated": null
        };
        prefsSafes.push(onePrefsSafe);

    }
});

fs.writeFileSync(prefsSafesFile, JSON.stringify(prefsSafes, null, 4));
fs.writeFileSync(gpiiKeysFile, JSON.stringify(gpiiKeys, null, 4));
