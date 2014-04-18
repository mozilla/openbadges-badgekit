var getDb = require('../lib/db').getDb;

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

