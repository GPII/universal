#!/bin/bash

set -e

# Retrieve Ansible roles
sudo ansible-galaxy install -fr /home/vagrant/sync/examples/production-components-vm/provisioning/requirements.yml

# Install CouchDB
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/examples/production-components-vm/provisioning/couchdb.yml --tags="install,configure,deploy"

# Install Preferences Server
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/examples/production-components-vm/provisioning/preferences-server.yml --tags="install,configure,deploy"

# Install Flow Manager
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/examples/production-components-vm/provisioning/flow-manager.yml --tags="install,configure,deploy"
