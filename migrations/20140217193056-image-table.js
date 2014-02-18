var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db,        
      "CREATE TABLE IF NOT EXISTS `image` ("
      + "id               BIGINT AUTO_INCREMENT PRIMARY KEY,"
      + "mimetype         VARCHAR(255),"
      + "data             LONGBLOB"
      + ") ENGINE=InnoDB"
    ),
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "ADD `imageId` BIGINT,"
      + "ADD CONSTRAINT `image_fk` FOREIGN KEY (imageId) REFERENCES image(id)"
    )], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, 
      "ALTER TABLE `badge` "
      + "DROP FOREIGN KEY `image_fk`,"
      + "DROP COLUMN `imageId`"
    ),
    db.runSql.bind(db,        
      "DROP TABLE IF EXISTS `image`"
    )], callback);
};
