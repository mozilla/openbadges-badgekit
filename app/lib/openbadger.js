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
  newBadge.evidenceType = badge.evidenceType;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  newBadge.imageUrl = badge.imageUrl;
  newBadge.issuerUrl = badge.issuerUrl;
  newBadge.criteria = badge.criteria;
  newBadge.alignments = badge.alignments;
  newBadge.created = new Date(badge.created);
  newBadge.lastUpdated = new Date(badge.created); // not a typo.  badgekit-api doesn't yet have a notion of last updated.
  newBadge.badgeType = badge.type;
  newBadge.categories = badge.categories || [];
  newBadge.tags = badge.tags || [];
  newBadge.system = badge.system ? badge.system.slug : null;
  newBadge.issuer = badge.issuer ? badge.issuer.slug : null;
  newBadge.program = badge.program ? badge.program.slug : null;
  
  var milestone = badge.milestones.length ? badge.milestones[0] : null;
  var supportBadges = milestone ? milestone.supportBadges : null;

  newBadge.milestoneNumRequired = milestone ? milestone.numberRequired : null;
  newBadge.milestoneAction = milestone ? milestone.action : 'issue';
  newBadge.isMilestone = milestone ? 1 : 0;
  newBadge.supportBadges = (supportBadges || []).map(function (supportBadge) {
    return { supportBadgeSlug: supportBadge.slug, imageUrl: supportBadge.imageUrl };
  });

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
  newBadge.criteriaUrl = config('PERSONA_AUDIENCE') + '/system/' + badge.system + '/badge/' + newBadge.slug + '/criteria';
  newBadge.timeValue = badge.timeValue;
  newBadge.timeUnits = badge.timeUnits;
  newBadge.evidenceType = badge.evidenceType;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  newBadge.criteria = badge.criteria;
  newBadge.criteria.forEach(function(criterion) {
    delete criterion.badgeId;
    delete criterion.id;
  });
  newBadge.alignments = badge.alignments;
  newBadge.alignments.forEach(function(alignment) {
    delete alignment.badgeId;
    delete alignment.id;
  });

  newBadge.type = badge.badgeType;
  newBadge.categories = (badge.categories || []).map(function (category) {
    return category.label;
  });
  newBadge.tags = (badge.tags || []).map(function (tag) {
    return tag.value;
  });
  return newBadge;
};
