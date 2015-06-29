## The browserChannel and the WebSockets settings handler

This document describes how the __Browser Channel__ and the __WebSockets__ settings handler work.

This feature consists on:
* A route in the Flow Manager that serves as the entry point for clients: `/browserChannel`
* The component behind this new route is the _gpii.settingsHandlers.WebSocketsComponent_

### The browser channel
This handler processes every request to _http://localhost:8081/browserChannel_ and is responsible for:
* Processing every request and determining whether a client is allowed or not to connect
* Registering and removing the clients as they are connecting or disconnecting

### The WebSockets settings handler

This settings handler follows the standard settings handler API and exposes both the .get and .set methods to the rest of the system.
The settings handler is an instance of _gpii.settingsHandler.WebSocketsComponent_, which can be found in _gpii/node_modules/settingsHandlers/src/WebSocketsComponent.js_.

This component stores the information about clients and keeps a list of settings for every solution that makes use of this settings handler.
Also, this component create notifications for every connected client at any time when the settings change.

### Usage

This small and documented client illustrates the workflow.

```javascript
var io = require("socket.io-client");

// The client starts the communication
//
var socket = io.connect("http://localhost:8081/browserChannel");

// When the connection is done, the client tells to the flow manager its id
//
socket.on("connect", function () {
    console.log("## Socket connected");
    socket.send("org.chrome.cloud4chrome");
});

// Right after sending the id to the flow manager, the server will return back
// the current settings in the system (if any)
//
socket.on("connectionSucceeded", function (settings) {
    console.log("## Received the following settings: " + JSON.stringify(settings));
});

// By listening to this signal, the client will be notified when the system has
// new settings to be applied on the client side
//
socket.on("onBrowserSettingsChanged", function (newSettings) {
    console.log("## Got newSettings: " + JSON.stringify(newSettings));
});
```

The _contract API_ between client and server can be resumed as follows:

* After connecting to the flow manager, the client sends a socket message to the channel, which is basically a string containing the *id* of the client. ie: _org.chrome.cloud4chrome_
* The client will be registered if the solution's id can be found of the solutions registry, otherwise, the registration will be rejected and the system will emit en error, and the client will disconnected.
* When the flow manager emits either the _connectionSucceeded_ (after being registered) or the _onBrowserSettingsChanged_ (after a user login/logout) signal to the client, it is delivering the current available settings for the client in the following way:
```
{
    "screenReaderTTSEnabled":false,
    "highContrastEnabled":true,
    "invertColours":false,
    "magnifierEnabled":true,
    "magnification":2,
    "fontSize":"medium",
    "simplifier":false,
    "highContrastTheme":"white-black"
}
```
* When a client disconnects, it'll be removed from the list of registered clients

## Testing

This new feature has been tested with [this version of the Cloud4Chrome extension](https://github.com/GutiX/chrome4cloud/commit/3d064bb7efc93bf90fde90b0192c273fb76817e5).
