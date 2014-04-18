var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getBadgeCategoryModel (key) {
  var db = getDb(key);

  var BadgeCategory = db.table('badgeCategory', {
    fields: [
      'id',
      'label',
      'description'
    ]
  });

  return BadgeCategory;
};

