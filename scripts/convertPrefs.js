/*!
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script reads files from an input directory that contains preferences JSON5 files and convert them to JSON files of GPII keys and
// preferences safes suitable for direct loading into CouchDB or PouchDB, which comply with the new GPII data model:
// https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences in the target directory
// Usage: node scripts/convertPrefs.js {input_path} {target_path}
//
// A sample command that runs this script in the universal root directory:
// node scripts/convertPrefs.js testData/preferences/ build/dbData/

"use strict";

var fs = require("fs"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    JSON5 = require("json5"),
    fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./shared/prefsSetsDbUtils.js");
var inputDir = process.argv[2];
var targetDir = process.argv[3];

var prefsSafes = [];
var gpiiKeys = [];

var filenames = fs.readdirSync(inputDir);

console.log("Converting preferences data in the source directory " + inputDir + " to the target directory " + targetDir + " ...");

// Read and loop thru json5 files in the input directory
rimraf(targetDir, function () {
    mkdirp(targetDir, function () {
        filenames.forEach(function (filename) {
            if (filename.endsWith(".json5")) {
                var gpiiKey = filename.substr(0, filename.length - 6);
                var preferences = fs.readFileSync(inputDir + filename, "utf-8");
                var prefsSetData = gpii.prefsSetsDbUtils.generatePrefsSet(gpiiKey, JSON5.parse(preferences));
                gpiiKeys.push(prefsSetData.key);
                prefsSafes.push(prefsSetData.prefsSafe);

            }
        });

        // Write the target files
        var prefsSafesFile = targetDir + "prefsSafes.json";
        console.log("prefsSafesFile: " + prefsSafesFile);
        fs.writeFileSync(prefsSafesFile, JSON.stringify(prefsSafes, null, 4));

        var gpiiKeysFile = targetDir + "gpiiKeys.json";
        fs.writeFileSync(gpiiKeysFile, JSON.stringify(gpiiKeys, null, 4));

        console.log("Finished converting preferences data in the source directory " + inputDir + " to the target directory " + targetDir);
    });
});
