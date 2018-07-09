# Production Setup Instructions

## Introduction

The *Cloud Based Flow Manager* can be deployed in a VM using production configurations. Once the VM is running, the
following services will be available in the VM:

* *Preferences Server* listening on port 9081
* *Cloud Based Flow Manager* listening on port 9082
* *CouchDB* as the backend database listening on port 5984

**Note:**

* The *Preferences Server* is a Node.js process
* The *Cloud Based Flow Manager* is a separate Node.js process
* The above mentioned ports will be forwarded from the VM to your host machine allowing access to deployed services
* Before starting the VM please make sure the ports in question are not being used on your host machine
* All the Vagrant commands listed below should be run in the universal root directory.

## Requirements

In order to start the VM, make sure [all these requirements for setting up Quality Infrastructure
Environments](https://github.com/GPII/qi-development-environments/blob/master/README.md#requirements) are satisfied.

## Start the VM

To start a VM, run the following command in the universal root directory:

`vagrant up`

## Test the VM

### Test the Preferences Server

Visiting the following link in a browser:

`http://localhost:9081/preferences/carla`

should return:

```json
{
  "contexts": {
    "gpii-default": {
      "name": "Default preferences",
      "preferences": {
        "http://registry.gpii.net/applications/com.texthelp.readWriteGold": {
          "ApplicationSettings.AppBar.Width.$t": 788,
          "ApplicationSettings.AppBar.ShowText.$t": true,
          "ApplicationSettings.AppBar.optToolbarShowText.$t": true,
          "ApplicationSettings.AppBar.LargeIcons.$t": true,
          "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
          "ApplicationSettings.Speech.optSAPI5Speed.$t": 50,
          "ApplicationSettings.Speech.optAutoUseScreenReading.$t": false
        },
        "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
          "show-cross-hairs": true,
          "lens-mode": false,
          "mag-factor": 2,
          "mouse-tracking": "proportional",
          "screen-position": "right-half",
          "scroll-at-edges": true
        },
        "http://registry.gpii.net/applications/com.microsoft.windows.magnifier": {
          "Magnification": 200,
          "ZoomIncrement": 50,
          "Invert": 0,
          "FollowMouse": 1,
          "FollowFocus": 1,
          "FollowCaret": 1,
          "MagnificationMode": 1
        },
        "http://registry.gpii.net/common/fontSize": 24,
        "http://registry.gpii.net/common/foregroundColor": "white",
        "http://registry.gpii.net/common/backgroundColor": "black",
        "http://registry.gpii.net/common/fontFaceFontName": ["Comic Sans"],
        "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
        "http://registry.gpii.net/common/magnification": 2,
        "http://registry.gpii.net/common/tracking": ["mouse"],
        "http://registry.gpii.net/common/invertColours": true,
        "http://registry.gpii.net/common/adaptationPreference": [{
          "adaptationType": "caption",
          "language": "en"
        }, {}],
        "http://registry.gpii.net/common/tableOfContents": false
      }
    }
  },
  "name": "Carla"
}
```

### Test the Cloud Based Flow Manager

Visiting the following link in a browser:

`http://localhost:9082/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:[%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D]%7D`

should return:

```json
{
    "org.gnome.desktop.a11y.magnifier": {
        "focus-tracking": "none",
        "caret-tracking": "proportional",
        "mouse-tracking": "proportional",
        "mag-factor": 2,
        "screen-position": "right-half",
        "show-cross-hairs": true,
        "lens-mode": false,
        "scroll-at-edges": true
    }
}
```

Or,

Open a terminal and copy, paste this command:

```snippet
curl -X POST -d "grant_type=password&client_id=pilot-computer&client_secret=pilot-computer-secret&username=li&password=dummy" http://localhost:9082/access_token
```

should return:

```snippet
{
    "access_token": {String},
    "expiresIn":3600,
    "token_type":"Bearer"
}
```

### Test CouchDB

Opening this link in a browser:

`http://localhost:5984/_utils/`

should show the [CouchDB Web GUI Administration Panel](http://docs.couchdb.org/en/1.6.1/intro/futon.html). The following
database should be present:

* `gpii`: Contains all data for GPII Server that runs for the Preferences Server and the Cloud Based Flow Manager,
  including GPII keys, prefs safes, GPII App installation clients, GPII App installation client authorizations and
  client credentials

## Stop the VM

To stop the VM, run the following command:

`vagrant halt`

## Delete the VM

Once you no longer need the VM, you can reclaim storage resources using the following command:

`vagrant destroy -f`
