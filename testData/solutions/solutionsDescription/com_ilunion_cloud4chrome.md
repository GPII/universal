# Cloud4chrome

## Details

* __Name__: cloud4chrome
* __Id__: com.ilunion.cloud4chrome
* __Platform__: Tested on MS Windows and GNU/Linux (it should also work on Mac OSX)
* __Contact__: José Antonio Gutiérrez Dueñas <jagutierrez@consultoria.ilunion.com>

## Important Note
As described in the JIRA [GPII-2109](https://issues.gpii.net/browse/GPII-2109), due to the limitation of the current matchmaker and the state of the this solution (which is outdated compared to the requirements of APCP), this solution has been set to report as never being installed in the `isInstalled` directive.

Once [GPII-1998](https://issues.gpii.net/browse/GPII-1998) has been implemented and this solution (addon) has been updated, the `isInstalled` directive should be updated to properly report when this is installed.

## Description
The cloud4chrome extension for Google Chrome is a component installable in the web browser. This extension establishes a connection with GPII to get the active preferences. These preferences are used, by the extension, to adapt the web browser content, I mean, the web site interfaces.
The cloud4chrome extension can work autonomously, with cloud-based flowManager, or by local flowManager.

Useful links:

  * [Chrome extensions developer documentation](https://developer.chrome.com/extensions)
  * [Source code at github.com](https://github.com/GutiX/chrome4cloud)

## Integration
To install the chrome extension, make the following steps.

  * Download the zip file from https://github.com/GutiX/chrome4cloud/archive/master.zip
  * Extract the zip file in a folder of your choice
  * In the Chrome browser, click on the ‘settings’ icon in the upper right corner.
  * Once in the ‘settings’ page, go to ‘extensions’ in the left sidebar menu
  * Make sure the ‘Developer mode’ checkbox is checked
  * Then, click on ‘Load unpacked extension...’
  ** Select the folder where you unzipped the files you downloaded in step 2


## Testing
When using a NP set that makes use of the cloud4chrome extension, the Chrome browser should be launched and configured properly by taking into account the settings included in that NP set.
Two user profiles with different sets of Needs & Preferences have been provided in order to properly perform the tests.
These user profiles have as follows:

### Chrome1
NP set located at universal's testData/preferences/chrome1.json

  * When logging in, Chrome browser should be started automatically and you should listen the screen reader. For this to work, is needed to have installed the Chrome vox extension in the Chrome browser.
  * When logging out, default settings will be restored.

### Chrome2
NP set located at universal's testData/preferences/chrome2.json

  * When logging in, Chrome browser should be started automatically and you should see the white on black theme and magnification.
  * When logging out, default settings will be restored.
