var config = require('./config');

exports = module.exports = require('badgekit-api-client')(
  config('OPENBADGER_URL'),
  config('OPENBADGER_SECRET')
);

module.exports.toBadgekitBadge = function toBadgekitBadge(badge) {
  var newBadge = {};
  newBadge.id = badge.slug;
  newBadge.description = badge.strapline;
  newBadge.name = badge.name;
  newBadge.status = badge.archived ? 'archived' : 'published';
  newBadge.earnerDescription = badge.earnerDescription;
  newBadge.consumerDescription = badge.consumerDescription;
  newBadge.rubricUrl = badge.rubricUrl;
  newBadge.timeValue = badge.timeValue;
  newBadge.timeUnits = badge.timeUnits;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  newBadge.imageUrl = badge.imageUrl;
  newBadge.issuerUrl = badge.issuerUrl;
  newBadge.criteria = badge.criteria;
  newBadge.created = new Date(badge.created);
  newBadge.lastUpdated = new Date(badge.created); // not a typo.  badgekit-api doesn't yet have a notion of last updated.
  newBadge.type = badge.type;
  newBadge.categories = badge.categories || [];

  return newBadge;
};

module.exports.toOpenbadgerBadge = function toOpenbadgerBadge(badge) {
  var newBadge = {};
  newBadge.name = badge.name;
  newBadge.slug = badge.name.trim().toLowerCase().replace(/\s+/g, '-');
  newBadge.strapline = badge.description || ' ';
  // openbadger-issue-client doesn't yet support uploading an image file, so for now we're keeping the images in the badgekit db
  newBadge.imageUrl = config('PERSONA_AUDIENCE') + '/images/badge/' + badge.id;
  newBadge.earnerDescription = badge.earnerDescription;
  newBadge.consumerDescription = badge.consumerDescription;
  newBadge.rubricUrl = badge.rubricUrl;
  newBadge.issuerUrl = badge.issuerUrl;
  newBadge.criteriaUrl = config('PERSONA_AUDIENCE') + '/badge/' + newBadge.slug + '/criteria';
  newBadge.timeValue = badge.timeValue;
  newBadge.timeUnits = badge.timeUnits;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  newBadge.criteria = badge.criteria;
  newBadge.criteria.forEach(function(criterion) {
    delete criterion.badgeId;
    delete criterion.id;
  });
  newBadge.type = badge.badgeType;
  newBadge.categories = (badge.categories || []).map(function (category) {
    return category.label;
  });
  
  return newBadge;
};
