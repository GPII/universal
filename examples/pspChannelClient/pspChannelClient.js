/*!
 * Test client for PSPChannel WebSockets
 *
 * Copyright 2017 Raising the Floor - International
 *
 * The R&D leading to these results received funding from the
 * Department of Education - Grant H421A150005 (GPII-APCP). However,
 * these results do not necessarily represent the policy of the
 * Department of Education, and you should not assume endorsement by the
 * Federal Government.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
"use strict";

var ws = require("ws");

// The client starts the communication
var socket = new ws("ws://localhost:8081/pspChannel"); // eslint-disable-line new-cap

// When the connection is done, the server will send the initial data of the current session if any
socket.on("open", function () {
    console.log("## Socket connected");
});

socket.on("message", function (data) {
    var message = JSON.parse(data);
    console.log("## Received the following message: " + JSON.stringify(message, null, 4));

    if (message.type === "preferencesApplied") {
        console.log("Preferences have been applied");
        socket.close();
        return;
    };

    // Uncomment lines below to try an example that a pspChannel client sends a "modelChanged" request to apply a preference change.
    // socket.send(JSON.stringify(
    //     {
    //         "type": "modelChanged",
    //         value: {
    //             settingControls: {
    //                 "http://registry\\.gpii\\.net/common/DPIScale": {
    //                     value: 1.75
    //                 }
    //             }
    //         }
    //     })
    // );

    // Uncomment lines below to try an example that a pspChannel client sends a "pullModel" request to read the setting value of a preference.
    socket.send(JSON.stringify(
        {
            "type": "pullModel",
            value: {
                settingControls: {
                    "http://registry\\.gpii\\.net/common/magnification": {
                        value: 1
                    }
                }
            }
        })
    );

});
