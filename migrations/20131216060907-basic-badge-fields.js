var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "ADD `description` TEXT,"
            + "ADD `criteria` TEXT"
            , callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "DROP COLUMN `description`,"
            + "DROP COLUMN `criteria`"
            , callback);
};
