const path = require('path');
const fs = require('fs');
const streamsql = require('streamsql');
const config = require('./config');

var dbs = {};

function getDbConfig (prefix) {
  prefix += '_';
  return {
    driver:     config(prefix+'DRIVER', 'mysql'),
    host:       config(prefix+'HOST', 'localhost'),
    user:       config(prefix+'USER'),
    password:   config(prefix+'PASSWORD'),
    database:   config(prefix+'DATABASE')
  };
}

function getDb (prefix) {
  if (!(prefix in dbs)) {
    dbs[prefix] = streamsql.connect(getDbConfig(prefix));
  }

  return dbs[prefix];
}

module.exports.getDb = getDb;
module.exports.getDbConfig = getDbConfig;
