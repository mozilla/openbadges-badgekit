var getDb = require('../lib/db').getDb;

module.exports = function getBadgeModel (key) {
  var db = getDb(key);
  try {
    return db.table('badge');
  }
  catch (ex) {
    return db.table('badge', {
      fields: ['name', 'status', 'description', 'criteria']
    });
  }
}