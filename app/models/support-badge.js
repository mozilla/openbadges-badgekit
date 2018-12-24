var getDb = require('../lib/db').getDb;

module.exports = function getSupportBadgeModel (key) {
  var db = getDb(key);

  var SupportBadge = db.table('supportBadge', {
    fields: [
      'id',
      'primaryBadgeId',
      'supportBadgeSlug'
    ]
  });

  return SupportBadge;
};

