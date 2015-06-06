# li.json

## Weekly Integration Tests: Preference Sets

This preference set is used for the 
[weekly integration tests](http://wiki.gpii.net/w/Weekly_Integration_Test_Plan) and is manually tested on a regular basis. The expected system beahvior on login is described here.

It has also been used in the [third review of Cloud4all](https://github.com/GPII/universal/blob/master/testData/preferences/review3/review3-preferences.md).

## Details
`li.json`: preference set with only common format terms for the following settings:
* default preferences:
 * screen reader with TTS using a speech rate of 200 wpm,
 * magnifier with 150% magnification (the magnifier's position is not defined),
 * SuperNova is prioritised on Windows,
 * Mobile Accessibility for Android is prioritised over other Android accessibility features,
 * Rule-Based Matchmaker.
* lower ambient light conditions: 
 * the same as the above, but with a magnification of 200% and high contrast.
