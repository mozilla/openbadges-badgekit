var config = require('./config');

exports = module.exports = require('badgekit-issue-client')(
  config('OPENBADGER_URL')
);

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
  newBadge.timeValue = badge.timeValue;
  newBadge.timeUnits = badge.timeUnits;
  newBadge.limit = badge.limit;
  newBadge.unique = badge.unique;
  
  return newBadge;
};
