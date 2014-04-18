var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `badgeCategory` ("
                     + "  id BIGINT AUTO_INCREMENT PRIMARY KEY,"
                     + "  label VARCHAR(128) NOT NULL,"
                     + "  description VARCHAR(255)"
                     + ") ENGINE=InnoDB;"),
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `_badgeCategory` ("
                     + "  id BIGINT AUTO_INCREMENT PRIMARY KEY,"
                     + "  badgeId BIGINT NOT NULL,"
                     + "  categoryId BIGINT NOT NULL,"
                     + "  UNIQUE KEY `badge_and_category` (`badgeId`, `categoryId`),"
                     + "  UNIQUE KEY `category_and_badge` (`categoryId`, `badgeId`)"
                     + ") ENGINE=InnoDB;"),
    db.runSql.bind(db, "INSERT INTO `badgeCategory` (`label`, `description`) VALUES"
                     + "  ('Exploring Earth and Space', 'science-related learning'),"
                     + "  ('Work & Career', 'experiences tied to college and career prep'),"
                     + "  ('Community Action', 'civic participation, citizenship, activism, etc.'),"
                     + "  ('Sports & Wellness', 'athletics, health, and nutrition'),"
                     + "  ('Design & Making', 'design, engineering, building, and creating'),"
                     + "  ('Media & Music', 'media and sound production'),"
                     + "  ('Performing Arts', 'theatre, dance, etc.'),"
                     + "  ('Storytelling', 'writing in all forms and reading'),"
                     + "  ('Coding and Gaming', 'programming, game design, etc.'),"
                     + "  ('Numbers', 'math-related learning'),"
                     + "  ('Zoology', 'all things animals');")
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TABLE IF EXISTS `badgeCategory`;"),
    db.runSql.bind(db, "DROP TABLE IF EXISTS `_badgeCategory`;"),
  ], callback);
};
