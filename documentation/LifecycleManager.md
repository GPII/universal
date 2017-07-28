## lifecycleManager

The Lifecycle Manager is responsible for actually configuring the users system via setting shandlers and launch handlers. It is the only component in the system that keeps state. This is done in the "session" member of the lifecycleManager component, and tracks what changes have been done to the system, what the original configuration of the system was and which user is currently logged in.

#### LifecycleManager Queue

The lifecycleManager queue is used to hold the high-level action that needs to happen: starting the login process, starting logout process, starting the update process. Since the steps of these processes are asynchronous, the queue was implemented to avoid racing issues between these processes (e.g. if a logout attempt is started before login is complete, etc).

Each item in the queue should have the format: `{ invokerName: <invokerName>, func: <unresolvedFunctionToCall>, arg: <argument> }` where `<unresolvedFunctionToCall>` is an unresolved (i.e. string) single-argument function that returns a promise. The promise should be resolved when the function is complete (including side-effects). `<arguments>` is the argument to pass to the function. `<InvokerName>` is the name of the invoker that was called on the lifecycleManager for triggering the adding of the item to the queue.

The queue is run sequentially, and an item is considered "done" once the promise returned by its function is resolved.


#### Main functions of lifecycle manager:
The lifecycle manager have three invokers that are generally the ones that will be called from the general system, namely "start", "stop" and "update". These invokers are manually created, so are not obvious to spot on the component defaults block, but the are the ones to be used (instead of the processStart, processStop and processUpdate). They will add the relevant task to the Lifecycle Managers queue:

`start`: Should be called when keying in (configuring the system)
`stop`: Should be called when keying out (restoring the system)
`update`: Should be called when changing the settings of an already configured system (updating the applied settings)


