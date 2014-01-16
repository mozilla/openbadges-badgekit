const path = require('path');
const fs = require('fs');
const streamsql = require('streamsql');
const config = require('./config');
const mysql = require('mysql');

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
  var db = streamsql.connect(getDbConfig(prefix));

  function handleDisconnect() {
    db.connection = mysql.createConnection(getDbConfig(prefix));
    db.connection.connect(function(err) {
      if(err) {
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000);
      }
      db.query = db.driver.getQueryFn(db.connection);
      db.queryStream = db.driver.getStreamFn(db.connection);
    });   

    setErrorHandler();
  }

  function setErrorHandler() {
    db.connection.on('error', function(err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleDisconnect();
      }
      else {
        console.error(err);
      }
    });
  }

  setErrorHandler();

  return db;
};

module.exports.getDb = getDb;
module.exports.getDbConfig = getDbConfig;
