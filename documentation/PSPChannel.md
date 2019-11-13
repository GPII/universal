# PSP Channel

PSPChannel is used to establish persistent WebSockets connection between PSPChannel server and clients. Once the
connection is established, the PSPChannel client can request various actions by transmitting the specified data to the
pspChannel server. These actions include: apply preferences, switch to a different preference set, save changed
preferences and read a preference value. Examples of how to construct PSPChannel connections and send/receive data
from PSPChannel server can be found at
[examples/pspChannelClient](../examples/pspChannelClient).

## PSPChannel WebSocket APIs

### Open up a PSPChannel WebSocket Connection

Assume GPII is running on port `localhost:8081` port:

```js
var WS = require("ws");
var socket = new WS("ws://localhost:8081/pspChannel");
```

Add socket listeners to process the communicated data with the server:

```js
socket.on("open", function () {
    // Indicate the PSPChannel WebSocket Connection has been established
});

socket.on("message", function (data) {
    // Process messages received from the server
});

socket.on("error", function (error) {
    // Error handler
});
```

Once the PSPChannel Connection is established, the server will send the first message to the client indicating
the current lifecycle manager session state. An example of a typical first message that shows "noUser" is keyed
in the system and no preferences have been read or applied:

```json
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "type": "ADD",
        "value": {
            "gpiiKey": "noUser",
            "activeContextName": "gpii-default",
            "settingControls": {},
            "preferences": {}
        }
    }
}
```

### Close a PSPChannel WebSocket Connection

```js
socket.close();
```

### Send Data to PSPChannel Server

the PSPChannle client can request various actions by
transmitting the specified data to the server.

```js
socket.send(data);
```

* Parameters:

 **data**: {Object}. The data to send to the server. It contains two paths: `type` and `value`.

 **data.type**: {String}. It can be one of these values: `modelChanged`, `pullModel`.

 _`modelChanged`_ typed messages are used to apply preferences, switch to a different preference set and save changed preferences.

 _`pullModel`_ typed messages are used to read preference values.

 **data.value**: {Object}. The actual value for performing actions. The detailed value structure is described below:

#### Apply a Preference

* The data transmitted from the client to the server:

An example of changing the volume:

```json
{
    "type": "modelChanged",
    "value": {
        "settingControls": {
            "http://registry\\.gpii\\.net/common/volume": {
                "value": 0.5
             }
         }
    }
}
```

 An example of changing a nested keyed preference:

```json
{
    "type": "modelChanged",
    "value": {
        "settingControls": {
            "http://registry\\.gpii\\.net/applications/com\\.microsoft\\.office.word-ribbon": {
                "value": "StandardSet"
             }
         }
    }
}
```

* The server response:

When preferences are applied, the server will send back a `modelChanged` message. An example:

```json
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "type": "ADD",
        "value": {
            "gpiiKey": "noUser",
            "activeContextName": "gpii-default",
            "settingControls": {
                "http://registry\\.gpii\\.net/common/volume": {
                    "value": 0.5,
                    "schema": {
                        "title": "Volume",
                        "description": "General volume of the operating system",
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "liveness": "live"
                }
            },
            "preferences": {
                "contexts": {
                    "gpii-default": {}
                }
            }
        }
    }
}
```

#### Read a Preference

* The data transmitted from the client to the server:
1. An example of reading the magnification value:

```json
{
    "type": "pullModel",
    "value": {
        "settingControls": {
            "http://registry\\.gpii\\.net/common/volume": {
                "value": 1
            }
        }
    }
}
```

The value at the path `value.settingControls.{preference}.value` can be any valid value constrained by this setting's
schema defined in its solution registry entry. This value is required for sending the requested preference through the
matchmaking process but it doesn't take any effect to the system.

* The server response:

The server will send back the current preference value. This value doesn't have any connection with the value in the
incoming request. The typed messages from the server vary in different use cases:

1. If the preference value is changed from the last time when it was read or applied, the server will send back
 `modelChanged` and `preferenceReadSuccess` typed messages;
2. If the preference value stays unchanged from the last time when it was read or applied, the server will only send
 back the `preferenceReadSuccess` typed message;
3. If GPII is not able to read the preference value, the server will send back the `preferenceReadFail` typed message.

An example of a `modelChanged` typed message:

```json
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "type": "ADD",
        "value": {
            "gpiiKey": "noUser",
            "activeContextName": "gpii-default",
            "settingControls": {
                "http://registry\\.gpii\\.net/common/volume": {
                    "value": 0.5,
                    "schema": {
                        "title": "Volume",
                        "description": "General volume of the operating system",
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1
                    },
                    "liveness": "live"
                }
            },
            "preferences": {
                "contexts": {
                    "gpii-default": {}
                }
            }
        }
    }
}
```

An example of a `preferenceReadSuccess` typed message:

```json
{
    "type": "preferenceReadSuccess",
    "payload": {}
}
```

An example of a `preferenceReadFail` typed message:

```json
{
    "type": "preferenceReadFail",
    "payload": {}
}
```

#### Switch to a different preference set

* The data transmitted from the client to the server:

An example of switching to a preference set named "bright":

```json
{
    "type": "modelChanged",
    "value": {
        "activeContextName": "bright"
    }
}
```

The value at the path `value.activeContextName` specifies the name of the preference set to switch to.

* The server response:

Once the switch completes, the server will send back a `modelChanged` typed message with session state with the new
preference set.

An example of a `modelChanged` typed message:

```json
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "type": "ADD",
        "value": {
            "gpiiKey": "context1",
            "activeContextName": "bright",
            "settingControls": {
                "http://registry\\.gpii\\.net/common/magnification": {
                    "schema": {
                        "title": "Magnification",
                        "description": "Level of magnification",
                        "type": "number",
                        "default": 1,
                        "minimum": 1,
                        "multipleOf": 0.1
                    },
                    "liveness": "live",
                    "value": 2
                }
            },
            "preferences": {
                "name": "Multiple Contexts",
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences"
                    },
                    "bright": {
                        "name": "bright"
                    },
                    "noise": {
                        "name": "noise"
                    },
                    "brightandnoise": {
                        "name": "bright and noise"
                    }
                }
            }
        }
    }
}
```

#### Save changed preferences

This request is to save all changed preferences into the database.

* The data transmitted from the client to the server:

```json
{
    "type": "modelChanged",
    "value": {
        "saveButtonClickCount": 1
    }
}
```

The integer at the path `value.saveButtonClickCount` should be incremented at each new request.

* The server response:

When the save completes, the server will send back a `preferencesApplied` typed message. An example:

```json
{
    "type": "preferencesApplied",
    "payload": {}
}
```
