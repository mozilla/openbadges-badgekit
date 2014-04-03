var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getBadgeModel (key) {
  var Image = require('./image')(key);

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
  }

  function createCopy(overrides, callback) {
    var badge = JSON.parse(JSON.stringify(this));

    for (var property in overrides) {
      badge[property] = overrides[property];
    }

    delete badge.id;

    var criteria = badge.criteria;
    criteria.forEach(function(criterion) {
      delete criterion.badgeId;
      delete criterion.id;
    });
    
    delete badge.criteria;
    badge.created = new Date();
    delete badge.lastUpdated;
    if (badge.image && (badge.image.id !== null)) {
      var newImage = { mimetype: badge.image.mimetype,
                       data: badge.image.data ? new Buffer(badge.image.data) : null,
                       url: badge.image.url };
      Image.put(newImage, function (err, result) {
        if (err)
          return callback(err);
        putBadge(result.insertId);
      });
    }
    else {
      putBadge();
    }

    function putBadge(newImageId) {
      if (newImageId !== null)
        badge.imageId = newImageId;

      delete badge.image;
      Badge.put(badge, function (err, result) {
        if (err)
          return callback(err);

        Badge.getOne({ id: result.insertId }, function(err, row) {
          if (err)
            return callback(err);

          row.setCriteria(criteria, function(err) {
            callback(err, row);
          });
        });
      });
    }
  }

  function deleteBadge(callback) {
    const badgeId = this.id;
    
    Criteria.del({ badgeId: badgeId }, function (err) {
      if (err) 
        return callback(err);
      
      Badge.del({ id: badgeId }, function (err) {
        return callback(err);
      });
    });
  }

  var db = getDb(key);

  var Criteria = db.table('criteria', {
    fields: 
      ['id',
       'description',
       'badgeId',
       'required', 
       'note']
  });

  var Badge = db.table('badge', {
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
       'unique', 
       'published',
       'imageId',
       'studioShape',
       'studioBackground',
       'studioTextType',
       'studioTextContents',
       'studioIcon',
       'studioColor',
       'created',
       'lastUpdated',
       'system',
       'issuer',
       'program'],
    relationships: {
      criteria: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'criteria', key: 'badgeId' }
      },
      image: {
        type: 'hasOne',
        local: 'imageId',
        foreign: { table: 'image', key: 'id' },
        optional: true
      }
    },
    methods: {
      setCriteria: setCriteria,
      createCopy: createCopy,
      del: deleteBadge
    }
  });

  return Badge;
};

