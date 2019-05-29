/*
GPII Integration and Acceptance Testing

Copyright 2016 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    child_process = require("child_process");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.readwrite");

fluid.defaults("gpii.tests.windows.readwrite.findProcess", {
    gradeNames: "fluid.function",
    argumentMap: {
        command: 0,
        time: 1
    }
});

/**
 * Test function used to introduce a delay in startup/shutdown cycles.
 *
 * @param {String} commandName The name of the process to be searched for.
 * @param {Number} time The delay to wait before searching for the process.
 * @return {Boolean} True if the process have been found, false otherwise.
 */
gpii.tests.windows.readwrite.findProcess = function (commandName, time) {
    child_process.execSync("waitfor ghostEvent /t " + time + " 2>NUL || type nul>nul");

    return gpii.processReporter.find(commandName);
};

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.readwrite.flexibleHandlerEntry = function (running) {
    return {
        "com.texthelp.readWriteGold": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                retryOptions: {
                    rewriteEvery: 0,
                    numRetries: 40,
                    retryInterval: 20000
                },
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{environment}.SystemDrive}\\Program Files (x86)\\Texthelp\\Read And Write 12\\ReadAndWrite.exe\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "ReadAndWrite.exe",
                        "options": {
                            "message": "WM_CLOSE"
                        }
                    }
                ],
                "getState": [
                    {
                        "type": "gpii.tests.windows.readwrite.findProcess",
                        "command": "ReadAndWrite.exe",
                        "time": 10
                    }
                ]
            }
        }]
    };
};


