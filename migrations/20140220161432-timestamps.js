var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,        
      "ALTER TABLE `badge` "
      + "ADD `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
      + "ADD `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
    db.runSql.bind(db,        
      "ALTER TABLE `image` "
      + "ADD `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
      + "ADD `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `criteria` "
      + "ADD `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
      + "ADD `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    )], callback);
};

exports.down = function(db, callback) {
async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "DROP COLUMN `created`,"
      + "DROP COLUMN `lastUpdated`"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `image` "
      + "DROP COLUMN `created`,"
      + "DROP COLUMN `lastUpdated`"
    ),
    db.runSql.bind(db,        
      "ALTER TABLE `criteria` "
      + "DROP COLUMN `created`,"
      + "DROP COLUMN `lastUpdated`"
    )], callback);
};
