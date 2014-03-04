var config = require('./config');

exports = module.exports = require('badgekit-api-client')(
  config('OPENBADGER_URL'),
  config('OPENBADGER_SECRET')
);

module.exports.makeContext = function makeContext(context) {
  context = context || {};
  context.system = config('OPENBADGER_SYSTEM');
  return context;
}
module.exports.toBadgekitBadge = function toBadgekitBadge(badge) {
  var newBadge = {};
  newBadge.id = badge.slug;
  newBadge.description = badge.strapline;
  newBadge.name = badge.name;
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
  newBadge.timeValue = badge.timeValue;
  newBadge.timeUnits = badge.timeUnits;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  newBadge.criteria = badge.criteria;
  newBadge.criteria.forEach(function(criterion) {
    delete criterion.badgeId;
    delete criterion.id;
  });
  
  return newBadge;
};
