# eCmobile and eCtouch

## Details

* __Name__: eCmobile/eCtouch
* __Id__: se.omnitor.ecmobile
* __Platform__: Android (4.2+)
* __Contact__ (developer): Christoffer Friberg (christoffer.friberg@omnitor.se)
* __Contact__ (project lead): Christer Ulfsparre (christer.ulfsparre@omnitor.se)

## Description
__eCmobile__ and __eCtouch__ are two Android applications for real-time communication using simultaneous video, audio and text. They use [SIP (Session Initiation Protocol)](https://www.ietf.org/rfc/rfc3261.txt) to negotiate and control calls and are fully compatible with other standards compliant SIP clients.
Both applications are closed-source and proprietary. They are mostly sold via various  municipal or county aid offices to aid users either in the workplace or in their private life.
The two applications are very similar in operation and implementation, which is why they're treated as a single solution in the GPII. The difference between the two lies in the targeted range of devices. eCtouch is tailored towards tablet devices (7 inches and larger), whereas eCmobile is meant for use in smartphones. Currently we primarily use the Samsung Galaxy Note 10.1 (2014 edition) tablet and the Samsung Galaxy S5 smartphone when selling pre-installed units to end-users.

You'll find more information at [our website](http://www.omnitor.com), primarily in Swedish.
Installation instructions can be found in [this](https://docs.google.com/document/d/1McMtIfCVSSHe9acMLgIMpqFr-psYBuYRzePzobafIW4) document.

## Integration
eCtouch and eCmobile are partially integrated with the GPII, limited primarily by the Android operating system. On a non-rooted device, a regular application (i.e. the GPII app) may not be able to shut down another application (eCtouch/eCmobile). This means that the GPII cannot fully control the life cycle of the applications, so upon logging out from the GPII, although the home screen is shown, the application can still be running in background.


Information about value ranges and mappings to common terms can be found [here](https://docs.google.com/spreadsheet/ccc?key=0AppduB_JZh5EdDRYT1pmOTc5eUpNbkpMckhacUVxWXc&usp=sharing#gid=27). If the link doesn't take you to the "eCtouch/eCmobile" page, select it in the bottom row.

## Testing
When using a N&P set that makes use of a the font size or high contrast theme settings, eCmobile or eCtouch should be launched and configured properly by taking into account the settings included in that N&P set. There are two example preference sets included in the universal repository's test data, see below.

The applications read their settings from an XML file on the device's internal storage (usually the /sdcard/ directory). The file is called output.xml and is only read when the applications start. Click [here](https://docs.google.com/document/d/1_58l11wld2SPIH0II1BLBPUU8LjLhj5m_64xIddb_ZM) for more information about this file and how it's used.

### omnitor1
[link](https://github.com/GPII/universal/blob/master/testData/preferences/omnitor1.json)

This preference set uses the default settings, same as if the app was launched without the GPII.

The XML file will contain:

    <?xml version='1.0' encoding='utf-8' standalone='yes' ?>
    <map>
      <string name='fontsize'>24</string>
      <string name='iconsize'>70</string>
      <string name='theme'>none</string>
    </map>

### omnitor2
[link](https://github.com/GPII/universal/blob/master/testData/preferences/omnitor2.json)

This preference set uses the yellow-black high contrast theme and the maximum possible font size. Note that we apply a scaling factor of 2 to the font size setting, and that the high contrast setting is transformed to fit our format.

The XML file will contain:

    <?xml version='1.0' encoding='utf-8' standalone='yes' ?>
    <map>
      <string name='fontsize'>50</string>
      <string name='iconsize'>70</string>
      <string name='theme'>yellow-black</string>
    </map>
