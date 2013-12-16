const openbadger = require('../lib/openbadger');
const Badge = require('../models/badge')("DATABASE");
const async = require('async');
const middleware = require('../middleware');

const PAGE_SIZE = 12;

exports.home = function home (req, res, next) {
  const pageNum = parseInt(req.query.page) || 1;

  async.parallel({
    active: function (callback) {
      openbadger.getAllBadges(function (err, data) {
        callback(err, data);
      });
    },
    inactive: function (callback) {
      Badge.get({}, function (err, rows) {
        callback(err, rows);
      });
    }
  },
  function (err, results) {
    if (err)
      return res.send(500, err);

    var badges = results.inactive.concat(results.active.badges);

    const startIndex = (pageNum-1) * PAGE_SIZE;
    const pages = Math.ceil(badges.length / PAGE_SIZE);

    badges = badges.slice(startIndex, startIndex + PAGE_SIZE);

    return res.render('directory/home.html', { badges: badges, page: pageNum, pages: pages });
  });
};

exports.addBadge = function addBadge (req, res, next) {
  Badge.put({ name: 'New Badge', status: 'draft' }, function (err, result) {
    return middleware.redirect('directory', 302)(req, res, next);
  });
};