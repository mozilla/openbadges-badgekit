
**This software is no longer supported.**

# BadgeKit

BadgeKit is a software tool for issuing Open Badges. With BadgeKit, Mozilla aims to make it easier to get started badging by providing lightweight, modular, open options for the community of badge issuers. The BadgeKit private beta was launched in March 2014, offering badge issuing organizations a chance to sign up for hosted access to the tools. Alternatively, you can host your own instance of BadgeKit using the code in this repo. See the config information below or the [Self-Hosting Guide](https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-Self-Hosting-Guide) for a fuller overview of how to build your own instance of BadgeKit.

## Background

BadgeKit is framed around a set of action verbs. Each verb represents an invitation to innovation around defining and refining the user experience for the particular action that the user is attempting to do. Here are the verbs: Build, Assess, Issue, Collect, Share, Discover and Use.

BadgeKit evolved out of several years of work in the badging field as well as LOTS of user testing and research. Much of BadgeKit was inspired by the work we did for the Chicago Summer of Learning, the Connected Educators Month and the Mozilla Summit. Each project helped us to produce some great open source solutions for distinct badging experience ranging in size from one badge to thousands of badges being issued. With each project, we user tested, got feedback and iterated - so just think of BadgeKit as our next big iteration on our offering.

More tools are being developed and will be announced throughout 2014, see also [Open Badges Discovery](http://discovery.openbadges.org/).

## Using BadgeKit

BadgeKit is made up of two distinct parts: an API and a Web app. This repo hosts the Web app - you can sign up to access the hosted private beta version at [BadgeKit.org](http://badgekit.openbadges.org/). The code in this repo lets you use the exact same components as the Mozilla hosted version, and you can of course alter the code to suit the needs of your own organization.

The BadgeKit Web app is an admin tool for badge issuers - it lets issuer personnel create badges, defining their metadata and designing their appearance, as well as publishing and issuing them. BadgeKit also provides badge application management for issuers. The app doesn't actually store the data for the badges published through it - this is handled by the API. To install your own instance of BadgeKit, you therefore need the code in this repo and the [BadgeKit API Repo](https://github.com/mozilla/badgekit-api).

The BadgeKit API handles the data associated with published badges. You can call on the API webhooks to provide a custom front-end interface for your community of badge earners, so that you control the interaction and communication with them, while the BadgeKit app provides back-end badge issuing admin.

__You can run the BadgeKit API without the Web app, but the Web app depends on a running installation of the API.__

## Setup

BadgeKit can be configured using three different methods (in order of priority):

 * command line arguments
 * a JSON configuration file
 * environment variables

These can be accessed within the app like so:

```
var config = require('./lib/config');

var port = config('PORT', 3000);
var cookie_secret = config('COOKIE_SECRET');
```

If a default value is given, it will be returned if not found elsewhere in the configuration. If it is not given, and no value is found, a `ReferenceError` will be thrown.

**Command line arguments**

Pass these in when starting the app, like so:

```
> node app --port 3456 --cookieSecret chocolatechips
```

**JSON configuration**

If the app finds a `config.json` file in the root, it will use parameters in this file where possible.

```
{
  "PORT": 3456,
  "COOKIE_SECRET": "chocolatechips"
}
```

**Environment variables**

Finally, configuration will be picked up from the environment. This is most easily done by writing a `config.env` file (or similar):

```
export PORT=3456
export COOKIE_SECRET='chocolatechips'
```

Then you can source the file like `. config.env`.

### App Environment

The following environment variables are currently used:

- COOKIE_SECRET: Should be a large, unguessable string. _Required_
- PORT: The port that the BadgeKit server should listen on. Defaults to 3000.
- OPENBADGER_URL: The URL of the BadgeKit API that this application should talk to. _Required_
- OPENBADGER_SECRET: The shared secret defined by the BadgeKit API. _Required_
- OPENBADGER_SYSTEM: The default system slug to use in the BadgeKit API. _Required_
- DATABASE_DRIVER: Database driver. Required, currently only MySQL supported.
- PERSONA_AUDIENCE: Should be set to the app's url (example: "http://localhost:3000"). _Required_
- ACCESS_LIST: An array of regular expressions that define "administrator" email patterns.  e.g. ["^edogg@example.org$"].  These users will automatically be members of the OPENBADGER_SYSTEM system.
- API_SECRET: A string used as a shared secret for BadgeKit's API functions (currently this is only add/delete user functionality). _Required_
- BRANDING: A short string used by the badge studio to add a label to the branding ribbon. Alternatively, this can be an object keyed by `system` slug.
- DEBUG: If set to true, enables additional logging. Defaults to false.

For a MySQL database, you'll also want to set:

- DATABASE_HOST: Database host. Defaults to localhost.
- DATABASE_USER: Database user.
- DATABASE_PASSWORD: Database password.
- DATABASE_DATABASE: Name of the database to use.

### Tests

Tests can be run with `npm test`.

You will need to define the following configuration parameters through one of the
methods outlined above:

- TEST_DATABASE_DRIVER: Database driver. Required, currently only MySQL supported.
- TEST_DATABASE_HOST: Database host. Defaults to localhost.
- TEST_DATABASE_USER: Database user.
- TEST_DATABASE_PASSWORD: Database password.
- TEST_DATABASE_DATABASE: Name of the database to use.


## Running all Badgekit apps on vagrant

Please see the README.vagrant.md file for a detailed walk through to setup a fast local dev environment using [Vagrant](http://www.vagrantup.com/)

This provides a mostly-prebuilt Ubuntu server, complete with MySQL and Node.JS at the correct versions.
