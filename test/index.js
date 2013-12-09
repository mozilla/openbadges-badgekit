var async = require('async');
var migrations = require('../lib/migrations');
var config = require('../app/lib/config');
var connection = require('../app/lib/db');

exports.up = function up(options) {
  options = options || {};
  if (!options.config)
    options.config = config("DATABASE");
  return function(callback) { migrations.up(options, callback); };
}

exports.down = function down(options) {
  options = options || {};
  if (!options.config)
    options.config = config("DATABASE");
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

  var db = config("DATABASE_DATABASE");
  var series = [
    exports.sql("DROP DATABASE IF EXISTS `" + db + "`;"),
    exports.sql("CREATE DATABASE `" + db + "`;"),
    exports.sql("USE `" + db + "`;")
  ];
  if (options.up) {
    series.push(migrations.up);
  }
  async.series(series, function (err, results) {
    if (err) throw err;
    callback(null, results);
  });
};
