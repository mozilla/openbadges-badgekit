const path = require('path');
const fs = require('fs');
const streamsql = require('streamsql');
const config = require('./config');

function getDbConfig (prefix) {
  prefix += '_';
  return {
    driver:     config(prefix+'DRIVER', 'mysql'),
    host:       config(prefix+'HOST', 'localhost'),
    user:       config(prefix+'USER'),
    password:   config(prefix+'PASSWORD'),
    database:   config(prefix+'DATABASE')
  }
}

function getDb (prefix) {
  return streamsql.connect(getDbConfig(prefix));
};

module.exports.getDb = getDb;
module.exports.getDbConfig = getDbConfig;
