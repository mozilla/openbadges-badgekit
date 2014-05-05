var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `badgeTag` ("
                     + "  id BIGINT AUTO_INCREMENT PRIMARY KEY,"
                     + "  badgeId BIGINT NOT NULL,"
                     + "  value VARCHAR(255),"
                     + "  FOREIGN KEY (badgeId) REFERENCES `badge`(`id`) ON DELETE CASCADE"
                     + ") ENGINE=InnoDB;"),
    db.runSql.bind(db, "ALTER TABLE `badge` DROP COLUMN `tags`;")
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TABLE IF EXISTS `badgeTag`;"),
    db.runSql.bind(db, "ALTER TABLE `badge` ADD `tags` TEXT"),
  ], callback);
};
