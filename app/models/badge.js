var getDB = require('../lib/db');

module.exports = function getBadgeModel (key) {
  key = key || "DATABASE";
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