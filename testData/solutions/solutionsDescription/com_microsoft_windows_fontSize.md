# Windows Screen Scaling

## Details

* __Name__: Windows Font Size
* __Id__: com.microsoft.windows.fontSize
* __Platform__: Windows
* __Contact__: Steve Grundell <sgrundell@raisingthefloor.org>

## Description

This solution enables the resizing of the font in certain Windows components, without effecting the resolution or DPI setting.

The text of the following elements are re-sized, where the native component is used:
* Window title bar.
* Menus.
* Status bars.
* Icon labels.
* Tooltips.
* Message boxes.

See also:

* [GPII-1716](https://issues.gpii.net/browse/GPII-1716)
* [NONCLIENTMETRICS structure](https://msdn.microsoft.com/library/ff729175)
* [screenDPI solution](com_microsoft_windows_screenDPI.md), to resize all fonts.

## Integration

SystemParametersInfo is called, with SPI_SETNONCLIENTMETRICS. The unit is the approximate height of the font in pixels.

This solution also sets the pixel height of each display element to the its current value. This is because increasing
the font size causes the heights to grow, but decreasing the font (when restoring) leaves the enlarged sizes.

## Testing

The user [gert](../../preferences/gert.json) can be used to test this solution. The font-size should increase.

## Limitations

This doesn't set the size of all text, only those listed above. Some applications may ignore this setting.
