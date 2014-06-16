# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of, specified already in the Vagrantfile

  # This Vagrantfile is Node.js, MySQL setup for badgekit
  # As of 1/17/14, this is in rough draft, please submit
  # bugs via webmaker :: devops, or email jp@mozillafoundation.org
  config.vm.box = "badgekitsuite"

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = "http://stuff.webmaker.org/devtools/badgekitsuite.box"

  # Create forwarded port mappings
  # Webmaker apps have the following port assignments/urls
  # which are opened up to your local workstation by the
  # following stanzas

  # Configure mongo and elasticsearch port forwards

  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 3500, host: 3500
  config.vm.network :forwarded_port, guest: 3600, host: 3600

  # Be sure you make this directory wherever you want this
  # vagrant instance to run from.
  config.vm.synced_folder "./vagrant", "/vagrant"

end
