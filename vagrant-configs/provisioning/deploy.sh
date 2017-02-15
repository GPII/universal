#!/bin/bash

set -e

# Retrieve Ansible roles
sudo ansible-galaxy install -fr /home/vagrant/sync/vagrant-configs/provisioning/requirements.yml

# Install CouchDB
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/vagrant-configs/provisioning/couchdb.yml --tags="install,configure,deploy"

# Install Preferences Server
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/vagrant-configs/provisioning/preferences-server.yml --tags="install,configure,deploy"

# Install Flow Manager
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/vagrant-configs/provisioning/flow-manager.yml --tags="install,configure,deploy"

# Load Preferences Test Data into CouchDB
node /home/vagrant/sync/scripts/dataLoader-prefs.js

# Load Authorization Test Data into CouchDB
node /home/vagrant/sync/scripts/dataLoader-auth.js
