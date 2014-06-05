# Badgekit Suite Easy-Deploy Dev En

```

#  Included:

* Ubuntu 12.04 Precise, 64-bit OS
* Mysql 5.5 Server, Client
* Node.js 0.10.28
* Other various utilities/non-vanilla software includes screen, git, python, g++, wget, g++, wget, make, openjdk-7-jre-headless ruby rubygems

**NOTE**
*This is intended to also be the Badgekit API server, alongside this, the Badgekit front-end server.  For the .env file and any other badgekit, see https://github.com/mozilla/badgekit-api and that README*

```

# Prerequisites

* A 64-bit operating system (Macbook Air is great, Windows untested)
* vagrant ([Link](http://www.vagrantup.com/))
* The Vagrantfile in this directory copied to your workstation where you want to run the vagrant instance for BadgekitSuite from

```

# How to Use This Vagrant Easy Deploy Setup

* First, while in Terminal in the directory in the same dir as the Vagrantfile.

  * mkdir vagrant

* Start Vagrant (Note, this may take some time, if you have not already downloaded the base box file)

  * vagrant up

* After that finishes,run the following commands on your local workstation

  * cd ./vagrant

  * git clone https://github.com/mozilla/openbadges-badgekit.git

  * git clone https://github.com/mozilla/badgekit-api.git
* Make a .env file in each of those dirs for the env variables, copied from the sample.env files in each the badgekit-api and openbadges-badgekit repos

  * cp ./badgekit.env ./openbadges-badgekit/.env

  * cp ./badgekitapi.env ./badgekit-api/.env

* Now, vagrant ssh into your running instance

  * vagrant ssh

* Login as root (avoids complications)

  * sudo -sH

* Then, npm install it all

  * cd /vagrant/badgekit && npm install

  * cd /vagrant/openbadges-badgekit && npm install

# **STARTING THE APPS**

* If you aren't already root, login as root (avoids complications)

  * sudo -sH

* I recommend using screen.  http://www.rackaid.com/blog/linux-screen-tutorial-and-how-to/

* Then, use the screen command by itself to open a new screen

  * cd /vagrant/badgekit

  * foreman start web

* To exit the badgekit screen, hit the following keyboard keys (including CAPS as noted)

  * Ctrl-A, Ctrl-D

* You will be back in your original "session" on the vagrant box

* You can now repeat the same process using the following commands

  * screen

* **ONCE IN NEW SCREEN**

  * cd /vagrant/badgekitapi

  * foreman run web

* Then, Ctrl-A,Ctrl-D will take you back out of that screen

* To resume, you will want to first find the screen #'s, then resume them

  * screen -ls  # This will list the screens.

* The output of screen -ls looks like this:

  * 2759.pts-0.precise64  (06/05/2014 07:21:47 PM)  (Detached)

  * 2701.pts-0.precise64  (06/05/2014 07:21:36 PM)  (Detached)

* To resume the first screen, #2759, use this command

  * screen -r 2759

# ACCESSING THROUGH YOUR LOCAL BROWSER DEFAULTS

* http://localhost:3000 - badgekit.org clone

* http://localhost:3500 - api.badgekit.org clone

# ACCESSING UTILITIES FROM LOCAL MACHINE

* MySQL host: localhost:3306

* MySQL user: root / nopassword (blank)

* MySQL user: badgekit    PW: badgekit

* MySQL user: badgekitapi    PW: badgekitapi

