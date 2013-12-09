Project Background
=====================

BadgeKit will make it simple to get started with badgin and provide lightweight, modular and open options for the community of badgemakers. We are framing BadgeKit around a set of action verbs. Each verb represents an invitation to innovation around defining and refining the user experience for the particular action that the user is attempting to do.  Here are the verbs: Build, Assess, Issue, Collect, Share, Discover and Use. 

BadgeKit evolved out of several years of work in this field as well as LOTS of user testing and research. Our initial goal will be to develop proofs of concept for experiences for each of the actions. In order to develop a vision for this work, we looked at the work that we have been doing for the Chicago Summer of Learning, the Connected Educators Month and for the Mozilla Summit. Each project helped us to produce some great open source solutions for distinct badging experience ranging in size from one badge to thousands of badges being issued. With each project, we user tested, got feedback and iterated - so just think of BadgeKit as our next big iteration on our offering. 



Setup
======================

App Configuration
-------------

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
  "port": 3456,
  "cookie": {
    "secret": "chocolatechips"
  }
}
```

**Environment variables**

Finally, configuration will be picked up from the environment. This is most easily done by writing a `config.env` file (or similar):

```
export PORT=3456
export COOKIE_SECRET='chocolatechips'
```

Then you can source the file like `. config.env`.

App Environment
-----------

The following environment variables are currently used:

- COOKIE_SECRET: Should be a large, unguessable string.  Required.
- PORT: The port that the BadgeKit server should listen on.  Defaults to 3000.
- OPENBADGER_URL: The url of the openbadger API that this application should talk to.  Required.
- OPENBADGER_SECRET: The shared secret defined by the openbadger app.  Required.
- DATABASE_DRIVER: Database driver.  Required, currently only mysql supported.

For a MySQL database, you'll also want to set:

- DATABASE_HOST: Database host.  Defaults to localhost.
- DATABASE_USER: Database user.
- DATABASE_PASSWORD: Database password.
- DATABASE_DATABASE: Name of the database to use.
