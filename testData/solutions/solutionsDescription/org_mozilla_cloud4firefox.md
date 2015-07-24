# Cloud4Firefox

## Details

* __Name__: cloud4Firefox
* __Id__: org.mozilla.cloud4firefox
* __Platform__: Web
* __Contact__: José Antonio Gutiérrez Dueñas <jagutierrez@consultoria.ilunion.com>

## Description
The Firefox extension for Firefox is a component installable in the web browser. This extension establishes a connection with GPII to get the active preferences. These preferences are used, by the extension, to adapt the web browser content, I mean, the web site interfaces.

Useful links:

  * [Firefox extensions developer](https://developer.mozilla.org/en-US/Add-ons)
  * [Source code at github.com](https://github.com/GutiX/firefox4cloud)

## Integration
To install the Firefox extension, make the following steps.

  * Download the zip file from https://github.com/GutiX/firefox4cloud/archive/master.zip 
  * Extract the zip file in a folder of your choice. In the project root folder should be a xpi file called "cloud4firefox.xpi".
  * In the extension section of the Firefox browser (Menu->Add-ons->extensions), click on the ‘settings’ icon in the upper right corner and select the option "Install add-on from File...".
  * Select the "cloud4firefox.xpi" file that you unzipped in step 2


## Testing
When using a NP set that makes use of the cloud4firefox extension, the Firefox browser should be launched and configured properly by taking into account the settings included in that NP set.
One user profiles with a set of Needs & Preferences have been provided in order to properly perform the tests.
These user profiles have as follows:

### Firefox
NP set located at universal's testData/preferences/firefox1.json

  * When logging in, Firefox browser should be started automatically and you should see the magnification theme.
  * When logging out, default settings will be restored.
