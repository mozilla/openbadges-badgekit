var db = require('../lib/db')();

module.exports = db.table('badge', {
  fields: ['name', 'status']
});