## User login flow

Description of the various functions/events that happens on user login:

`gpii.request.flowManager.onUserLogin()` (_flowmanager/src/UserLogin.js_) listens to the `/user/:token/login` url and is called with token. Fires event `onUserListener`

The `onUserListener` event is listened to by:
* `gpii.request.flowManager.getDevice()` (_flowmanager/src/FlowManagerUtilities.js_), which fetches the device reporter data. When this has been fetched an `onDevice` event is fired.
* `gpii.request.flowManager.getPreferences` (_flowmanager/src/FlowManagerUtilities.js_), which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.

The event `onReadyToMatch` listens to the two events: `onPreferences` and `onDevice` and is fired when the two events happen. This is listened to by the ``gpii.request.flowManager.getMatch()` function (_flowmanager/src/FlowManagerUtilities.js_). This function in turn calls `gpii.matchMakerFramework.match()` (_matchMaker/src/MatchMakerFramework.js_).





## Matchmaker Framework

A locally running component, with the responsiblity of:
* Doing the preprocessing - that is, preparing the input payload for the mathmakers
* Making the decision of which MM to call (ie. hybrid matchmaking), and call that MM
* Doing the post-processing - that is, taking the return payload from the matchmakers and transformat



##TODOs:
* Currently matchmakerframework is a kettle app... it shouldn't have to be but seems to be misbehaving if not on callbacks when getting solutions  registry entry.
* Check at solution registry stadig fungerer som server - at queries virker
* Remove MM utilities fil et andet sted hen
* Flat MM doesn't work for application specific settings (in particular empty blocks)
* Support for the http://registry.gpii.net/applications/some.app.id/setting8 conversion into opague blocks (or vice versa)
* Meta data sections
* Get the canopy matchmaker working again
* Copy over copyrights from documents - currently original authors are not there
##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.
* currently MMframework first and event on contextManager - should be contextManager listening to an event on MMFramework.
* Consider keeping token in MM input as well?
* Describe flow for user login
* Describe flow for user logout
* Describe flow for changed context
* Describe flow for update to/from PCP
* Fix up flow for different components to be a bit more sensible

##Major framework changes:
* Solutions registry keyed by solution id. solution id variable removed from the entry
* All transformations in the solutionsregistry changed to flat

## MM Ideas for canopy
* to avoid firing two solutions (ie. knowing which overlab) have an array with "should only be launched in one instance". eg: screenReader.speechRate, display.screenEnhancement.magnification, control.onscreenKeyboard, control.speechRecognition, etc., etc. The system would then set settings for all the relevant applications, but then have `active: false`. Tie breaks would be priority or 'deepest match'

