var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getBadgeModel (key) {
  function setCriteria(criteria, callback) {
    var criteriaIds = [];
    const badgeId = this.id;

    async.each(criteria, function(criterion, innerCallback) {
      criterion.badgeId = badgeId;
      Criteria.put(criterion, function(err, result) {
        if (err)
          return innerCallback(err);

        if (result.insertId) {
          criteriaIds.push(result.insertId);
        }
        else {
          criteriaIds.push(result.row.id);
        }

        return innerCallback();
      });
    },
    function(err) {
      const deleteQuery = { 
        badgeId: {
          value: badgeId,
          op: '='
        },
        id: criteriaIds.map(function(criterionId) {
          return {
            op: '!=',
            value: criterionId
          };
        })
      };

      Criteria.del(deleteQuery, function(err) {
        return callback(err);
      });
    });
  };

  var db = getDb(key);

  var Criteria = db.table('criteria', {
    fields: 
      ['id',
       'description',
       'badgeId',
       'required', 
       'note']
  });

  return db.table('badge', {
    fields: 
      ['id',
       'name', 
       'status', 
       'description', 
       'issuerUrl', 
       'earnerDescription', 
       'consumerDescription', 
       'tags', 
       'rubricUrl',
       'timeValue',
       'timeUnits',
       'limit',
       'multiClaimCode',
       'unique'],
    relationships: {
      criteria: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'criteria', key: 'badgeId' }
      }
    },
    methods: {
      setCriteria: setCriteria
    }
  });
}