gpii.tests.windows.readwrite.testDefs = [
    {
        name: "Testing 'readwritegold_general' - running on login",
        gpiiKey: "readwritegold_general",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.IconSize.$t": "Small",
                            "ApplicationSettings.AppBar.ToolbarIconSet.$t": "Color",
                            "ApplicationSettings.AppBar.ShowText.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarBackColour.$t": "#008080",
                            "ApplicationSettings.AppBar.RunOnStartUp.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing readwritegold_general",
        gpiiKey: "readwritegold_general",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.IconSize.$t": "Small",
                            "ApplicationSettings.AppBar.ToolbarIconSet.$t": "Color",
                            "ApplicationSettings.AppBar.ShowText.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarBackColour.$t": "#008080",
                            "ApplicationSettings.AppBar.RunOnStartUp.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_check_dict_high' - running on login",
        gpiiKey: "readwritegold_check_dict_high",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Check It
                            "ApplicationSettings.Spelling.OrderByContext.$t": "false",
                            "ApplicationSettings.Spelling.SpeakSpellingOnHover.$t": "false",
                            "ApplicationSettings.Spelling.ShowCheckIt.$t": "true",
                            "ApplicationSettings.Spelling.RightClickMSWord.$t": "true",
                            // Dictionary
                            "ApplicationSettings.Dictionary.WebDictionary.$t": "Bing",
                            "ApplicationSettings.Dictionary.PopupDictionary.$t": "true",
                            "ApplicationSettings.Dictionary.ToggleImages.$t": "true",
                            // Highlights
                            "ApplicationSettings.StudySkills.CollectYellowHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectBlueHighlight.$t": "true",
                            "ApplicationSettings.StudySkills.CollectGreenHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectPinkHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectOrder.$t": "Position",
                            "ApplicationSettings.StudySkills.ColorSeparator.$t": "Page",
                            "ApplicationSettings.StudySkills.HighlightSeparator.$t": "Tab",
                            "ApplicationSettings.StudySkills.MultiDocHighlighting.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing readwritegold_check_dict_high",
        gpiiKey: "readwritegold_check_dict_high",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Check It
                            "ApplicationSettings.Spelling.OrderByContext.$t": "false",
                            "ApplicationSettings.Spelling.SpeakSpellingOnHover.$t": "false",
                            "ApplicationSettings.Spelling.ShowCheckIt.$t": "true",
                            "ApplicationSettings.Spelling.RightClickMSWord.$t": "true",
                            // Dictionary
                            "ApplicationSettings.Dictionary.WebDictionary.$t": "Bing",
                            "ApplicationSettings.Dictionary.PopupDictionary.$t": "true",
                            "ApplicationSettings.Dictionary.ToggleImages.$t": "true",
                            // Highlights
                            "ApplicationSettings.StudySkills.CollectYellowHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectBlueHighlight.$t": "true",
                            "ApplicationSettings.StudySkills.CollectGreenHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectPinkHighlight.$t": "false",
                            "ApplicationSettings.StudySkills.CollectOrder.$t": "Position",
                            "ApplicationSettings.StudySkills.ColorSeparator.$t": "Page",
                            "ApplicationSettings.StudySkills.HighlightSeparator.$t": "Tab",
                            "ApplicationSettings.StudySkills.MultiDocHighlighting.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_pred_scan_out' - running on login",
        gpiiKey: "readwritegold_pred_scan_out",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Prediction
                            "ApplicationSettings.Prediction.DisplayAlphabetic.$t": "true",
                            "ApplicationSettings.Prediction.FollowCursor.$t": "true",
                            "ApplicationSettings.Prediction.AutoHeightAdjust.$t": "true",
                            "ApplicationSettings.Prediction.winPredictOneWordAhead.$t": "true",
                            "ApplicationSettings.Prediction.InsertSpaceAfterPred.$t": "false",
                            "ApplicationSettings.Prediction.UseSpellingForPredictions.$t": "false",
                            // Prediction Speech
                            "ApplicationSettings.Prediction.SpeakPredictionOnMouseHover.$t": "false",
                            // This two settings are excluyent, need to encode that
                            "ApplicationSettings.Prediction.SpeakOnWordClick.$t": "true",
                            "ApplicationSettings.Prediction.InsertOnWordClick.$t": "false",
                            // Prediction Learning
                            "ApplicationSettings.Prediction.SpellCheckBeforeLearn.$t": "false",
                            "ApplicationSettings.Prediction.AutoLearnAsType.$t": "false",
                            // Scanning
                            "ApplicationSettings.Scanning.dpi.$t": "600",
                            "ApplicationSettings.Scanning.colormode.$t": "GrayScale",
                            "ApplicationSettings.Scanning.HideInterface.$t": "false",
                            // Device Setup (Advanced settigns)
                            "ApplicationSettings.Scanning.Countdown.$t": "true",
                            "ApplicationSettings.Scanning.CountdownInterval.$t": "10",
                            "ApplicationSettings.Scanning.ADF.$t": "true",
                            "ApplicationSettings.Scanning.Duplex.$t": "true",
                            // Save Options
                            "ApplicationSettings.Scanning.AutoSave.$t": "true",
                            "ApplicationSettings.Scanning.DefaultFilePath.$t": "C:\\Users\\vagrant\\Download",
                            "ApplicationSettings.Scanning.DefaultFileName.$t": "ScannedDoc",
                            // PDF Output
                            "ApplicationSettings.Scanning.PdfTextOnly.$t": "true",
                            "ApplicationSettings.Scanning.MSWordRetainFormat.$t": "true",
                            "ApplicationSettings.Scanning.CoverFirstPage.$t": "false",
                            // Output Types
                            "ApplicationSettings.Scanning.EnableEpub.$t": "true",
                            "ApplicationSettings.Scanning.EnableWeb.$t": "true"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing readwritegold_pred_scan_out",
        gpiiKey: "readwritegold_pred_scan_out",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Prediction
                            "ApplicationSettings.Prediction.DisplayAlphabetic.$t": "true",
                            "ApplicationSettings.Prediction.FollowCursor.$t": "true",
                            "ApplicationSettings.Prediction.AutoHeightAdjust.$t": "true",
                            "ApplicationSettings.Prediction.winPredictOneWordAhead.$t": "true",
                            "ApplicationSettings.Prediction.InsertSpaceAfterPred.$t": "false",
                            "ApplicationSettings.Prediction.UseSpellingForPredictions.$t": "false",
                            // Prediction Speech
                            "ApplicationSettings.Prediction.SpeakPredictionOnMouseHover.$t": "false",
                            // This two settings are excluyent, need to encode that
                            "ApplicationSettings.Prediction.SpeakOnWordClick.$t": "true",
                            "ApplicationSettings.Prediction.InsertOnWordClick.$t": "false",
                            // Prediction Learning
                            "ApplicationSettings.Prediction.SpellCheckBeforeLearn.$t": "false",
                            "ApplicationSettings.Prediction.AutoLearnAsType.$t": "false",
                            // Scanning
                            "ApplicationSettings.Scanning.dpi.$t": "600",
                            "ApplicationSettings.Scanning.colormode.$t": "GrayScale",
                            "ApplicationSettings.Scanning.HideInterface.$t": "false",
                            // Device Setup (Advanced settigns)
                            "ApplicationSettings.Scanning.Countdown.$t": "true",
                            "ApplicationSettings.Scanning.CountdownInterval.$t": "10",
                            "ApplicationSettings.Scanning.ADF.$t": "true",
                            "ApplicationSettings.Scanning.Duplex.$t": "true",
                            // Save Options
                            "ApplicationSettings.Scanning.AutoSave.$t": "true",
                            "ApplicationSettings.Scanning.DefaultFilePath.$t": "C:\\Users\\vagrant\\Download",
                            "ApplicationSettings.Scanning.DefaultFileName.$t": "ScannedDoc",
                            // PDF Output
                            "ApplicationSettings.Scanning.PdfTextOnly.$t": "true",
                            "ApplicationSettings.Scanning.MSWordRetainFormat.$t": "true",
                            "ApplicationSettings.Scanning.CoverFirstPage.$t": "false",
                            // Output Types
                            "ApplicationSettings.Scanning.EnableEpub.$t": "true",
                            "ApplicationSettings.Scanning.EnableWeb.$t": "true"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_screen_mask_shot' - running on login",
        gpiiKey: "readwritegold_screen_mask_shot",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Screen Masking
                            "ApplicationSettings.ScreenMasking.ScreenMask.$t": "UnderlineTypingLine",
                            // Screen Masking -> Tint whole screen subsettings
                            "ApplicationSettings.ScreenMasking.TintScreenColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.TintScreenOpacity.$t": "0.5",
                            "ApplicationSettings.ScreenMasking.ReadingLight.$t": "true",
                            "ApplicationSettings.ScreenMasking.ReadingLightColour.$t": "#00FFFFFF",
                            "ApplicationSettings.ScreenMasking.ReadingLightOpacity.$t": "0.5",
                            "ApplicationSettings.ScreenMasking.ReadingLightHeight.$t": "150",
                            // Screen Masking -> Underline typing line
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineOpacity.$t": "0.3",
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineHeight.$t": "15",
                            // Screen Masking -> Tint typing line
                            "ApplicationSettings.ScreenMasking.TintTypingLineColour.$t": "#FF00FFFF",
                            "ApplicationSettings.ScreenMasking.TintTypingLineOpacity.$t": "0.6",
                            // Screen Masking -> Change page color
                            "ApplicationSettings.ScreenMasking.SystemBackgroundColour.$t": "#a7efce",
                            // Screen Masking -> Underline cursor
                            "ApplicationSettings.ScreenMasking.UnderlineCursorColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.UnderlineCursorOpacity.$t": "0.4",
                            "ApplicationSettings.ScreenMasking.UnderlineCursorHeight.$t": "20",
                            // Screenshot Reader
                            "ApplicationSettings.Screenshot.CaptureBy.$t": "Drawing Freehand",
                            "ApplicationSettings.Screenshot.ScreenshotTo.$t": "Window",
                            "ApplicationSettings.Screenshot.AppendToMsWordDoc.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_screen_mask_shot'",
        gpiiKey: "readwritegold_screen_mask_shot",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Screen Masking
                            "ApplicationSettings.ScreenMasking.ScreenMask.$t": "UnderlineTypingLine",
                            //  Screen Masking -> Tint whole screen subsettings
                            "ApplicationSettings.ScreenMasking.TintScreenColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.TintScreenOpacity.$t": "0.5",
                            "ApplicationSettings.ScreenMasking.ReadingLight.$t": "true",
                            "ApplicationSettings.ScreenMasking.ReadingLightColour.$t": "#00FFFFFF",
                            "ApplicationSettings.ScreenMasking.ReadingLightOpacity.$t": "0.5",
                            "ApplicationSettings.ScreenMasking.ReadingLightHeight.$t": "150",
                            // Screen Masking -> Underline typing line
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineOpacity.$t": "0.3",
                            "ApplicationSettings.ScreenMasking.UnderlineTypingLineHeight.$t": "15",
                            // Screen Masking -> Tint typing line
                            "ApplicationSettings.ScreenMasking.TintTypingLineColour.$t": "#FF00FFFF",
                            "ApplicationSettings.ScreenMasking.TintTypingLineOpacity.$t": "0.6",
                            // Screen Masking -> Change page color
                            "ApplicationSettings.ScreenMasking.SystemBackgroundColour.$t": "#a7efce",
                            // Screen Masking -> Underline cursor
                            "ApplicationSettings.ScreenMasking.UnderlineCursorColour.$t": "#a7efce",
                            "ApplicationSettings.ScreenMasking.UnderlineCursorOpacity.$t": "0.4",
                            "ApplicationSettings.ScreenMasking.UnderlineCursorHeight.$t": "20",
                            // Screenshot Reader
                            "ApplicationSettings.Screenshot.CaptureBy.$t": "Drawing Freehand",
                            "ApplicationSettings.Screenshot.ScreenshotTo.$t": "Window",
                            "ApplicationSettings.Screenshot.AppendToMsWordDoc.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_voice' - running on login",
        gpiiKey: "readwritegold_voice",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Speech
                            "ApplicationSettings.Speech.CurrentVoice.$t": "Mexican Spanish Paulina - Vocalizer",
                            "ApplicationSettings.Speech.VoiceSpeed.$t": "70",
                            "ApplicationSettings.Speech.UseVoiceSpeedHotKey.$t": "false",
                            "ApplicationSettings.Speech.WordPause.$t": "200",
                            "ApplicationSettings.Speech.VoicePitch.$t": "40",
                            // Speech -> Auto Read
                            "ApplicationSettings.Speech.SpeakAsIType.$t": "true",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachLetter.$t": "true",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachWord.$t": "false",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachSentence.$t": "false",
                            // Speech -> Screen reading
                            "ApplicationSettings.Speech.ScreenReadingEnabled.$t": "true",
                            // Speech -> Screen reading -> Items to read
                            // TODO: Setting is stored in an array format in XML, we need to check how
                            // XMLSettingsHandler handles this case.
                            // "ApplicationSettings.Speech.ScreenReadingItems.$t":,
                            // Speech -> Read by
                            "ApplicationSettings.Speech.SelectionType.$t": "0",
                            // Speech -> Continuous reading
                            "ApplicationSettings.Speech.ContinuousReading.$t": "false",
                            // Speech -> Read the web
                            "ApplicationSettings.Speech.ReadTheWeb.$t": "true",
                            // Speech -> Speech highlighting
                            "ApplicationSettings.Speech.HighlightingMethod.$t": "2",
                            // Speech -> Speech highlighting -> Font
                            "ApplicationSettings.Speech.TextReaderOneWordFontName.$t": "Times New Roman",
                            "ApplicationSettings.Speech.optSpeechHighTRFontName.$t": "Times New Roman",
                            // Speech -> Speech highlighting -> Font size
                            "ApplicationSettings.Speech.TextReaderOneWordFontSize.$t": "16",
                            "ApplicationSettings.Speech.optSpeechHighTRFontSize.$t": "16",
                            // Speech -> Speech highlighting -> Highlighting colors
                            "ApplicationSettings.Speech.HighlightingBackColour.$t": "Violet",
                            "ApplicationSettings.Speech.HighlightingForeColour.$t": "Chartreuse"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_voice'",
        gpiiKey: "readwritegold_voice",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Speech
                            "ApplicationSettings.Speech.CurrentVoice.$t": "Mexican Spanish Paulina - Vocalizer",
                            "ApplicationSettings.Speech.VoiceSpeed.$t": "70",
                            "ApplicationSettings.Speech.UseVoiceSpeedHotKey.$t": "false",
                            "ApplicationSettings.Speech.WordPause.$t": "200",
                            "ApplicationSettings.Speech.VoicePitch.$t": "40",
                            // Speech -> Auto Read
                            "ApplicationSettings.Speech.SpeakAsIType.$t": "true",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachLetter.$t": "true",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachWord.$t": "false",
                            // Speech -> Auto Read -> Speak as I type
                            "ApplicationSettings.Speech.SpeakOnEachSentence.$t": "false",
                            // Speech -> Screen reading
                            "ApplicationSettings.Speech.ScreenReadingEnabled.$t": "true",
                            // Speech -> Screen reading -> Items to read
                            // TODO: Setting is stored in an array format in XML, we need to check how
                            // XMLSettingsHandler handles this case.
                            // "ApplicationSettings.Speech.ScreenReadingItems.$t":,
                            // Speech -> Read by
                            "ApplicationSettings.Speech.SelectionType.$t": "0",
                            // Speech -> Continuous reading
                            "ApplicationSettings.Speech.ContinuousReading.$t": "false",
                            // Speech -> Read the web
                            "ApplicationSettings.Speech.ReadTheWeb.$t": "true",
                            // Speech -> Speech highlighting
                            "ApplicationSettings.Speech.HighlightingMethod.$t": "2",
                            // Speech -> Speech highlighting -> Font
                            "ApplicationSettings.Speech.TextReaderOneWordFontName.$t": "Times New Roman",
                            "ApplicationSettings.Speech.optSpeechHighTRFontName.$t": "Times New Roman",
                            // Speech -> Speech highlighting -> Font size
                            "ApplicationSettings.Speech.TextReaderOneWordFontSize.$t": "16",
                            "ApplicationSettings.Speech.optSpeechHighTRFontSize.$t": "16",
                            // Speech -> Speech highlighting -> Highlighting colors
                            "ApplicationSettings.Speech.HighlightingBackColour.$t": "Violet",
                            "ApplicationSettings.Speech.HighlightingForeColour.$t": "Chartreuse"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_trans_voca_voice' - running on login",
        gpiiKey: "readwritegold_trans_voca_voice",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Translation
                            "ApplicationSettings.Translation.FromLanguage.$t": "cs",
                            "ApplicationSettings.Translation.ToLanguage.$t": "da",
                            // Vocabulary List
                            // TODO: Verify with Microsoft word installation
                            "ApplicationSettings.Vocabulary.VocabListWindow.$t": "true",
                            "ApplicationSettings.Vocabulary.VocabListImages.$t": "false",
                            "ApplicationSettings.Vocabulary.VocabListDefinitions.$t": "true",
                            // Voice Note
                            "ApplicationSettings.VoiceNote.InsertInDoc.$t": "true"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing 'readwritegold_trans_voca_voice'",
        gpiiKey: "readwritegold_trans_voca_voice",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            // Translation
                            "ApplicationSettings.Translation.FromLanguage.$t": "cs",
                            "ApplicationSettings.Translation.ToLanguage.$t": "da",
                            // Vocabulary List
                            // TODO: Verify with Microsoft word installation
                            "ApplicationSettings.Vocabulary.VocabListWindow.$t": "true",
                            "ApplicationSettings.Vocabulary.VocabListImages.$t": "false",
                            "ApplicationSettings.Vocabulary.VocabListDefinitions.$t": "true",
                            // Voice Note
                            "ApplicationSettings.VoiceNote.InsertInDoc.$t": "true"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\12\\RWSettings.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    }
];


module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.readwrite.testDefs",
    configName: "gpii.tests.acceptance.windows.readWrite.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
