var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,        
      "ALTER TABLE `badge` "
      + "ADD `created` TIMESTAMP DEFAULT '2000-01-01 00:00:00',"
      + "ADD `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
    db.runSql.bind(db,        
      "ALTER TABLE `image` "
      + "ADD `lastUpdated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
      + "ADD `url` VARCHAR(255),"
      + "MODIFY `mimetype` VARCHAR(255) NULL,"
      + "MODIFY `data` LONGBLOB NULL"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `criteria` "
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
      "UPDATE `image` "
      + "SET `mimetype`='' WHERE `mimetype` IS NULL"
    ),
    db.runSql.bind(db, 
      "UPDATE `image` "
      + "SET `data`='' WHERE `data` IS NULL"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `image` "
      + "DROP COLUMN `lastUpdated`,"
      + "DROP COLUMN `url`,"
      + "MODIFY `mimetype` VARCHAR(255) NOT NULL,"
      + "MODIFY `data` LONGBLOB NOT NULL"
    ),
    db.runSql.bind(db,        
      "ALTER TABLE `criteria` "
      + "DROP COLUMN `lastUpdated`"
    )], callback);
};
