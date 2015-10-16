# GNOME Orca

## Details

* __Name__: GNOME Orca
* __Id__: org.gnome.orca
* __Platform__: GNU/Linux
* __Contact__: Javier Hernández <jhernandez@emergya.com>

## Description
__GNOME Orca__ is the default screen reader of the most popular GNU/Linux desktops.
Orca is free software and is developed under the umbrella of the GNOME project.
For that reason, __Orca__ is part of the GNOME Desktop, so it can be found in every version of the GNOME Desktop.

You'll find more information at:

  * [Orca at GNOME's wiki](https://wiki.gnome.org/Projects/Orca)
  * [Orca's user documentation](https://help.gnome.org/users/orca/stable/)
  * [GNOME's universal access user documentation](https://help.gnome.org/users/gnome-help/stable/a11y.html.en)
  * [Source code at git.gnome.org](https://git.gnome.org/browse/orca)

## Integration
The Orca screen reader is fully supported by the GPII personalization framework.
Why "fully supported"? The GPII can deal with almost all of the Orca's settings by using its own [settings handler](https://github.com/GPII/linux/tree/master/gpii/node_modules/orca).
The GPII launches Orca by using the GNOME's configuration system (gsettings).

To ensure that the solution is well integrated, in the linux repo, there are Acceptance Tests (_tests/acceptanceTests/AcceptanceTests_orca.js_), and also, the GPII includes its own tests for Orca at settings handler-level (_gpii/node_modules/orca/test/orcaSettingsHandlerTests.js_) to ensure that Orca's user-settings.conf file can be updated properly.

Information about value ranges and mappings to common terms can be found [here](https://docs.google.com/spreadsheet/ccc?key=0AppduB_JZh5EdDRYT1pmOTc5eUpNbkpMckhacUVxWXc&usp=sharing) under _LinuxGNOME_ sheet.

## Testing
When using a NP set that makes use of a screen reader, Orca should be launched and configured properly by taking into account the settings included in that NP set.

### screenreader_orca

By using this NP set (located at universal's _testData/preferences/acceptanceTests/screenreader_orca.json_), this is the expected behaviour.

* When logging in, Orca should be started automatically and you should listen to the screen reader.

* A new profile should be added to Orca's user-settings.conf file. It should be called as the NP set (_screenreader_orca_), and it should be set as the default used profile.

<pre>
"startingProfile": [
    "screenreader_orca",
    "screenreader_orca"
]
</pre>

* The settings such as the speech rate or the output language should be configured accordingly inside the newly created profile _screenreader_orca_. In this particular case, it should contain:

<pre>
"voices.default.rate": 100
</pre>
__AND__
<pre>
"voices.default.family": {
    "locale": "en",
    "name": "en-westindies"
}
</pre>

* When logging out, Orca should be stopped and default settings will be restored to its original values.

