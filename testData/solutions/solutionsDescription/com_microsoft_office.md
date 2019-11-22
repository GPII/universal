# Microsoft Office

## Details

* __Name__: Microsoft Office
* __Id__: com.microsoft.office
* __Platform__: Windows
* __Contact__: Steve Grundell <sgrundell@raisingthefloor.org>

## Description

This solution provides the ability to use customised layout of the Ribbon, Quick Access Toolbar, and Status bar in the
following Microsoft Office 2016 Applictions:

* Word
* Excel
* PowerPoint
* OneNote
* Access
* Outlook

The settings are provided in `http://registry.gpii.net/applications/com.microsoft.office`, which contains the following
items:

* `tabletMode` - Larger buttons, applies to all Office applications.
* `word-ribbon` - The ribbon and quick-access toolbar customisations (XML)
* `word-status` - The statusbar values to display.
* `excel-ribbon`
* `excel-status`
* `onenote-ribbon`
* `powerpoint-ribbon`
* `powerpoint-status`
* `publisher-ribbon`
* `publisher-status`
* `access-ribbon`
* `access-status`
* `outlook-ribbon`
* `outlook-status`

The `ribbon` values are the JSON representations of the XML based `.officeUI` files, which found by Office in
`%LOCALAPPDATA%\Microsoft\Office`. This contains customisations for the ribbon and quick-access toolbar.

To manually create a preference set, either take the relevent `.officeUI` file,
or export the customised interface (in *Options* -> *Customise Ribbon*) to a `.exportedUI` file, and convert the XML
to JSON via the `xml-mapping` library. eg:

```javascript
console.log(JSON.stringify(require("xml-mapping").tojson(require("fs").readFileSync(0, "utf8")), null, 4));
```

The status bar customisations are each a collection of boolean values, indicating the visibility of a field in the UI.

## Testing

The user `otis` performs various customisations of each Office application.

## Limitations

* Unable to make running instances of the applications reload the new settings. If more than one window is open, then
the new settings *sometime* reload when switching between the window.
* Only tested with Office 2016.
  * The ribbon *may* work in other versions.
  * The status bar will *not* work in other versions (the registry location contains the version number)
