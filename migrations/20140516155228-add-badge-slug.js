var async = require('async');
var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "ALTER TABLE `badge`"
                     + "  ADD `slug` VARCHAR(16);"),
    db.runSql.bind(db, "UPDATE `badge`"
                     + "  SET `slug` = SUBSTR(MD5(UUID()),-16)"
                     + "  WHERE `slug` IS NULL;")
  ], callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "DROP COLUMN `slug`"
            , callback);
};
