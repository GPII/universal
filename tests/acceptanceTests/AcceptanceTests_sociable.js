/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require,process*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("./AcceptanceTests_include", require);

var testDefs = [
    {
        name: "Testing sociable_sr using Flat matchmaker",
        token: "sociable_sr",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "data": [
                    {
                        "settings": {
                            "screenReaderTTSEnabled.value": "true"
                        },
                        "options": {
                            
                            "filename": "C:\\Sociable\\Configuration.xml",
							"encoding": "utf-8",
							"xml-tag": "<?xml version=\"1.0\"?>"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Cloud4All.exe\" | find /I \"Cloud4All.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing sociable_hc using Flat matchmaker",
        token: "sociable_hc",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "data": [
                    {
                        "settings": {
                            "highContrastEnabled.value": "true"
                        },
                        "options": {
                            "filename": "C:\\Sociable\\Configuration.xml",
							"encoding": "utf-8",
							"xml-tag": "<?xml version=\"1.0\"?>"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Cloud4All.exe\" | find /I \"Cloud4All.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing sociable_fs using Flat matchmaker",
        token: "sociable_fs",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "data": [
                    {
                        "settings": {
                            "fontSize.value": "large"
                            
                        },
                        "options": {
                            "filename": "C:\\Sociable\\Configuration.xml",
							"encoding": "utf-8",
							"xml-tag": "<?xml version=\"1.0\"?>"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Cloud4All.exe\" | find /I \"Cloud4All.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

gpii.acceptanceTesting.windows.runTests("sociable_config", testDefs);