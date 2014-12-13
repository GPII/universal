## Introduction

This page describes how to set up an environment that can run the backend online services that GPII generally depend on in production mode. These are *preferences server* and *cloud based flowmanager*. 

The setup will be using Vagrant and Virtual Box to set up a machine with CentOS 7.0. 

The document contain the following parts:
* The first part describes how to create and spin up a CentOS virtual machine and installing the dependencies (node, npm, git).
* Next is a section describing how to install couchDB and initialize, which is used when running the preferences server in production mode.
* Then a very brief description on installing the GPII and dependencies
* Finally there are two sections dedicated to describing how to run:
 * Preferences server in production mode
 * Cloud based flowmanager in production mode

## Setting up a basic VM with CentOS

We will be using CentOS 7.0 64-bit for testing the configuration files and services. 

### Prerequisites:
First you should ensure that you have the following installed on your machine
* VirtualBox (https://www.virtualbox.org/) 
* Vagrant (https://www.vagrantup.com) installed.

### Creating your CentOS VM
Open up your preferred command prompt and run the following command:

```vagrant box add chef/centos-7.0```

This will download a CentOS to your local machine (for Mac it gets placed in /Users/<USER>/.vagrant.d/boxes/chef-VAGRANTSLASH-centos-7.0) that you can use for creating VMs.

Type the following in a directory dedicated to this new vm: 

```vagrant init chef/centos-7.0```

This will generate a file called `Vagrantfile` on your machine. To forward a port on the virtual box, modify your vagrant file to look like the following:

```
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "chef/centos-7.0"

  # Please make sure that the 'host' port is available. The 'guest'
  # port is what the VM will use.
  config.vm.network "forwarded_port", guest: 8081, host: 8888

  config.vm.synced_folder ".", "/vagrant",
    type: "rsync",
    rsync__auto: "true",
    rsync__exclude: ".git/",
    rsync__args: ["--verbose", "--archive", "--delete"]
end
```

Where the port following 'guest' is the port that GPII is running on inside the VM (in this example 8081), and 'host' is the port that you can use on your system to talk to the guest server (ie. talking to 8888 on your local system would forward the requests to 8081 inside the VM).

Now we're ready to create an instance of the CentOS VM - do this by running:

```
vagrant up
```

this will create the VM in your current folder. Not that the current folder will also be shared with the VM. To ensure that any changes you make to your current folder will be pushed to the VM immediately, run the command:

```
vagrant resync-auto
```

Finally, in a different terminal, you can go to the folder where you just installed spun up the CentOS VM and ssh to it:

```
vagrant ssh
```

Now you should see something like `[vagrant@localhost]$` indicating that you're inside the VM. 

### Installing the required services in CentOS
 
 First add the yum repositories required for installing the dependencies:

 ```
 sudo yum -y install epel-release
 sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-EPEL-7
 ```

 Then install nodejs, npm and git:
 ```
 sudo yum install nodejs npm git
 ```

## Setting up couchDB
If you are planning on running the preferences server in production mode, you need couchDB installed as well - to install it, run:

```
sudo yum install couchdb
```

Set couchDB to start on login, and start it up for now:
```
sudo systemctl enable couchdb.service
sudo systemctl start couchdb.service
```

To check that it's properly running, you can do `ps auxw | grep couch` and should see something like:

```
couchdb  11589  4.3  4.8 372004 22640 ?        Ssl  19:00   0:00 /usr/lib64/erlang/erts-5.10.4/bin/beam -Bd -K true -A 4 -- -root /usr/lib64/erlang -progname erl -- -home /var/lib/couchdb -- -noshell -noinput -sasl errlog_type error -couch_ini /etc/couchdb/default.ini /etc/couchdb/default.d/ /etc/couchdb/local.d/ /etc/couchdb/local.ini -s couch -pidfile /var/run/couchdb/couchdb.pid
couchdb  11597  0.0  0.3 115216  1440 ?        Ss   19:00   0:00 sh -s disksup
couchdb  11598  0.0  0.1   4296   580 ?        Ss   19:00   0:00 /usr/lib64/erlang/lib/os_mon-2.2.14/priv/bin/memsup
couchdb  11600  0.0  0.0   4296   356 ?        Ss   19:00   0:00 /usr/lib64/erlang/lib/os_mon-2.2.14/priv/bin/cpu_sup
vagrant  11602  0.0  0.1   9032   676 pts/0    R+   19:00   0:00 grep --color=auto couch
```

Now go the /vagrant folder, modify the preferences set to be couchDB compatible:

```
cd /vagrant/
wget https://raw.githubusercontent.com/avtar/ansible-costing/master/playbooks/files/modify_preferences.sh
chmod a+x modify_preferences.sh 
./modify_preferences.sh /vagrant/universal/testData/preferences/ /tmp/
```

and add them to couchDB

```
 sudo npm -g install kanso
 for preference in /tmp/*.json; do kanso upload $preference http://localhost:5984/user; done
```

now check that it's working by doing a `curl http://localhost:5984/user/carla` which should print the content of the `carla` needs and preferences set.



## Testing the vagrant box

You now have everything set up in the VM and should be able to test that things are working as expected. Note that the sync'ing between your local machine is one-way - namely changes you do on your local machine will be pushed to the VM, not the other way around. So if you modify any files, etc., that should happen on the local machine. Running the server, etc., should of course happen inside the VM.

Whenever you want to work with the VM, you should go the folder containing the `Vagrantfile` and run:

```vagrant resync-auto```

in one command prompt (this will ensure that changes you make on your local machine are pushed to the virtual machine), and:

```vagrant ssh```

for actually working with vagrant.

In case the VM isn't already running, you can run `vagrant up`.

##Installing the GPII

Next, you will need to install the GPII. Only a simplified set of instructions will be given here - for full details on the installation instructions, see the GPII wiki.

For both the preferences server and cloudbased flowmanager, there is no OS dependencies so you only need the Universal repository. On your local machine (not in the VM), go to the folder that you installed Vagrant in (the folder that contains the `Vagrantfile`), create a node_modules folder and download universal into that:

```
mkdir node_modules
cd node_modules
git clone git://github.com/GPII/universal
```

Next go to that folder and install the dependencies

```
cd universal
npm install
```

And finally ensure that the infusion dependency is only loaded once.

```
grunt dedupe-infusion
```

.. And that's it. When you ssh into your VM, you should now have the installation of GPII in the folder `/vagrant/node_modules/universal`.

##Running the preferences server in standalone production mode##

To run the preferences server in standalone production mode, made sure you've either followed the steps above (incl. the installation of couchDB) or a similar setup.
Make sure that no service is blocking port 8081 and that couchDB is running and is set up to use its default port of 5984.

To run the preferences server in standalone mode, simply go to your universal folder:

```
cd /vagrant/node_modules/universal
```

set the NODE_ENV to be `preferencesServer.production` and run the system as you normally would:

```
export NODE_ENV=preferencesServer.production
node gpii.js
```

And you're all set. You can test that it's running by issuing the command:

```
curl 127.0.0.1:8081/preferences/carla
```

which should give you the content of the carla NP set. To test it from outside the VM, use the port that you set up in your Vagrantfile (in the example, it's 888) when curling to the preferences server. So from your local machine, run:

```
curl 127.0.0.1:8888/preferences/carla
```

which should give you the same output (i.e. the content of the Carla NP set).


##Running the cloud based flowmanager production mode##

To run the cloudBased flowmanager in production mode, made sure you've followed the steps above (excl. the installation of couchDB, this is not required) or a similar setup. Make sure that no service is blocking port 8081. The cloudbased flowmanager is expecting a preferences server to be running at `http://preferences.gpii.net` so make sure this is the case as well.

Now, to run the system in cloudBased flowmanager mode, simply go to your universal folder:

```
cd /vagrant/node_modules/universal
```

set the NODE_ENV to be `cloudBased.production` and run the system as you normally would:

```
export NODE_ENV=cloudBased.production
node gpii.js
```

And you're all set. You can test that it's running by issuing the command:

```
curl http://localhost:8081/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:%5B%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D%5D%7D
```

from inside the VM, which should give you something along the lines of

```
{"org.gnome.desktop.a11y.magnifier":{"mag-factor":2,"screen-position":"right-half","show-cross-hairs":true,"lens-mode":false,"mouse-tracking":"proportional","scroll-at-edges":true}}
```

From your local machine (outside the VM), to test it, you should run:

```
curl 127.0.0.1:8888/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:%5B%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D%5D%7D
```

which should give you the same output.
