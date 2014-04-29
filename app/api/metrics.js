exports.getBadgeMetrics = function getBadgeMetrics (req, res, next) {
  // For a badgeId, or a collection of badgeIds
  // Show
  // * numberOfBadgesIssued
  // * numberOfDistinctBadgeRecipients
  // * numberOfBadgesClaimed
  // * numberOfDistinctClaimants
  // Allow filter by FROM and TO dates
  // PERMISSIONS restric this to badges authorized to report on
  res.json({"metrics":"42"});
};
