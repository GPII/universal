This directory contains a tiny sample client for the pcpChannel WebSockets connection.

It can be tested by firing up any configuration of the GPII which includes a local FlowManager. Particularly
suitable are the mock configurations in %universal/gpii/configs/mocks - for example you can type

    node gpii.js gpii/configs/mocks gpii.config.development.all.local.mock.windows

or 

    node gpii.js gpii/configs/mocks gpii.config.untrusted.development.all.local.mock.windows

from the root of this repository.

After that, you can fire up the client at any time during the lifetime of the FlowManager by typing

    node pcpChannelClient.js

from this directory in another shell.

Before or after that, you can experiment with logging in and out of the GPII using endpoints such as

    http://localhost:8081/user/snapset_1a/login

and

    http://localhost:8081/user/snapset_1a/logout


Here are some sample payloads collected from this client during such testing.

Firstly, connecting the client when no user is keyed into the system produces the payload

```
## Socket connected
## Received the following message: {
    "path": [],
    "type": "ADD"
}
```

After logging in snapset_1a, the client receives the following update:

```
## Received the following message: {
    "path": [],
    "type": "ADD",
    "value": {
        "userToken": "snapset_1a",
        "activeContextName": "gpii-default",
        "settingControls": {
            "http://registry\\.gpii\\.net/common/DPIScale": {
                "value": 1.25,
                "schema": {
                    "title": "DPI Scale",
                    "description": "DPI scale factor on default monitor",
                    "type": "number",
                    "min": 1,
                    "max": 2,
                    "divisibleBy": 0.25
                }
            },
            "http://registry\\.gpii\\.net/common/cursorSize": {
                "value": 1,
                "schema": {
                    "title": "Cursor Size",
                    "description": "Cursor size",
                    "type": "number",
                    "min": 0,
                    "max": 1,
                    "divisibleBy": 0.1
                }
            }
        },
        "preferences": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences"
                }
            }
        }
    }
}
```

After logging out snapset_1a, the client receives the following update:

```
## Received the following message: {
    "path": [],
    "value": null,
    "type": "DELETE"
}
```