## Cloud Based Flowmanager Flow

The User login process is as follows:

1. GET request is sent to the `:token/settings/:device` URL where `:token` is the user token to log in and `:device` is a device reporter payload, like: `{"OS":{"id":"web"},"solutions":[{"id":"org.chrome.cloud4chrome"}]}`. It is handled by `{settings}.handle` function which ensures the device payload is valid and fires two events: `onUserToken` and `onDevice`
1. `onUserToken` event has one listener:
  *`{flowManagerUtilities}.getPreferences`: which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.
1. `onDevice` event has one listener:
** `{flowManagerUtilities}.getSolutions`: which fetches the solutions registry and filters it based on the device reporter info. The `onSolutionsRegistry` event is fired with the result.
1. the `onReadyToMatch` event is listening to the three events described above: `onDevice`, `onPreferences` and `onSolutionsRegistry`. When these three events have been fired, the `onReadyToMatchEvent` will be fired.
1. `onReadyToMatch` has one listener:
 `{flowManagerUtitilies}.runMatchMakerFramework`: which kicks off the matchMaker framework. For the purpose of describing the overall login flow, it suffices to say that when the matchmaker framework has finished the matchmaking process, the `onMatch` event is called on the flow manager. For more details on the match maker frameworks internal workings, see: [Match Maker Framework Documentation](MatchMakerFramework.md)
1. `onMatch` is being listened to by `{userLogin}.runContextManager` which in turns fires up the (Context Manager)[ContextManager.md] which evaluates the Match Maker Frameworks output and fires the `onReadyForLifecycle` event.
1. `onReadyForLifecycle` is being listened to by `{userLogin}.processMatch` which applies the settings to the system.




