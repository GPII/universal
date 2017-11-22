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
"%universal/testData/dbData/clientCredentials.json",
"%universal/testData/dbData/gpiiAppInstallationClients.json",
"%universal/testData/dbData/gpiiKeys.json",
"%universal/testData/dbData/prefsSafes.json",
"%universal/testData/dbData/views.json"

kanso upload /home/vagrant/sync/testData/dbData/clientCredentials.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/gpiiAppInstallationClients.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/gpiiKeys.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/prefsSafes.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/views.json http://localhost:5984/gpii
