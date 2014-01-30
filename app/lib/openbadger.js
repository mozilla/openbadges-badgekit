var config = require('./config');

exports = module.exports = require('badgekit-issue-client')(
  config('OPENBADGER_URL')
);

module.exports.convertBadgeFormat = function convertBadgeFormat(badge) {
  badge.id = badge.slug;
  badge.description = badge.strapline;
  return badge;
};