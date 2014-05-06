var getDb = require('../lib/db').getDb;

module.exports = function getBadgeTagModel (key) {
  var db = getDb(key);

  var BadgeTag = db.table('badgeTag', {
    fields: [
      'id',
      'value'
    ]
  });

  return BadgeTag;
};

