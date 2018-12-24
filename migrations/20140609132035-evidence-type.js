var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
          + "  ADD `evidenceType` ENUM('URL', 'Text', 'Photo', 'Video', 'Sound') "
          , callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badge` "
          + "  DROP COLUMN `evidenceType`"
          , callback);
};
