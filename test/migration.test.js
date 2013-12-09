var should = require('should');
var async = require('async');
var mysql = require('mysql');
var connection = require('../app/lib/db');
var migrations = require('../lib/migrations');
var migrationDirFiles = require('fs').readdirSync(migrations.dir).sort();
var config = require('../app/lib/config');

function up(options) {
  options.config = config("DATABASE");
  return function(callback) { migrations.up(options, callback); };
}

function down(options) {
  options.config = config("DATABASE");
  return function(callback) { migrations.down(options, callback); };
}

function sqlError(sql, error) {
  return function(callback) {
    connection.query(sql, function(err, results) {
      if (!err)
        throw new Error("expected " + sql + " to throw error");
      err.code.should.equal(error);
      callback(null);
    });
  };
}

function sql(sql, testFunc) {
  return function(callback) {
    connection.query(sql, function(err, results) {
      if (err) throw err;
      if (testFunc)
        testFunc(results);
      callback(null);
    });
  };
}

function findMigration(name) {
  var filename, candidate;
  var previous = null;

  for (var i = 0; i < migrationDirFiles.length; i++) {
    filename = migrationDirFiles[i];
    var match = filename.match(/^([0-9]+)-(.*)\.js$/);
    if (match) {
      candidate = match[1] + '-' + match[2];
      if (match[2] == name)
        return {previous: previous, id: candidate};
      previous = candidate;
    }
  }
  throw new Error("migration not found: " + name);
}

function describeMigration(name, getSeries) {
  var migration = findMigration(name);
  var db = config("DATABASE_DATABASE");
  var series = [
    sql("DROP DATABASE IF EXISTS `" + db + "`;"),
    sql("CREATE DATABASE `" + db + "`;"),
    sql("USE `" + db + "`;")
  ];

  if (!migration.previous)
    migration.previous = "empty database";

  it("should migrate from " + migration.previous + " to " +
       migration.id + " and back", function(done) {
    series = series.concat(getSeries(migration.id, migration.previous));
    async.series(series, function(err) {
      if (err) throw err;
      done();
    });
  });
}

describe('Migrations', function () {

});
