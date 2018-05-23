# Windows Night Screen

## Details

* __Name__: Windows Night Screen
* __Id__: com.microsoft.windows.nightScreen
* __Platform__: Windows 10
* __Contact__: Steve Grundell <ste@grundell.co.uk>

## Description

This solution enables the activation of the night-light setting, which reduces the blue light emitted from the screen.
This produces warmer colours which make looking at the screen more comfortable at night.


See also:

* [GPII-2717](https://issues.gpii.net/browse/GPII-2717)

## Integration

Only Windows 10 support this feature.


## Testing

The [nyx](../../preferences/nyx.md) user preference set has the following setting:


```JSON
    "http://registry.gpii.net/common/nightScreen": true
```

When activated, blue light from the screen will be reduced, causing white to look yellow.

Some displays (such as a virtual machine) may not support this setting. In these cases, looking in the "Night Light"
section of System Settings the "Turn on/off" button will display the appropriate text.

## Limitations

* This solution is yet to support the strength of the blue light reduction, or time range when should apply.
