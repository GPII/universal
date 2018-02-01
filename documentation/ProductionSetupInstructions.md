## Introduction

The *Cloud Based Flow Manager* can be deployed in a VM using production configurations. Please refer to the ```vagrant-configs``` directory. Once the VM is running, the following services will be available in the VM:

* *Cloud Based Flow Manager* listening on port 8081
* *CouchDB* as the backend database listening on port 5984

**Note:**

* The *Cloud Based Flow Manager* is a Node.js processes
* The above mentioned ports will be forwarded from your host machine to the VM allowing access to deployed services
* Before starting the VM please make sure the ports in question are not being used on your host machine
* All the Vagrant commands listed below should be run in the ```vagrant-configs``` directory.

## Requirements

In order to start the VM, make sure [all these requirements for setting up Quality Infrastructure Environments](https://github.com/GPII/qi-development-environments/blob/master/README.md#requirements) are satisfied.

## Start the VM

To start a VM, run the following command in the ```vagrant-configs``` directory:

```
vagrant up
```

## Test the VM

### Test the Cloud Based Flow Manager

Visiting the following link in a browser:

```
http://localhost:8081/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:[%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D]%7D
```

should return:

```
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

```
curl -X POST -d "grant_type=password&client_id=pilot-computer&client_secret=pilot-computer-secret&username=li&password=dummy" http://localhost:8081/access_token
```

should return:

```
{
    "access_token": {String},
    "expiresIn":3600,
    "token_type":"Bearer"
}
```

### Test CouchDB

Opening this link in a browser:

```
http://localhost:5984/_utils/
```

should show the [CouchDB Web GUI Administration Panel](http://docs.couchdb.org/en/1.6.1/intro/futon.html). The following database should be present:

* ```gpii```: Contains all data for GPII Server that runs within the Cloud Based Flow Manager, including GPII keys, prefs safes, gpii App installation clients, gpii App installation client authorizations and client credentials

## Stop the VM

To stop the VM, run the following command:

```
vagrant halt
```

## Delete the VM

Once you no longer need the VM, you can reclaim storage resources using the following command:

```
vagrant destroy -f
```
