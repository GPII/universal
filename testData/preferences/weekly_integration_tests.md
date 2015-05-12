# Weekly Integration Tests: Preference Sets

The following preference sets are used for the 
[weekly integration tests](http://wiki.gpii.net/w/Weekly_Integration_Test_Plan):

These preference sets have also been used in the 
[third review of Cloud4all](https://github.com/GPII/universal/blob/master/testData/preferences/review3/review3-preferences.md).

* `vladimir.json`: preference set with with a combination of common and application-specific terms for the following settings:
** default preferences:
*** a white-on-black constrast theme,
*** cursor size 0.5 (default),
*** mouse trailing,
*** screen reader with TTS using a speech rate of 300 wpm,
*** a medium font size and high contrast in Cloud4Chrome,
*** JAWS as required screen reader,
*** the Rule-Based Matchmaker;
** subway preferences:
*** the same as the above, with the addition of a higher TTS volume. 

* `mary.json`: preference set with only common format terms for the following settings:
** enable the on-screen keyboard,
** Rule-Based Matchmaker.

* `manuel.json`: preference set with a combination of common and application-specific terms for the following settings:
** default preferences:
*** magnifier with 200% magnification docked at the top of the screen,
*** use Windows' built-in magnifier (instead of third-party solutions),
*** Cloud4Chrome does NOT invert colours,
*** Rule-Based Matchmaker.
** lower ambient light conditions (luminance lower than 200): 
*** the same as the above, but Cloud4Chrome must now invert the colours.

* `li.json`: preference set with only common format terms for the following settings:
** default preferences:
*** screen reader with TTS using a speech rate of 200 wpm,
*** magnifier with 150% magnification (the magnifier's position is not defined),
*** SuperNova is prioritised on Windows,
*** Mobile Accessibility for Android is prioritised over other Android accessibility features,
*** Rule-Based Matchmaker.
** lower ambient light conditions: 
*** the same as the above, but with a magnification of 200% and high contrast.

* `chris.json`: preference set with a combination of common and application-specific terms for the following settings:
** screen reader with TTS using a speech rate of 350 wpm,
** Braille output,
** a lower screen resolution on Windows,
** NVDA is prioritised on Windows,
** Mobile Accessibility for Android is prioritised over other Android accessibility features,
** Rule-Based Matchmaker.

* `franklin.json`: preference set with a combination of common and application-specific terms for the following settings:
** Read&Write Gold settings:
*** App bar width, 
*** show text on the app bar, 
*** optional tool bar shows large icons and text,
*** SAPI5 speed set to 50,
** Rule-Based Matchmaker.

