## System Launch and Configs 

### Overview
The system can generally run in three different modes:
* **Locally Installed GPII**: The most common mode is as a locally installed system. This is what end-users would have running on their system, and is able to allow a user to log in, auto-configure the system, launch applications, etc.
* **Cloudbased Flowmanager**: This is a mode which is supposed to be run in the cloud. It does not allow a user to log in, and does no configuration (ie. has no lifecycle manager). Instead, on request, it's able to server a users preferences in a format required by one or more applications. This is useful for applications that runs without a locally installed GPII.
* **Custom Configs**: Besides running the system as local install or cloudbased flowmanager, there is the option of running the system in other configurations. Examples are: Preferences server only, Solution Registry only, Flat MatchMaker only. These are generally useful for production mode where you might want individual (remote) servers set up for each of the different services used by the system.

Note that for both the locally installed system and cloudbased flowmanager mode, depending on the exact configuration used, things like the solutions registry, preferences server, etc., can be set up to run both locally or remotely. Below a description of how to run the system in these modes and of the configs is given.


### System Launch

#### Locally Installed

Since running the system in local install mode is expected to configure the machine and launch applications on login, it is dependent on the platform. For this reason, running the system locally is done from the platform specific folders - that is windows, linux or android.

If you have installed GPII in the folder <GPII-install>:
* In windows, go to <GPII-install>\windows
* In linux, go to <GPII-install>/linux
* In android, go to <GPII-install>/android

Then run the command: `grunt start`

By default this will start up the system with everything running locally, using the `development.all.local.json` configuration file of universal repository (see the `universal/gpii/configs` folder). If you would like to run the system using a different configuration, say `dev.remote.prefs` run the following:
* in Windows: `SET NODE_ENV=dev.remote.prefs`
* in linux: `EXPORT NODE_ENV=dev.remote.prefs`

Followed by the `grunt start` command.


#### Cloud Based Flowmanager

Since the Cloud Based Flowmanager does not require any platform specific bindings (it only returns a modified set of settings - doesn't configure anything), you can run it from universal. Given that you have installed GPII in the folder <GPII-install>, go to: `<GPII-install>/node_modules/universal`.

Change the NODE_ENV environment variable to the cloudbased config file:
* in Windows: `SET NODE_ENV=cloudBased.development.all.local`
* in linux: `EXPORT NODE_ENV=cloudBased.development.all.local`

Then start up the server by running the following command from the universal folder:
`node gpii.js`

This will set up the system to run in cloudBased mode, but with everything running on the same (local) device.



