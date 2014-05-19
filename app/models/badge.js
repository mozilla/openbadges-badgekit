var getDb = require('../lib/db').getDb;
var async = require('async');
var crypto = require('crypto');

function randomStr (len) {
  const characters = '0123456789abcdef';
  const rand = new Buffer(len);
  const bytes = crypto.randomBytes(len);
  for (var i = 0; i < bytes.length; i++)
    rand[i] = characters[bytes[i] % characters.length].charCodeAt(0);
  return rand.toString('utf8');
}

module.exports = function getBadgeModel (key) {
  var BadgeCategory = require('./badge-category')(key);
  var BadgeTag = require('./badge-tag')(key);
  var SupportBadge = require('./support-badge')(key);

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

  function setTags(tags, callback) {
    const badgeId = this.id;

    if (!Array.isArray(tags)) {
      tags = tags.split(',')
                 .map(function (tag) { return tag.trim() })
                 .filter(function (tag) { return tag.length });
    }
    else {
      tags = tags.map(function (tag) { return tag.value || tag });
    }

    BadgeTag.del({badgeId: badgeId}, function (err) {
      if (err)
        return callback(err);

      const stream = BadgeTag.createWriteStream();

      stream.on('error', function (err) {
        callback(err);
        callback = function () {};
      });

      stream.on('close', function () {
        callback(null);
      });

      tags.forEach(function (tag, pos) {
        // Filter out duplicate values
        if (tags.indexOf(tag) !== pos)
          return;

        stream.write({badgeId: badgeId, value: tag});
      });

      stream.end();
    });
  }

  function setSupportBadges(supportBadges, callback) {
    const badgeId = this.id;

    var supportSlugs = supportBadges.map(function (supportBadge) { return supportBadge.supportBadgeSlug || supportBadge });

    SupportBadge.del({primaryBadgeId: badgeId}, function (err) {
      if (err)
        return callback(err);

      const stream = SupportBadge.createWriteStream();

      stream.on('error', function (err) {
        callback(err);
        callback = function () {};
      });

      stream.on('close', function () {
        callback(null);
      });

      supportSlugs.forEach(function (supportSlug, pos) {
        // Filter out duplicate values
        if (supportSlugs.indexOf(supportSlug) !== pos)
          return;

        stream.write({primaryBadgeId: badgeId, supportBadgeSlug: supportSlug});
      });

      stream.end();
    });
  }

  function setCategories(categories, callback) {
    const badgeId = this.id;

    if (!Array.isArray(categories))
      categories = [categories];

    var categoryIds = [];
    async.each(categories, function(category, innerCallback) {
      if (isNaN(parseInt(category))) {
        BadgeCategory.getOne({ label: category }, function(err, categoryRow) {
          if (err)
            return innerCallback(err);

          if (!categoryRow)
            return innerCallback();

          // this doesn't preserve order of categoryIds from the original categories array.
          // don't think that matters, but noting it here just in case.
          categoryIds.push(categoryRow.id);
          return innerCallback();
        });
      }
      else {
        categoryIds.push(category);
        return innerCallback();
      }
    },
    function(err) {
      Category.del({badgeId: badgeId}, function (err) {
        if (err)
          return callback(err);

        const stream = Category.createWriteStream();

        stream.on('error', function (err) {
          callback(err);
          callback = function () {};
        });

        stream.on('close', function () {
          callback(null);
        });

        categoryIds.forEach(function (categoryId, pos) {
          // Filter out empty and duplicate values
          if (isNaN(parseInt(categoryId)) || categoryIds.indexOf(categoryId) !== pos)
            return;

          stream.write({badgeId: badgeId, categoryId: categoryId});
        });

        stream.end();
      });
    });
  }

  function createCopy(overrides, callback) {
    var badge = JSON.parse(JSON.stringify(this));

    for (var property in overrides) {
      badge[property] = overrides[property];
    }

    delete badge.id;
    badge.slug = Badge.generateSlug();

    var criteria = badge.criteria;
    criteria.forEach(function(criterion) {
      delete criterion.badgeId;
      delete criterion.id;
    });

    delete badge.criteria;

    var categories = (badge.categories || []).map(function (category) {
      return category.id;
    });

    delete badge.categories;

    var tags = (badge.tags || []).map(function (tag) {
      return tag.value;
    });

    delete badge.tags;

    var supportBadges = (badge.supportBadges || []).map(function (supportBadge) {
      return supportBadge.supportBadgeSlug;
    });

    delete badge.supportBadges;

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

          async.series([
            row.setCriteria.bind(row, criteria),
            row.setCategories.bind(row, categories),
            row.setTags.bind(row, tags),
            row.setSupportBadges.bind(row, supportBadges),
          ], function (err) {
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

  var Category = db.table('_badgeCategory', {
    fields: ['badgeId', 'categoryId']
  });

  var Badge = db.table('badge', {
    fields:
      ['id',
       'slug',
       'name',
       'status',
       'description',
       'issuerUrl',
       'earnerDescription',
       'consumerDescription',
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
       'program',
       'badgeType',
       'studioBranding',
       'studioBrandingLabel',
       'milestoneNumRequired',
       'milestoneAction',
       'isMilestone',
      ],
    relationships: {
      criteria: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'criteria', key: 'badgeId' }
      },
      categories: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'badgeCategory', key: 'id' },
        via: { table: '_badgeCategory', local: 'badgeId', foreign: 'categoryId' }
      },
      tags: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'badgeTag', key: 'badgeId' }
      },
      image: {
        type: 'hasOne',
        local: 'imageId',
        foreign: { table: 'image', key: 'id' },
        optional: true
      },
      supportBadges: {
        type: 'hasMany',
        local: 'id',
        foreign: { table: 'supportBadge', key: 'primaryBadgeId' }
      }
    },
    methods: {
      setCriteria: setCriteria,
      setTags: setTags,
      setCategories: setCategories,
      setSupportBadges: setSupportBadges,
      createCopy: createCopy,
      del: deleteBadge
    }
  });

  Badge.generateSlug = randomStr.bind(null, 16);

  return Badge;
};

