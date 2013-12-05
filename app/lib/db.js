const path = require('path');
const fs = require('fs');
const streamsql = require('streamsql');
const config = require('./config');
const configStore = require('../../lib/config.js');
const dbm = require('db-migrate')

var env = config('DATABASE_ENVIRONMENT', 'dev');
dbm.config.load(path.join(__dirname, '../../database.json'));

if (!dbm.config[env])
  throw new Error('Database environment ' + env + ' not defined in database.json');

// db-migrate's config loader doesn't ensure ENV variables exist
for (var entry in dbm.config[env]) {
  if (dbm.config[env][entry] === undefined)
    throw new Error('Illegal undefined value for ' + entry);
}

var dbconfig = configStore(dbm.config[env]);

module.exports = streamsql.connect({
  'driver': dbconfig('driver'),
  'host': dbconfig('host'),
  'user': dbconfig('user'),
  'password': dbconfig('password'),
  'database': dbconfig('database')
});
