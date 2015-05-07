# Online Banking Demonstrator (OLB)

## Details

* __Name__: Online Banking Demonstrator (OLB)
* __Id__: eu.gpii.olb
* __Platform__: Web
* __Contact__: Christophe Strobbe <strobbe@hdm-stuttgart.de>

## Description
The __[Online Banking Demonstrator](http://gpii.eu/olb/)__ is a web-based application built to demonstrate 
auto-personalisation from preference sets across multiple levels:
 * the application itself,
 * the browser (through browser extensions such as Cloud4Chrome),
 * assistive technologies (if any are needed),
 * the platform (typically a desktop operating system).
The Online Banking Demonstrator uses an adapted version of 
[Fluid UI Options](http://wiki.fluidproject.org/display/Infusion14/UI+Options)
with added support for sign language videos and pictograms.
It will be available in four languages: English, German, Spanish and Greek.
The Online Banking Demonstrator will be released under the Apache License, Version 2.0.

## Integration
The Online Banking Demonstrator is fully supported by the GPII personalisation framework
in the sense that all settings avaiable through the UIOptions panel are mapped to application-specific terms.

Information about value ranges and some mappings to common terms can be found [in the spreadsheet "SP3 Settings for 2nd pilots"](https://docs.google.com/spreadsheet/ccc?key=0AppduB_JZh5EdDRYT1pmOTc5eUpNbkpMckhacUVxWXc&usp=drive_web#gid=31).
(Find the tabe "eu.gpii.olb".)
Note, however, that some of the application-specific terms for the OLB cannot yet be mapped to common terms, since the corresponding common terms still need to be defined.

These acceptance tests will be expanded when all application-specific terms can be mapped to common terms. 

## Testing
Manual testing can be of two kinds:
 * On a platform without GPII: Log into the OLB and activate a preference set. Then open the UIOptions panel and change some settings. 
 Then check that the modified settings have been saved to the preference set on the Preferences Server.
 * On a platform where GPII is running: Log in a token at the OS level (through USB, NFC, RFID, ...). 
 After the platform has adapted itself to the preferences corresponding to the token, open a browser, go to the OLB and log in there.
 Then check that the adaptations at the level of the web app do not conflict with or cancel out the adaptations at the other levels.

### olb_Carla

Using this NP set in the OLB should have the following effects:

* text size doubles,.
* line spacing doubles,
* links are emphasised,
* inputs (buttons, drop-down menus, text fields, ...) are larger,
* contrast changes to white on black.

### olb_KimCallahan

Using this NP set in the OLB should have the following effects:

* American sign language videos become available (check the icons next to form fields etc.),
* the sign language videos use avatars,
* the text style changes to Verdana (font face).

### olb_Lara

Using this NP set in the OLB should have the following effects:

* German sign language videos become available (check the icons next to form fields etc.),
* the sign language videos show a human sign language interpreter,
* the interface language changes from English to German. 

### [olb_QinKesheng](https://zh.wikipedia.org/wiki/%E6%AC%BD%E5%8F%AF%E8%81%96)

Using this NP set in the OLB should have the following effects:

* 'International Sign' sign language videoes become available (since the OLB does not support Chinese Sign Language or csl),
* the sign language videos use avatars,
* the interface language does not change since Chinese (zho) is not supported.

