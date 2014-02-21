var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "ADD `issuerUrl` TEXT,"
      + "ADD `earnerDescription` TEXT,"
      + "ADD `consumerDescription` TEXT,"
      + "ADD `tags` TEXT,"
      + "ADD `rubricUrl` TEXT,"
      + "ADD `timeValue` INT,"
      + "ADD `timeUnits` ENUM('minutes', 'hours', 'days', 'weeks'),"
      + "ADD `limit` INT,"
      + "ADD `multiClaimCode` TEXT,"
      + "ADD `unique` BOOL NOT NULL DEFAULT FALSE,"
      + "DROP COLUMN `criteria`"
    ),
    db.runSql.bind(db,        
      "CREATE TABLE IF NOT EXISTS `criteria` ("
      + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"
      + "badgeId          BIGINT,"
      + "description      TEXT,"
      + "note             TEXT,"
      + "required         BOOL NOT NULL DEFAULT FALSE,"
      + "FOREIGN KEY (badgeId) REFERENCES badge(id)"
      + ") ENGINE=InnoDB"
    )], callback);
};

exports.down = function(db, callback) {
    async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "DROP COLUMN `issuerUrl`,"
      + "DROP COLUMN `earnerDescription`,"
      + "DROP COLUMN `consumerDescription`,"
      + "DROP COLUMN `tags`,"
      + "DROP COLUMN `rubricUrl`,"
      + "DROP COLUMN `timeValue`,"
      + "DROP COLUMN `timeUnits`,"
      + "DROP COLUMN `limit`,"
      + "DROP COLUMN `multiClaimCode`,"
      + "DROP COLUMN `unique`,"
      + "ADD `criteria` TEXT"
    ),
    db.runSql.bind(db,        
      "DROP TABLE IF EXISTS `criteria`"
    )], callback);
};
