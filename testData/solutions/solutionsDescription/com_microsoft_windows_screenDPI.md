# Windows Screen Scaling

## Details

* __Name__: Windows Screen Scaling
* __Id__: com.microsoft.windows.screenDPI
* __Platform__: Windows 10
* __Contact__: Steve Grundell <ste@grundell.co.uk>

## Description

This solution provides the ability to change the DPI setting of the primary display. The DPI (dots per inch) provides a way of taking pixel size and viewing distance into account, but it also provides a way of changing the size of things on the display without magnification or altering the resolution. In Windows, this setting described as "Change the size of text, apps, and other items".

The setting values are a percentage of 96 dpi (dots per inch). 100% is the default scale for the majority of screens, and the maximum depends on the current resolution, up to 500% (for example, 1024x768 supports up to 125%). Setting a value beyond what the current resolution supports will cause the effective DPI to be capped at that maximum value.

See also:

* [Writing DPI-Aware Desktop and Win32 Applications](https://msdn.microsoft.com/library/dn469266)
* [GPII-2226](https://issues.gpii.net/browse/GPII-2226)
* Initial research: [GPII-1716](https://issues.gpii.net/browse/GPII-1716#comment-21615)

## Integration

Currently, only Windows 10 is supported. Windows 8/8.1 will be supported later, and Windows 7 would a logout/in so there are no current plans to support it.

Not every application is "DPI-aware", and do not react to the DPI changing. For such applications, the content of the window will be scaled automatically until restarted.


## Testing

```JSON
"http://registry.gpii.net/applications/com.microsoft.windows.screenDPI": {
    "screen-dpi": 1.25
}
```

* A resolution of at least 1024x768 is required, in order to support values over 100%.
* Windows only handles values in steps of 25% (or 50% for when over 250%); a value of 1.7 will be rounded to 175%.
* The displayed DPI will always be capped at the maximum supported by the current resolution.

## Limitations

* There appear to be no documented APIs for changing the DPI, so this implementation may break in future updates to Windows.
* Only the primary display is affected.
* The DPI setting should be a setting that's specific to the physical display, yet this same value could be applied on different types of displays.
