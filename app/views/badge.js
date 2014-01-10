const fs = require('fs');
const path = require('path');
const Badge = require('../models/badge')("DATABASE");
const openbadger = require('../lib/openbadger');
const middleware = require('../middleware');

exports.home = function home (req, res, next) {
  const badgeId = req.params.badgeId;

  if (parseInt(badgeId)) {
    Badge.getOne({ id: req.params.badgeId }, function(err, row) {
      if (err) 
        return res.send(500, err);

      res.render('badge/home.html', { badge: row });
    });
  }
  else {
    openbadger.getBadge({ id: badgeId }, function(err, data) {
      if (err)
        return res.send(500, err);

      res.render('badge/home.html', data);
    });
  }
};

exports.save = function save (req, res, next) {
  const query = { 
    id: req.body.badgeId, 
    name: req.body.name, 
    description: req.body.description, 
    criteria: req.body.criteria
  };

  Badge.put(query, function (err, result) {
    if (err)
      return res.send(500, err);

    return middleware.redirect('directory', 302)(req, res, next);
  });
};

exports.image = function image (req, res, next) {
  res.sendfile(path.join(__dirname, '../static/images/default-badge.png'));
};

