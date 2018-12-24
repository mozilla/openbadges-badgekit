var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('ALTER TABLE `badge` ADD `studioBrandingLabel` VARCHAR(255)', callback);
};

exports.down = function(db, callback) {
  db.runSql('ALTER TABLE `badge` DROP COLUMN `studioBrandingLabel`', callback);
};
