var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `alignment` ("
                     + "  id BIGINT AUTO_INCREMENT PRIMARY KEY,"
                     + "  badgeId BIGINT NOT NULL,"
                     + "  name TEXT,"
                     + "  url TEXT,"
                     + "  description TEXT,"
                     + "  FOREIGN KEY (badgeId) REFERENCES `badge`(`id`) ON DELETE CASCADE"
                     + ") ENGINE=InnoDB;"),
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TABLE IF EXISTS `alignment`;"),
  ], callback);
};
