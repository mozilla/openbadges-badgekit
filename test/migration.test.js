var should = require('should');
var async = require('async');
var migrations = require('../lib/migrations');
var migrationDirFiles = require('fs').readdirSync(migrations.dir).sort();
var $ = require('./');

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
  var series = [
    $.recreateDatabase
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

  describeMigration('initial', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(1, "one migration recorded");
        results[0].name.should.equal(id);
      }),
      $.sql("SELECT * FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(0, "migration rolled back");
      }),
      $.sqlError("SELECT * FROM badge", "ER_NO_SUCH_TABLE")
    ];
  });

  describeMigration('basic-badge-fields', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(2, "two migrations recorded");
        results[1].name.should.equal(id);
      }),
      $.sql("SELECT criteria FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(1, "migration rolled back");
      }),
      $.sqlError("SELECT criteria FROM badge", "ER_BAD_FIELD_ERROR")
    ];
  });

  describeMigration('initial-studio-fields', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(3, "three migrations recorded");
        results[2].name.should.equal(id);
      }),
      $.sqlError("SELECT criteria FROM badge", "ER_BAD_FIELD_ERROR"),
      $.sql("SELECT * FROM criteria", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(2, "migration rolled back");
      }),
      $.sql("SELECT criteria FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.sqlError("SELECT * FROM criteria", "ER_NO_SUCH_TABLE")
    ];
  });

  describeMigration('publish', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(4, "four migrations recorded");
        results[3].name.should.equal(id);
      }),
      $.sql("SELECT published FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(3, "migration rolled back");
      }),
      $.sqlError("SELECT published FROM badge", "ER_BAD_FIELD_ERROR")
    ];
  });

  describeMigration('image-table', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(5, "five migrations recorded");
        results[4].name.should.equal(id);
      }),
      $.sql("SELECT imageId FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.sql("SELECT * FROM image", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(4, "migration rolled back");
      }),
      $.sqlError("SELECT imageId FROM badge", "ER_BAD_FIELD_ERROR"),
      $.sqlError("SELECT * FROM image", "ER_NO_SUCH_TABLE")
    ];
  });

  describeMigration('timestamps', function (id, prevId) {
    return [
      $.up({destination: id}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(6, "six migrations recorded");
        results[5].name.should.equal(id);
      }),
      $.sql("SELECT created,lastUpdated FROM badge", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.sql("SELECT lastUpdated FROM image", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.sql("SELECT lastUpdated FROM criteria", function (results) {
        results.should.be.ok;
        results.length.should.equal(0);
      }),
      $.down({count: 1}),
      $.sql("SELECT * FROM migrations", function (results) {
        results.length.should.equal(5, "migration rolled back");
      }),
      $.sqlError("SELECT created FROM badge", "ER_BAD_FIELD_ERROR"),
      $.sqlError("SELECT lastUpdated FROM badge", "ER_BAD_FIELD_ERROR"),
      $.sqlError("SELECT lastUpdated FROM image", "ER_BAD_FIELD_ERROR"),
      $.sqlError("SELECT lastUpdated FROM criteria", "ER_BAD_FIELD_ERROR")
    ];
  });
});
