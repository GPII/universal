# Service-synthesis

## Details

* __Name__: Service-synthesis
* __Id__: com.certh.service-synthesis
* __Platform__: Tested on MS Windows and GNU/Linux (it should also work on Mac OSX)
* __Contact__: José Antonio Gutiérrez Dueñas <jagutierrez@consultoria.ilunion.com>

## Description
The Chrome extension for Google Chrome is a component installable in the web browser. This extension establishes a connection with GPII to get the active preferences. These preferences contain configuration parameters used, by the extension, to request to the synthesis service the adaptation of a web page. The extension sends the configuration parameters and the website URL to synthesis service. The synthesis service creates a new version of the web page using the URL and the configuration parameters received. Synthesis service returns to the chrome extension a new URL with the new version of the web page.
The Chrome extension can work autonomously, with cloud-based flowManager, or by local flowManager.

Useful links:

  * [Chrome extensions developer](https://developer.chrome.com/extensions)
  * [Source code at github.com](https://github.com/GutiX/SSTChrome4cloud.git)

## Integration
To install the chrome extension, make the following steps.

  * Download the zip file from https://github.com/GutiX/SSTChrome4cloud/archive/master.zip 
  * Extract the zip file in a folder of your choice
  * In the Chrome browser, click on the ‘settings’ icon in the upper right corner.
  * Once in the ‘settings’ page, go to ‘extensions’ in the left sidebar menu
  * Make sure the ‘Developer mode’ checkbox is checked
  * Then, click on ‘Load unpacked extension...’
  ** Select the folder where you unzipped the files you downloaded in step 2


## Testing
When using a NP set that makes use of the service-synthesis extension, the Chrome browser should be launched and configured properly by taking into account the settings included in that NP set.
Four user profiles with different sets of Needs & Preferences have been provided in order to properly perform the tests.
These user profiles have as follows:

### sstCall
NP set located at universal's testData/preferences/sstCall.json

  * When logging in, if Chrome browser is open should recharge the all tabs to adapt the websites with WebAnywhere service. If Chrome browser is closed will get the preferences and will adapt the websites when this open.
  * When logging out, default settings will be restored.

### sstFont
NP set located at universal's testData/preferences/sstFont.json

  * When logging in, if Chrome browser is open should recharge the all tabs to adapt the websites with the Font Converter service. If Chrome browser is closed will get the preferences and will adapt the websites when this open.
  * When logging out, default settings will be restored.

### sstTranslate
NP set located at universal's testData/preferences/sstTranslate.json

  * When logging in, if Chrome browser is open should recharge the all tabs to adapt the websites with the Translate Web Page service. If Chrome browser is closed will get the preferences and will adapt the websites when this open.
  * When logging out, default settings will be restored.

### sstCombined
NP set located at universal's testData/preferences/sstCombined.json

  * When logging in, if Chrome browser is open should recharge the all tabs to adapt the websites with the combine service, using Translate web page and WebAnywhere services. If Chrome browser is closed will get the preferences and will adapt the websites when this open.
  * When logging out, default settings will be restored.
