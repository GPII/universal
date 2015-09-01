/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.chromeSST");



gpii.tests.windows.chromeSST = [
    {
        name: "Acceptance test for SST translate service in Chrome",
        userToken: "chrome_sst_translate",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "serviceName": "Translatewebpage",
							"serviceInput": {
								"targetLanguage": "fr"                        
							}
                        },
                        "options": {
                            "path": "com.certh.service-synthesis"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for SST font converter service in Chrome",
        userToken: "chrome_sst_fontconverter",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "serviceName": "FontConverter",
							"serviceInput": {
								"targetFontSize": "16",
								"inputUrl": "",
								"targetFontFamily": "Arial",
								"targetBackground": "yellow",
								"targetColor": "red"
							}
                        },
                        "options": {
                            "path": "com.certh.service-synthesis"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for SST CallWebAnywhere service in Chrome",
        userToken: "chrome_sst_callwebanywhere",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "serviceName": "CallWebAnywhere",
							"serviceInput": {
								"voiceLanguage": "fr",
								"inputUrl": ""                        
							}
                        },
                        "options": {
                            "path": "com.certh.service-synthesis"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for combined service in Chrome",
        userToken: "chrome_sst_combined",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "serviceName": "callCombinedServices",
							"serviceInput": {
								"input": [
									{
										"serviceName": "Translatewebpage",
										"serviceInput": {
											"inputUrl": "",
											"targetLanguage": "fr"
										}
									},
									{
										"serviceName": "CallWebAnywhere"
									}
								],
								"mappedVariables": [
									{
										"fromServiceName": "Translatewebpage",
										"fromVariableName": "finalUrl",
										"toServiceName": "CallWebAnywhere",
										"toVariableName": "inputUrl"
									},
									{
										"fromServiceName": "Translatewebpage",
										"fromVariableName": "targetLanguageCode",
										"toServiceName": "CallWebAnywhere",
										"toVariableName": "voiceLanguage"
									}
								]
							}
                        },
                        "options": {
                            "path": "com.certh.service-synthesis"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.chromeSST",
    configName: "windows-chromesst-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
