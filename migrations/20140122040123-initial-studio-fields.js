var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "ADD `issuerUrl` TEXT,"
            + "ADD `earnerDescription` TEXT,"
            + "ADD `consumerDescription` TEXT,"
            + "ADD `tags` TEXT,"
            + "ADD `criteriaRequired` BOOL NOT NULL DEFAULT FALSE,"
            + "ADD `criteriaNote` TEXT,"
            + "ADD `rubricUrl` TEXT,"
            + "ADD `timeValue` INT,"
            + "ADD `timeUnits` ENUM('minutes', 'hours', 'days', 'weeks'),"
            + "ADD `limit` INT,"
            + "ADD `multiClaimCode` TEXT,"
            + "ADD `unique` BOOL NOT NULL DEFAULT FALSE"
            , callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
            + "DROP COLUMN `issuerUrl`,"
            + "DROP COLUMN `earnerDescription`,"
            + "DROP COLUMN `consumerDescription`,"
            + "DROP COLUMN `tags`,"
            + "DROP COLUMN `criteriaRequired`,"
            + "DROP COLUMN `criteriaNote`,"
            + "DROP COLUMN `rubricUrl`,"
            + "DROP COLUMN `timeValue`,"
            + "DROP COLUMN `timeUnits`,"
            + "DROP COLUMN `limit`,"
            + "DROP COLUMN `multiClaimCode`,"
            + "DROP COLUMN `unique`"
            , callback);
};
