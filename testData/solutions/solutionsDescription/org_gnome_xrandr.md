# X.Org XRandR

## Details

* __Name__: X.Org XRandR
* __Id__: org.freedesktop.xrandr
* __Platform__: GNU/Linux
* __Contact__: Joseph Scheuhammer <clown@alum.mit.edu>

## Description
__XRandR__ ("resize and rotate") is an extension to the X11 protocol that provides the ability to resize, rotate, and/or reflect the root window of a screen.
XRandR is free software developed under the umbrella of the X.org foundation, and maintained by the freedesktop.org.

You'll find more information at:

  * [XRandR at X.org's wiki](https://www.x.org/wiki/Projects/XRandR/)
  * [Source code at freedesktop's git repository](https://cgit.freedesktop.org/xorg/app/xrandr/)

## Integration
XRandR is used by the GPII personalization framework as a display settings handler to change the screen resolution on GNOME/Linux desktops.

To ensure that the solution is well integrated, there are Acceptance Tests (_tests/platform/linux/linux-xrandr-testSpec.js_) as well as tests of XRandR at a settings handler-level (_gpii/node_modules/xrandr/test/xrandrSettingsHandlerTests.js_).  The latter are located in the linux repository.

## Testing
When using an NP set that makes use of a display settings handler to change the screen resolution, XRandR should launch and re-configure the display resolution using the settings included in that NP set.

### os_gnome_display

The expected behaviour of using the NP set located at universal's _testData/preferences/acceptanceTests/os_gnome_display.json_ is:

* When logging in, XRandR should be launched to change the screen resolution as specified in the above json file.  In this particular case, it should change to 800 pixels wide by 600 pixels high.

* When logging out, XRandR should launch again to restore the screen resolution to its original width and height.

