var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "ADD `system` VARCHAR(255) NOT NULL DEFAULT 'badgekit',"
      + "ADD `issuer` VARCHAR(255) NULL,"
      + "ADD `program` VARCHAR(255) NULL"
    ),
    db.runSql.bind(db,        
      "CREATE TABLE IF NOT EXISTS `account` ("
      + "`id`               BIGINT AUTO_INCREMENT PRIMARY KEY,"
      + "`email`            VARCHAR(255) NOT NULL UNIQUE,"
      + "INDEX `email_idx`(`email`)"
      + ") ENGINE=InnoDB;"
    ),
    db.runSql.bind(db, 
      "CREATE TABLE IF NOT EXISTS `accountPermission` ("
      + "`id`               BIGINT AUTO_INCREMENT PRIMARY KEY,"
      + "`accountId`        BIGINT,"
      + "`system`           VARCHAR(255) NULL,"
      + "`issuer`           VARCHAR(255) NULL,"
      + "`program`          VARCHAR(255) NULL,"
      + "`canDraft`         BOOLEAN NOT NULL DEFAULT FALSE,"
      + "`canPublish`       BOOLEAN NOT NULL DEFAULT FALSE,"
      + "`canReview`        BOOLEAN NOT NULL DEFAULT FALSE,"
      + "CONSTRAINT `account_fk` FOREIGN KEY (accountId) REFERENCES `account`(id)"
      + ") ENGINE=InnoDB;"
    )], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "DROP COLUMN `system`,"
      + "DROP COLUMN `issuer`,"
      + "DROP COLUMN `program`"
    ),
    db.runSql.bind(db,        
      "DROP TABLE IF EXISTS `accountPermission`"
    ),
    db.runSql.bind(db,        
      "DROP TABLE IF EXISTS `account`"
    )], callback);
};
