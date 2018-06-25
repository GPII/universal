# Windows Display Language

## Details

* __Name__: Windows Display Language
* __Id__: com.microsoft.windows.language
* __Platform__: Windows
* __Contact__: Steve Grundell <sgrundell@raisingthefloor.org>

## Description

Sets the display language of the operating system, by changing some values in the Windows Registry. The new setting
is only applied to new processes; only Windows Explorer is restarted by this solution.

The language identifier is specified in `http://registry.gpii.net/common/language`.


## Testing

The following test users make use of the language setting:

* Tom: English (US), en-US
* Catalina: Spanish (Spain), es-ES
* Telegu: Telegu (India), te-IN.

## Limitations

* The appropriate language pack must already be installed.
* If the language "changes" to the same value as the current, explorer is still restarted.
