##Context Manager

### Description
The Context Manager is responsible for evaluating the current context against the configuration instructions given by the matchmaker (-framework) and pass the resulting configuration on to the lifecycle manager, PCP, etc., via events on the flowmanager.

The Context Manager is active on the following times in the system.
* **When the matchmaking process has finished**, the context manager will evaluate the data that has been output from the matchmaker against the current context and pass the result on to other components via events on the flowmanager.
* **When the context changes** the Context Manager will re-evaluate the last matchmaker output against the new context. If the change in context means that the system needs to be re-configured, the new configuration will be sent to the relevant component via events on the flowmanager.
 
###API