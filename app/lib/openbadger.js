var config = require('./config');

exports = module.exports = require('badgekit-issue-client')(
  config('OPENBADGER_URL')
);

module.exports.toBadgekitBadge = function toBadgekitBadge(badge) {
  var newBadge = {};
  newBadge.id = badge.slug;
  newBadge.description = badge.strapline;
  newBadge.name = badge.name;
  newBadge.earnerDescription = badge.description;
  newBadge.consumerDescription = badge.description;

  return newBadge;
};

module.exports.toOpenbadgerBadge = function toOpenbadgerBadge(badge) {
  var newBadge = {};
  newBadge.name = badge.name;
  newBadge.slug = badge.name.trim().toLowerCase().replace(/\s+/g, '-');
  newBadge.strapline = badge.description || ' ';
  // fix this when badge images exist
  newBadge.imageUrl = config('PERSONA_AUDIENCE') + '/images/badge/' + badge.id + '.png';
  newBadge.description = badge.earnerDescription || newBadge.strapline;

  return newBadge;
};
