var getDb = require('../lib/db').getDb;
var async = require('async');

var AccountPermission = require('./account-permission')("DATABASE");

module.exports = function getAccountModel (key) {
  var db = getDb(key);

  var Account = db.table('account', {
    fields: 
      ['id',
       'email'],
    relationships: {
      accountPermissions: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'accountPermission', key: 'accountId' }
      }
    },
    methods: {
      hasPermission: hasPermission,
      setPermission: setPermission
    }
  });


  function hasPermission(context, action) {
    if (action == 'view') {
      if (this.accountPermissions) {
        var canView = false;
        this.accountPermissions.forEach(function(permission) {
          if ((context.system === permission.system) &&
              (!context.issuer || !permission.issuer || (context.issuer === permission.issuer)) &&
              (!context.program || !permission.program || (context.program === permission.program))) {
            canView = true;
          }
        });
        return canView;
      }
    }
    else {
      var bestMatch = null;

      if (this.accountPermissions) {
        this.accountPermissions.forEach(function(permission) {
          if ((!permission.system || (context.system === permission.system)) &&
              (!permission.issuer || (context.issuer === permission.issuer)) &&
              (!permission.program || (context.program === permission.program))) {
            if ((!bestMatch) ||
                (permission.program) ||
                (permission.issuer && !bestMatch.issuer) ||
                (permission.system && !bestMatch.system)) {
              bestMatch = permission;
            }
          }
        });
      }

      if (bestMatch) {
        switch (action) {
          case 'draft':
            return bestMatch.canDraft;
          case 'publish':
            return bestMatch.canPublish;
          case 'review':
            return bestMatch.canReview;
          case 'admin':
            return bestMatch.canPublish;
          default:
            return false;
        }
      }
    }

    return false;
  }

  function setPermission(context, permissions, callback) {
    var query = { accountId: this.id,
                    system: context.system,
                    issuer: context.issuer,
                    program: context.program };

    if (permissions) {
      AccountPermission.getOne(query, function(err, row) {
        if (err)
          return callback(err);

        if (row) {
          query.id = row.id;
        }

        query.canDraft = permissions.canDraft || false;
        query.canPublish = permissions.canPublish || false;
        query.canReview = permissions.canReview || false;

        return AccountPermission.put(query, callback);
      });
    }
    else {
      return AccountPermission.del(query, callback);
      // note that even when the last permission is deleted, the account will remain.  I THINK this is the correct behavior, so as to
      // not detach any potential references if we later add the same user again, but I figured I'd note this behavior here.
    }
  }

  return Account;
};

