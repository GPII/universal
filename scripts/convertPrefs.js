/*!
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script reads files from an input directory that contains preferences JSON5 files and convert them to JSON files of GPII keys and
// preferences safes that complies with the new GPII data model: https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences in the target directory
// Usage: node scripts/convertPrefs.js {input_path} {target_path}
//
// An examplary command that runs this script in the universal root directory:
// node scripts/convertPrefs.js testData/preferences/ build/dbData/

"use strict";

var fs = require("fs"),
    JSON5 = require("json5");

var inputDir = process.argv[2];
var targetDir = process.argv[3];
var gpiiKeysFile = targetDir + "gpiiKeys.json";
var prefsSafesFile = targetDir + "prefsSafes.json";

var prefsSafes = [];
var gpiiKeys = [];
var count = 0;

var filenames = fs.readdirSync(inputDir);

console.log("Converting preferences data in the source directory " + inputDir + " to the target directory " + targetDir + "...");

// Read and loop thru json5 files in the input directory
filenames.forEach(function (filename) {
    if (filename.endsWith(".json5")) {
        var gpiiKey = filename.substr(0, filename.length - 6);
        var preferences = fs.readFileSync(inputDir + filename, "utf-8");
        var currentTime = new Date().toISOString();
        var prefsSafeId = "prefsSafe-" + gpiiKey;

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
            "name": gpiiKey,
            "password": null,
            "email": null,
            "preferences": JSON5.parse(preferences),
            "timestampCreated": currentTime,
            "timestampUpdated": null
        };
        prefsSafes.push(onePrefsSafe);

    }
});

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)){
    fs.mkdirSync(targetDir);
}

// Write the target files
fs.writeFileSync(prefsSafesFile, JSON.stringify(prefsSafes, null, 4));
fs.writeFileSync(gpiiKeysFile, JSON.stringify(gpiiKeys, null, 4));

console.log("Finished converting preferences data in the source directory " + inputDir + " to the target directory " + targetDir + "!");
