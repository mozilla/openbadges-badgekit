var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER TABLE `badge` ADD `studioBranding` VARCHAR(255)', callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE `badge` DROP COLUMN `studioBranding`', callback);
};
