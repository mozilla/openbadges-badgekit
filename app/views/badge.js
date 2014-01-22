const fs = require('fs');
const path = require('path');
const Badge = require('../models/badge')("DATABASE");
const openbadger = require('../lib/openbadger');
const middleware = require('../middleware');

function getBadgeById(badgeId, callback) {
  // this is a gross way of distinguishing between local and openbadger-hosted badges.
  if (parseInt(badgeId)) {
      Badge.getOne({ id: badgeId }, function(err, row) {
       callback(err, { badge: row });
     });
    }
    else {
      openbadger.getBadge({ id: badgeId }, callback);
    }
}

exports.home = function home (req, res, next) {
  const badgeId = req.params.badgeId;

  getBadgeById(badgeId, function(err, data) {
    if (err)
      return res.send(500, err);

    res.render('badge/home.html', data);
  });
};

exports.edit = function edit (req, res, next) {
  const badgeId = req.params.badgeId;
  const section = req.query.section || 'description';

  getBadgeById(badgeId, function(err, data) {
    if (err)
      return res.send(500, err);

    data.section = section;

    res.render('badge/edit.html', data);
  });
};

exports.save = function save (req, res, next) {
  const timeValue = parseInt(req.body.timeValue);
  const limitNumber = parseInt(req.body.limitNumber);

  const query = { 
    id: req.body.badgeId, 
    name: req.body.name, 
    description: req.body.description, 
    tags: req.body.tags,
    issuerUrl: req.body.issuerUrl,
    earnerDescription: req.body.earnerDescription,
    consumerDescription: req.body.consumerDescription,
    criteria: req.body.criteriaDescription,
    criteriaRequired: req.body.criteriaRequired == 'on' ? 1 : 0,
    criteriaNote: req.body.criteriaNote,
    rubricUrl: req.body.rubricUrl,
    timeValue: timeValue > 0 ? timeValue : 0,
    timeUnits: req.body.timeUnits,
    limit: req.body.limit == 'limit' ? (limitNumber > 0 ? limitNumber : 0) : 0,
    unique: req.body.unique == 'unique' ? 1 : 0,
    multiClaimCode: req.body.multiClaimCode
  };

  Badge.put(query, function (err, result) {
    if (err)
      return res.send(500, err);

    return middleware.redirect('badge', { badgeId: query.id }, 302)(req, res, next);
  });
};

exports.image = function image (req, res, next) {
  res.sendfile(path.join(__dirname, '../static/images/default-badge.png'));
};

exports.renderIssueByEmail = function renderIssueByEmail (req, res, next) {
  const badgeId = req.params.badgeId;

  openbadger.getBadge({ id: badgeId }, function(err, data) {
    if (err)
      return res.send(500, err);

    res.render('badge/issue-by-email.html', data);
  });
};

exports.issueByEmail = function issueByEmail (req, res, next) {
  const query = { 
    learner: {
      email: req.body.email
    },
    badge: req.body.badgeId
  };

  openbadger.awardBadge(query, function(err, data) {
    if (err)
      return res.send(500, err);

    return middleware.redirect('directory', 302)(req, res, next);
  });

};

exports.renderIssueByClaimCode = function renderIssueByClaimCode (req, res, next) {
  const badgeId = req.params.badgeId;

  openbadger.getBadge({ id: badgeId }, function(err, data) {
    if (err)
      return res.send(500, err);

    res.render('badge/issue-by-claim-code.html', data);
  });
};

exports.issueByClaimCode = function issueByClaimCode (req, res, next) {
  // openbadger does not yet support generation of claim codes via its API
  return middleware.redirect('directory', 302)(req, res, next);
};
