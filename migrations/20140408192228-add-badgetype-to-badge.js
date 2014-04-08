var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badge` ADD `badgeType` VARCHAR(255)", callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` DROP COLUMN `badgeType`", callback);
};
