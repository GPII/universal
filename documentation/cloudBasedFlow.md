## Cloud Based Flowmanager Flow

This page describes the flow when GPII is run in cloud based flowmanager mode. This mainly involves two files:
`CloudBasedFlowManager.js` - This will be referred to as `Cloud Based FlowManager` in the below
* `FlowManagerUtitilities.js` - referred to in the below as `flowManagerUtilities`.

### Overview and APIs

The Cloud Based FlowManager can be considered as a standalone, cloud-only configuration of the GPII. This is relevant for applications that are built to support this, and running on a system without the core GPII installed. So for example, a simple javaphone that has a built-in support for GPII, but is not running the core architecture. This can send a user token and platform information to the Cloud Based FlowManager, and get instructions back on how it should be set up.

The endpoint for this service is at `:token/settings/:device` (where `:token` is the user token to log in and `:device` is information about the current platform.)

### Detailed walkthrough of flow:
The process of retrieving application settings in the Cloud Based FlowManager mode is as follows:

1. GET request is sent to the `:token/settings/:device` URL where `:token` is the user token to log in and `:device` is a device reporter payload, like: `{"OS":{"id":"web"},"solutions":[{"id":"org.chrome.cloud4chrome"}]}`. It is handled by the `onSettings` (Cloud Based FlowManager) function which ensures the device payload is valid and fires two events: `onUserToken` and `onDeviceContext`
1. `onUserToken` event has two listeners:
  *`getPreferences` (flowManagerUtilities) which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.
  * `setUserToken` (flowManagerUtilities) which sets the userToken property in the handler
1. `onDeviceContext` event has one listener:
** `getSolutions` (flowManagerUtilities) which fetches the solutions registry and filters it based on the device reporter info. The `onSolutions` event is fired with the result.
. The `onReadyToMatch` event is listening to the three events described above: `onDeviceContext`, `onPreferences` and `onSolutions`. When these three events have been fired, the `onReadyToMatch` event will be triggered.
1. This event signal that all the resources has been fetched and the matchmaking related portion of the workflow starts. This is done via the `processMatch` pseudo event, which is listening to the `onReadyToMatch` event and triggered from it. The `processMatch` event kickes off a set of functions fired sequentially as dictated by the `flowManager.processMatch.priorities`. As with everything else in this flow, the sequence and ordering of the steps in the matchmaking process can be modified by the config/setup being used, and this document wont dive into the details of this flow except for some general observatiosn:
 * Generally some prioritized steps: `preProcess`, `matchMakerDispatcher`, `runContextManager`, `privacyFilter` and `transform` will be run (in that order).
 * The end result of this process is a description of the configuration to be applied to system (described per appplication, filtered according to users privacy settings, etc). The event `onMatchDone` signals that we have the lifecycle instructions ready. For more details on the match maker frameworks internal workings, see: [Match Maker Framework Documentation](MatchMakerFramework.md)
1. `onMatchDone` is being listened to by the `matchToSettings` function (Cloud Based FlowManager) which takes the lifecycle instructions and put the in the response to the requesting application.