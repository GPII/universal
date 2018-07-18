# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'

# Application definitions
app_name = "universal"
app_directory = "/home/vagrant/sync/universal"

# Port-forwarding definitions
preferences_server_port = ENV["VM_PREFERENCES_SERVER_PORT"] ||  9081
flow_manager_port = ENV["VM_FLOW_MANAGER_PORT"] || 9082
couchdb_port = ENV["VM_COUCHDB_PORT"] || 5984

# CPU/memory allocation
cpus = ENV["VM_CPUS"] || 2
ram = ENV["VM_RAM"] || 2048

# Node.js
nodejs_branch = "8"
nodejs_version = "8.11.3"

Vagrant.configure(2) do |config|

  config.vm.box = "inclusivedesign/fedora28"
  config.vm.hostname = app_name

  # Shared folder
  config.vm.synced_folder ".", "#{app_directory}"

  # Mounts node_modules in /var/tmp to work around issues in the VirtualBox shared folders
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    sudo mkdir -p /var/tmp/#{app_name}/node_modules #{app_directory}/node_modules
    sudo chown vagrant:vagrant -R /var/tmp/#{app_name}/node_modules #{app_directory}/node_modules
    sudo mount -o bind /var/tmp/#{app_name}/node_modules #{app_directory}/node_modules
  SHELL

  # Por-forwarding
  config.vm.network "forwarded_port", guest: preferences_server_port, host: preferences_server_port, protocol: "tcp", auto_correct: true
  config.vm.network "forwarded_port", guest: flow_manager_port, host: flow_manager_port, protocol: "tcp", auto_correct: true
  config.vm.network "forwarded_port", guest: couchdb_port, host: couchdb_port, protocol: "tcp", auto_correct: true

  # VirtualBox customizations
  config.vm.provider :virtualbox do |vm|
    vm.customize ["modifyvm", :id, "--memory", ram]
    vm.customize ["modifyvm", :id, "--cpus", cpus]
    vm.customize ["modifyvm", :id, "--vram", "256"]
    vm.customize ["modifyvm", :id, "--accelerate3d", "off"]
    vm.customize ["modifyvm", :id, "--audio", "null", "--audiocontroller", "ac97"]
    vm.customize ["modifyvm", :id, "--ioapic", "on"]
    vm.customize ["setextradata", "global", "GUI/SuppressMessages", "all"]
  end

  # Install OS-level requirements
  config.vm.provision "shell", inline: <<-SHELL
    dnf install -y --disablerepo='*' https://rpm.nodesource.com/pub_#{nodejs_branch}.x/fc/28/x86_64/nodesource-release-fc28-1.noarch.rpm
    dnf install -y --repo=nodesource nodejs-#{nodejs_version}
  SHELL

  # Application-specific commands
  config.vm.provision "shell", privileged: false, inline: <<-SHELL
    cd #{app_directory}
    npm install
  SHELL
end
