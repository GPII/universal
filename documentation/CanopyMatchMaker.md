##UNTRUSTED COMPONENT##

_Does not have any integration tests with the system and should not be expected to work with the framework in it's current state. Is here for reference and potential fixing later._


## MM Ideas for canopy
* to avoid firing two solutions (ie. knowing which overlab) have an array with "should only be launched in one instance". eg: screenReader.speechRate, display.screenEnhancement.magnification, control.onscreenKeyboard, control.speechRecognition, etc., etc. The system would then set settings for all the relevant applications, but then have `active: false`. Tie breaks would be priority or 'deepest match'