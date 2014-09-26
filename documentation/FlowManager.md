## FlowManager

The flowmanager is the component in the system that is largely responsible for managing the flow. For example, the steps involved in logging in requires retrieving preferences, solutions, device data, etc. and passing this to the [MatchMaker Framework](MatchMakerFramework.md). And following that sending this via the [context manager](ContextManager.md) to the [Lifecycle Manager](LifecycleManager.md).

Depending on what the usage of the system is, there flows will be different. For example user login, user log off, and retrieving settings from the system in "cloud based flowmanager" mode are all different. Each "flow" is managed in a different file, with the common events, functions, etc., located in `FlowManager.js` and `FlowManagerUtitilies.js`. The different kinds of flows are:
* **User Login** (`UserLogin.js`) - the flow for a user keying in to the system. The flow is described in details in the [loginFlow](LoginFlow.md) document
* **User Logout** (`UserLogout.js`) - the flow for a user keying out of the system
* **Retrieving Settings** (`Settings.js`) - used to retrieve the settings when the system is running in cloud based mode.
* **Get Token** (`GetToken.js`) - retrieval of the token of the currently logged in user.
* 

To support the different flows, and allow new components to listen to important points in the flow, the flow manager exposes a number of events that are fired on important lifecycle points. Some of the most important events are:
* 
*
