# PCP Example client

This directory contains a tiny sample client for the pcpChannel WebSockets connection.

## Starting up the GPII and trying out the PCP channel example client.

It can be tested by firing up any configuration of the GPII which includes a local FlowManager. Particularly
suitable are the mock configurations in %gpii-universal/gpii/configs/mocks - for example you can type

    `node gpii.js gpii/configs/mocks gpii.config.development.all.local.mock.windows`

or

    `node gpii.js gpii/configs/mocks gpii.config.untrusted.development.all.local.mock.windows`

from the root of this repository. This will start up the servers in trusted or untrusted mode, respectively.

After that, you can fire up the client at any time during the lifetime of the FlowManager by typing

    `node pcpChannelClient.js`

from this directory in another shell.

Before or after that, you can experiment with logging in and out of the GPII using endpoints such as

    `http://localhost:8081/user/snapset_1a/login`

and

    `http://localhost:8081/user/snapset_1a/logout`

Note that the NP sets used with the above configurations should be in the testData/preferences folder of this repository.

## Example payloads received by the PCP

Here are some sample payloads collected from this client during such testing.

Firstly, connecting the client when no user is keyed into the system produces the payload

```
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "type": "ADD"
    }
}
```

After logging in `snapset_1a`, the client receives the following update:

```
{
    "type": "modelChanged",
    "payload": {
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
                "name": "Larger 125%",
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences"
                    }
                }
            }
        }
    }
}
```

After logging out `snapset_1a`, the client receives the following update:

```
{
    "type": "modelChanged",
    "payload": {
        "path": [],
        "value": null,
        "type": "DELETE"
    }
}
```

When the PCP issues an update to the preferences (see below), a message will be sent to the PCP once the settings change has been applied to the system:

```
{
    "type": "preferencesApplied"
}
```


## Example payloads sent by the PCP

The PCP has can send two different payloads to the GPII core architecture. Namely a change in context or a change in a setting.

Changing the context via the pcp is done with the following payload:

`{"path": ["activeContextName"], "value": "bright", type: "ADD"}`

This will change the context to "bright". To change the context to something else, simply change "bright" with the name of the desired context.

The PCP API also supports changing preferences (one at a time). This is done via the following payload:

`{"path":["preferences","http://registry\\.gpii\\.net/common/magnification"],"type":"ADD","value":4}`

Where the value for the "preferences" key is the setting that should change, and the value for the "value" is the new value the setting should take. So in the above example
the common term magnification is set to 4.
