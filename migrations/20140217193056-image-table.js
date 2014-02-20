var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,        
      "CREATE TABLE IF NOT EXISTS `image` ("
      + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"
      + "mimetype         VARCHAR(255) NOT NULL,"
      + "data             LONGBLOB NOT NULL"
      + ") ENGINE=InnoDB"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "ADD `imageId` BIGINT,"
      + "ADD `studioShape` VARCHAR(255),"
      + "ADD `studioBackground` VARCHAR(255),"
      + "ADD `studioTextType` VARCHAR(255),"
      + "ADD `studioTextContents` VARCHAR(255),"
      + "ADD `studioIcon` VARCHAR(255),"
      + "ADD `studioColor` VARCHAR(255),"
      + "ADD CONSTRAINT `image_fk` FOREIGN KEY (imageId) REFERENCES image(id)"
    )], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "DROP FOREIGN KEY `image_fk`,"
      + "DROP COLUMN `imageId`,"
      + "DROP COLUMN `studioShape`,"
      + "DROP COLUMN `studioBackground`,"
      + "DROP COLUMN `studioTextType`,"
      + "DROP COLUMN `studioTextContents`,"
      + "DROP COLUMN `studioIcon`,"
      + "DROP COLUMN `studioColor`"
    ),
    db.runSql.bind(db,        
      "DROP TABLE IF EXISTS `image`"
    )], callback);
};
