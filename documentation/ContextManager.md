# Context Manager

## Description
The Context Manager is responsible for evaluating the current context against the configuration instructions given by the matchmaker (-framework) and pass the resulting configuration on to the lifecycle manager, PCP, etc., via events on the flowmanager.

The Context Manager is active on the following times in the system.
* **When the matchmaking process has finished**, the context manager will evaluate the data that has been output from the matchmaker against the current context and pass the result on to other components via events on the flowmanager.
* **When the context changes** the Context Manager will re-evaluate the last matchmaker output against the new context. If the change in context means that the system needs to be re-configured, the new configuration will be sent to the relevant component via events on the flowmanager.
 
##API

### Reporting Changes in Environment (PUT /environmentChanged)
* **description**: For environment reporters to notify the system that the environment has changed
* **Supported modes**: works only on installed GPII (ie. non-cloud based flowmanager)
* **route:** `/environmentChanged`
* **method:** `PUT`
* **data format:** The data of the PUT request should be a JSON object, containing at least a timestamp key and one or more environment contexts. The timestamp should be in the following format "2014-10-10T09:59:01.0000123+02:00". Examples of payloads to the PUT request are the following:

```
{
    "timestamp": "2014-10-10T09:59:01.0000123+02:00",
    "http://registry.gpii.net/common/environment/visual.luminance": 762,
    "http://registry.gpii.net/common/environment/auditory.noise": -40
}
```

```
 {
    "timestamp": "2014-23-12T09:59:01.01123923+01:00",
    "http://registry.gpii.net/common/environment/visual.luminance": 122
}
```

# Testing:

To test the context managers handling of environment changes, use CURL to send a post request with the desired payload, eg:

```
curl  -H "Content-Type: application/json" -X PUT -d '{"timestamp": "2014-23-12T09:59:01.01123923+01:00","http://registry.gpii.net/common/environment/visual.luminance": 122}' http://localhost:8081/environmentChanged
```