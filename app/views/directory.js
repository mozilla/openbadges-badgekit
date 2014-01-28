const openbadger = require('../lib/openbadger');
const Badge = require('../models/badge')("DATABASE");
const async = require('async');
const middleware = require('../middleware');
const url = require('url');

const PAGE_SIZE = 12;

exports.home = function home (req, res, next) {
  function handleResults (err, badges) {
    if (err)
      return res.send(500, err);

    switch (sort) {
      case 'name':
        badges.sort(function(a,b) { return (a.name > b.name) ? 1 : -1 });
        break;
      case 'applications':
        // to be implemented
        break;
      case 'awarded':
        // to be implemented
        break;
      case 'dateactive':
        // to be implemented
        break;
      case 'datecreated':
        // to be implemented
        break;
    }

    const startIndex = (pageNum-1) * PAGE_SIZE;
    const pages = Math.ceil(badges.length / PAGE_SIZE);

    badges = badges.slice(startIndex, startIndex + PAGE_SIZE);

    // If the user was redirected here after creating a new
    // badge, we pass the ID of that badge to the template
    // so we can highlight it with CSS.
    const lastCreatedId = req.session.lastCreatedId;
    delete req.session.lastCreatedId;

    return res.render('directory/home.html', {
      badges: badges,
      page: pageNum,
      pages: pages,
      category: category,
      sort: sort,
      lastCreatedId: lastCreatedId
    });
  }

  const pageNum = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || 'draft';
  const sort = req.query.sort;

  switch (category) {
    case 'published':
      openbadger.getAllBadges(function (err, data) {
        handleResults(err, data.badges);
      });
      break;
    case 'archived':
      // openbadger does not yet have a concept of archived badges
      handleResults(null, []);
      break;
    case 'template':
      Badge.get({ status: 'template' }, handleResults);
      break;
    default:
      Badge.get({ status: 'draft' }, handleResults);
      break;
  }
};

exports.addBadge = function addBadge (req, res, next) {
  const category  = req.query.category || 'draft';

  Badge.put({ name: 'New Badge', status: category }, function (err, result) {
    req.session.lastCreatedId = result.insertId;

    var directoryUrl = res.locals.url('directory') + '?category=' + category;
    return middleware.redirect(directoryUrl, 302)(req, res, next);
  });
};

exports.useTemplate = function useTemplate (req, res, next) {
  const templateId = req.query.templateId;

  Badge.getOne({id: templateId, status: 'template'}, function(err, badge) {
    if (err) {
      return res.send(500, err);
    }

    badge.status = 'draft';
    delete badge.id;

    Badge.put(badge, function (err, result) {
      var directoryUrl = res.locals.url('directory') + '?category=draft';
      return middleware.redirect(directoryUrl, 302)(req, res, next);
    });
  });
};
