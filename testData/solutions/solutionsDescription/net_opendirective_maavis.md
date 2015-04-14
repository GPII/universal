# OpenDirective Maavis

## Details

* __Name__: Maavis
* __Id__: net.opendirective.maavis
* __Platform__: Win32
* __Contact__: Steve Lee <steve@opendirectie.com>

## Description
__Maavis__ Maavis provides greatly simplified access to media, communications, web and programs on a computer. It is primarily designed for people with low digital literacy,cognitive disabilities or who are unable to use them without adaptation. It provides a framework for creaing personalised solutions and was designed and developed as part of research into use of technology by people living with dementia.

You'll find more information at:

  * [Maavis website](http://maavis.fullmeasure.co.uk/)
  * [Source code at github.com](https://github.com/OpenDirective/maavis)

## Integration
Several Maavis configuration options are available via the GPII personalization framework.
It does this by using the generic json settings handler to change Maavis' settings. 
The most useful settings are the high contrast theme and speech support which use common settings.

Other solution-specific settings are also possible. These include
* "playStartSound"
* "showLabels"
* "showImages"
* "userType"
* "splashTime",
* "scanRate",
* "scanMode":
* "selectionsSetSize"
See the Maavis documentation for full details

## Testing
When using a NP set that makes use of Maavis, it should be launched and configured properly by taking into account the settings included in that NP set.

### High contrast

NP set: [preferences/acceptanceTests/maavis_highcontrast.json](https://github.com/GPII/universal/blob/GPII-881/testData/preferences/acceptanceTests/maavis_highcontrast.json)

* When logging in, Maavis should be started automatically and you should see the yellow on black theme.
* When logging out, Maavis should be stopped and default settings will be restored.

### Self voicing

NP set: [preferences/acceptanceTests/maavis_selfvoicing.json](https://github.com/GPII/universal/blob/GPII-881/testData/preferences/acceptanceTests/maavis_selfvoicing.json)

* When logging in, Maavis should be started automatically and you should see the yellow on black theme.
* When logging out, Maavis should be stopped and default settings will be restored.
