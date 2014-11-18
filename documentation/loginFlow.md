## User login flow

The User login process is as follows:

1. GET request is sent to the `/user/:token/login` URL and handled by the `{userLogin}.handle` function which fires the `onUserToken` event is fired.
1. `onUserToken` event has two listeners:
 * `{userLogin}.getDevice`: which fetches the device reporter data. When this has been fetched an `onDevice` event is fired.
 * `{flowManagerUtilities}.getPreferences`: which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.
1. `onDevice` event has one listener:
 * `{flowManagerUtilities}.getSolutions`: which fetches the solutions registry and filters it based on the device reporter info. The `onSolutionsRegistry` event is fired with the result.
1. the `onReadyToMatch` event is listening to the three events described above: `onDevice`, `onPreferences` and `onSolutionsRegistry`. When these three events have been fired, the `onReadyToMatch` event will be fired.
1. `onReadyToMatch` has two listeners:
 * `{userLogin}.recordMatch` which stores the preferences, device and solution info to the request object.
 * `{flowManagerUtitilies}.runMatchMakerFramework`: which kicks off the matchMaker framework. For the purpose of describing the overall login flow, it suffices to say that when the matchmaker framework has finished the matchmaking process, the `onMatch` event is called on the flow manager. For more details on the match maker frameworks internal workings, see: [Match Maker Framework Documentation](MatchMakerFramework.md)
1. `onMatch` is being listened to by `{userLogin}.runContextManager` which in turns fires up the (Context Manager)[ContextManager.md] which evaluates the Match Maker Frameworks output and fires the `onReadyForLifecycle` event.
1. `onReadyForLifecycle` is being listened to by `{userLogin}.startLifecycle` which applies the settings to the system.




