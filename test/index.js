var async = require('async');
var migrations = require('../lib/migrations');
var config = require('../app/lib/config');
var db = require('../app/lib/db');
var connection = db.getDb("TEST_DATABASE");
const DB_CONFIG = db.getDbConfig("TEST_DATABASE");

exports.up = function up(options) {
  options = options || {};
  if (!options.config)
    options.config = DB_CONFIG;
  return function(callback) { migrations.up(options, callback); };
}

exports.down = function down(options) {
  options = options || {};
  if (!options.config)
    options.config = DB_CONFIG;
  return function(callback) { migrations.down(options, callback); };
}

exports.sqlError = function sqlError(sql, error) {
  return function(callback) {
    connection.query(sql, function(err, results) {
      if (!err)
        throw new Error("expected " + sql + " to throw error");
      err.code.should.equal(error);
      callback(null);
    });
  };
}

exports.sql = function sql(sql, testFunc) {
  return function(callback) {
    connection.query(sql, function(err, results) {
      if (err) throw err;
      if (testFunc)
        testFunc(results);
      callback(null);
    });
  };
}

exports.recreateDatabase = function recreateDatabase(options, callback) {
  if (arguments.length === 1) {
    callback = options;
    options = {};
  }

  var dbName = DB_CONFIG.database;
  var series = [
    exports.sql("DROP DATABASE IF EXISTS `" + dbName + "`;"),
    exports.sql("CREATE DATABASE `" + dbName + "`;"),
    exports.sql("USE `" + dbName + "`;")
  ];
  if (options.up) {
    series.push(exports.up());
  }
  async.series(series, function (err, results) {
    if (err) throw err;
    callback(null, results);
  });
};
