## System Launch and Configs 

### Overview
The system can generally run in three different modes:
* **Locally Installed GPII**: The most common mode is as a locally installed system. This is what end users would have running on their system, and is able to allow a user to log in, auto-configure the system, launch applications, etc.
* **Cloud-based Flowmanager**: This is a mode which is supposed to be run in the cloud. It does not allow a user to log in, and does no configuration (i.e. has no lifecycle manager). Instead, on request, it is able to serve a user's preferences in a format required by one or more applications. This is useful for applications that run without a locally installed GPII (for example, web applications).
* **Custom Configs**: In addition to running the system as a local install or with a cloud-based flowmanager, it is also possible to run the system in other configurations. Examples are: Preferences server only, Solution Registry only, Flat MatchMaker only. These are generally useful for production mode where you might want individual (remote) servers set up for each of the different services used by the system.

Note that for both the locally installed system and cloud-based flowmanager mode, depending on the exact configuration used, components such as the solutions registry, preferences server, etc., can be set up to run both locally or remotely. A description of how to run the system in these modes and of the configs is given below.


### System Launch

#### Locally Installed

Since running the system in local install mode is expected to configure the machine and launch applications on login, it is dependent on the platform. For this reason, running the system locally is done from the platform-specific folders - that is windows, linux or android.

If you have installed GPII in the folder <GPII-install>:
* In Microsoft Windows, go to <GPII-install>\windows
* In GNU/Linux and other Unix-like systems, go to <GPII-install>/linux
* In Android, go to <GPII-install>/android

Then run the command: `node gpii.js`

By default this will start up the system with everything running locally, using the `gpii.config.development.all.local.json` configuration file of universal repository (see the `universal/gpii/configs` folder). If you would like to run the system using a different configuration, say `dev.remote.prefs` run the following:
* in Microsoft Windows: `SET NODE_ENV=dev.remote.prefs`
* in GNU/Linux and other Unix-like systems: `export NODE_ENV=dev.remote.prefs`

Followed by the `node gpii.js` command.


#### Cloud-Based Flowmanager

Since the Cloud-Based Flowmanager does not require any platform-specific bindings (it only returns a modified set of settings - but does not configure anything), you can run it from universal. Given that you have installed GPII in the folder <GPII-install>, go to: `<GPII-install>/node_modules/universal`.

Change the NODE_ENV environment variable to the cloudbased config file:
* in Microsoft Windows: `SET NODE_ENV=gpii.config.cloudBased.development.all.local`
* in GNU/Linux and other Unix-like systems: `export NODE_ENV=gpii.config.cloudBased.development.all.local`

Then start up the server by running the following command from the universal folder:
`node gpii.js`

This will set up the system to run in cloud-based mode, but with everything running on the same (local) device.
