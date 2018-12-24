const openbadger = require('../lib/openbadger');
const Badge = require('../models/badge')("DATABASE");
const middleware = require('../middleware');
const url = require('url');

const PAGE_SIZE = 12;

exports.home = function home (req, res, next) {
  function handleResults (err, badges) {
    if (err)
      return res.send(500, err);

    // If the user was redirected here after creating a new
    // badge, we pass the ID of that badge to the template
    // so we can highlight it with CSS.
    const lastCreatedId = req.session.lastCreatedId;
    delete req.session.lastCreatedId;

    const notification = req.session.notification;
    delete req.session.notification;

    var newBadge = null;

    if (lastCreatedId) {
      var newIndex = -1;

      for (var i = 0; i < badges.length; i++) {
        if (badges[i].id === lastCreatedId) {
          newIndex = i;
          break;
        }
      }

      if (newIndex !== -1) {
        newBadge = badges[newIndex];
        badges.splice(newIndex, 1);
      }
    }


    switch (sort) {
      case 'name':
        badges.sort(function(a,b) { return (a.name > b.name) ? 1 : -1; });
        break;
      case 'applications':
        // to be implemented
        break;
      case 'awarded':
        // to be implemented
        break;
      case 'dateactive':
        badges.sort(function(a,b) {
          var aTime = typeof a.lastUpdated === 'string' ? new Date(a.lastUpdated).getTime() : a.lastUpdated.getTime();
          var bTime = typeof b.lastUpdated === 'string' ? new Date(b.lastUpdated).getTime() : b.lastUpdated.getTime();
          if (aTime < bTime)
            return 1;
          else if (aTime > bTime)
            return -1;
          return (b.id - a.id); 
        });
        break;
      case 'datecreated':
      default:
        badges.sort(function(a,b) {
          var aTime = typeof a.created === 'string' ? new Date(a.lastUpdated).getTime() : a.created.getTime();
          var bTime = typeof b.created === 'string' ? new Date(b.lastUpdated).getTime() : b.created.getTime();
          if (aTime < bTime)
            return 1;
          else if (aTime > bTime)
            return -1;
          return (b.id - a.id);
        });
        break;
    }

    var pageSize = PAGE_SIZE;
    if (category === 'template' || category === 'draft') {
      pageSize--;
    }

    const startIndex = (pageNum-1) * pageSize;
    const pages = Math.ceil(badges.length / pageSize);

    if (newBadge) {
      badges = [newBadge].concat(badges.slice(startIndex, startIndex + pageSize - 1));
    }
    else {
      badges = badges.slice(startIndex, startIndex + pageSize);
    }

    return res.render('directory/home.html', {
      badges: badges,
      page: pageNum,
      pages: pages,
      category: category,
      sort: sort,
      lastCreatedId: lastCreatedId,
      notification: notification
    });
  }

  const pageNum = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || 'draft';
  const sort = req.query.sort;

  switch (category) {
    case 'published':
      openbadger.getBadges(res.locals.makeContext(), function (err, data) {
        if (err)
          return res.send(500, err);

        var badges = data.map(openbadger.toBadgekitBadge);

        handleResults(err, badges);
      });
      break;
    case 'archived':
      openbadger.getAllBadges(res.locals.makeContext(), function (err, data) {
        if (err)
          return res.send(500, err);
        
        var badges = data.filter(function(badge) {
          return (badge.archived === true);
        }).map(openbadger.toBadgekitBadge);

        handleResults(err, badges);
      });
      break;
    case 'template':
      Badge.get(res.locals.makeContext({ status: 'template' }), handleResults);
      break;
    default:
      Badge.get(res.locals.makeContext({ status: 'draft', published: false }), handleResults);
      break;
  }
};

exports.addBadge = function addBadge (req, res, next) {
  const category  = req.query.category || 'draft';
  var query = res.locals.makeContext({ name: 'New Badge', status: category, created: new Date(), slug: Badge.generateSlug() });

  if (!res.locals.hasPermission(query, 'draft'))
    return res.send(403, 'You do not have permission to create a badge');

  Badge.put(query, function (err, result) {
    if (err)
      return res.send(500, err);

    Badge.getOne({ id: result.insertId }, function(err, row) {
      if (err)
        return res.send(500, err);

      row.setCriteria([{ }], function(err) {
        req.session.lastCreatedId = result.insertId;
        req.session.notification = 'created';

        return middleware.redirect('badge.edit', { badgeId: result.insertId }, 302)(req, res, next);
      });
    });
  });
};

exports.useTemplate = function useTemplate (req, res, next) {
  const templateId = req.query.templateId;

  Badge.getOne({id: templateId, status: 'template'}, { relationships: true }, function(err, row) {
    if (err)
      return res.send(500, err);

    if (!row) {
      err = new Error('Badge not found');
      err.code = 404;
      return next(err);
    }

    if (!res.locals.hasPermission(res.locals.makeContext(), 'draft'))
      return res.send(403, 'You do not have permission to create a badge');

    row.createCopy({status: 'draft'}, function(err, newRow) {
      if (err)
        return res.send(500, err);
      
      req.session.lastCreatedId = newRow.id;
      req.session.notification = 'created';

      return middleware.redirect('badge.edit', { badgeId: newRow.id }, 302)(req, res, next);
    });
  });
};
