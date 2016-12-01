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

# Add additional CouchDB data
kanso upload /home/vagrant/sync/testData/security/TestOAuth2DataStore.json http://localhost:5984/auth
kanso upload /home/vagrant/sync/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json http://localhost:5984/auth

