## Introduction

A virtual machine that starts GPII in production mode can be found at the directory ```examples/production-components-vm```. Once started, the VM runs

* *Preferences Server* as one node instance listening on port 8081
* *Cloud Based Flow Manager* as another node instance listening on port 8082
* *CouchDB* as the backend data storage for above two servers listening on port 5984

**Note** that these ports are forwarded from the VM to your host machine to allow you to access them locally. Therefore, before starting the VM, please make sure these ports on your host machine are free of use.

## Requirements

In order to start the VM, make sure [all these requirements for setting up Quality Infrastructure Environments](https://github.com/GPII/qi-development-environments/blob/master/README.md#requirements) are satisfied.

## Start the VM

In the universal repository root directory, run the following commands:

```
cd examples/production-components-vm
vagrant up
```

Now the VM should be started.

## Test the VM

### Test Preferences Server

Open this link in a browser:

```
http://localhost:8081/preferences/carla
```

should give you the content of the carla NP set.

### Test Cloud Based Flow Manager

Open this link in a browser:

```
http://localhost:8082/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:[%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D]%7D
```

should output:

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

### Test CouchDB

Open this link in a browser:

```
http://localhost:5984/_utils/
```

should show [CouchDB Web GUI Administration Panel](http://docs.couchdb.org/en/1.6.1/intro/futon.html) that lists these databases:

* ```auth```: Contains all data for GPII Authorization Server that runs within Cloud Based Flow Manager
* ```preferences```: Contains all data for Preferences Server

## Stop the VM

In the universal repository root directory, run the following commands:

```
cd examples/production-components-vm
vagrant halt
```

Now the VM should be stopped.
