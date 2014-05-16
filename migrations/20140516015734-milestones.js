var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `supportBadge` ("
                     + "  id BIGINT AUTO_INCREMENT PRIMARY KEY,"
                     + "  primaryBadgeId BIGINT NOT NULL,"
                     + "  supportBadgeSlug VARCHAR(255) NOT NULL,"
                     + "  FOREIGN KEY (primaryBadgeId) REFERENCES `badge`(`id`) ON DELETE CASCADE,"
                     + "  UNIQUE KEY `primary_and_support` (`primaryBadgeId`, `supportBadgeSlug`)"
                     + ") ENGINE=InnoDB"),
    db.runSql.bind(db, "ALTER TABLE `badge`"
                     + " ADD `milestoneNumRequired` INT,"
                     + " ADD `milestoneAction` ENUM('issue', 'queue-application') NOT NULL DEFAULT 'issue',"
                     + " ADD `isMilestone` BOOLEAN NOT NULL DEFAULT FALSE")
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TABLE IF EXISTS `supportBadge`"),
    db.runSql.bind(db, "ALTER TABLE `badge`"
                      + " DROP COLUMN `milestoneNumRequired`,"
                      + " DROP COLUMN `milestoneAction`,"
                      + " DROP COLUMN `isMilestone`")
  ], callback);
};
