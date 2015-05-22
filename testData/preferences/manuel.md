# manuel.json

## Weekly Integration Tests: Preference Sets

This preference set is used for the 
[weekly integration tests](http://wiki.gpii.net/w/Weekly_Integration_Test_Plan) and is manually tested on a regular basis. The expected system behaviour on login is described here.

It has also been used in the [third review of Cloud4all](https://github.com/GPII/universal/blob/master/testData/preferences/review3/review3-preferences.md).

## Details
`manuel.json`: preference set with a combination of common and application-specific terms for the following settings:
* default preferences:
 * magnifier with 200% magnification docked at the top of the screen,
 * use Windows' built-in magnifier (instead of third-party solutions),
 * Cloud4Chrome does NOT invert colours,
 * Rule-Based Matchmaker.
* lower ambient light conditions (luminance lower than 200): 
 * the same as the above, but Cloud4Chrome must now invert the colours.
