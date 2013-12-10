var getDB = require('../lib/db');

module.exports = function getBadgeModel (key) {
  var db = getDB(key);
  try {
    return db.table('badge');
  }
  catch (ex) {
    return db.table('badge', {
      fields: ['name', 'status']
    });
  }
}