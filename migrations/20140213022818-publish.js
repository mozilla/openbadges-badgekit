var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "ADD `published` BOOL NOT NULL DEFAULT FALSE"
            , callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "DROP COLUMN `published`"
            , callback);
};
