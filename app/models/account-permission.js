var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getAccountModel (key) {
  var db = getDb(key);

  var AccountPermission = db.table('accountPermission', {
    fields:
      ['id',
       'accountId',
       'system',
       'issuer',
       'program',
       'canDraft',
       'canPublish',
       'canReview'],
    relationships: {
      account: {
        type: 'hasOne',
        local: 'accountId',
        foreign: { table: 'account', key: 'id' }
      }
    }
  });

  return AccountPermission;
};

