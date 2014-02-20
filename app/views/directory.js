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
        if (category === 'template' || category === 'draft') {
          badges.sort(function(a,b) {
            var aTime = a.lastUpdated.getTime();
            var bTime = b.lastUpdated.getTime();
            if (aTime < bTime)
              return 1;
            else if (aTime > bTime)
              return -1;
            return (b.id - a.id); 
          });
        }
        break;
      case 'datecreated':
      default:
        if (category === 'template' || category === 'draft') {
          badges.sort(function(a,b) {
            var aTime = a.created.getTime();
            var bTime = b.created.getTime();
            if (aTime < bTime)
              return 1;
            else if (aTime > bTime)
              return -1;
            return (b.id - a.id);
          });
        }
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
      lastCreatedId: lastCreatedId
    });
  }

  const pageNum = parseInt(req.query.page, 10) || 1;
  const category = req.query.category || 'draft';
  const sort = req.query.sort;

  switch (category) {
    case 'published':
      openbadger.getBadges(function (err, data) {
        if (err)
          return res.send(500, err);

        var badges = data.map(openbadger.toBadgekitBadge);

        handleResults(err, badges);
      });
      break;
    case 'archived':
      openbadger.getAllBadges(function (err, data) {
        if (err)
          return res.send(500, err);
        
        var badges = data.filter(function(badge) {
          return (badge.archived === true);
        }).map(openbadger.toBadgekitBadge);

        handleResults(err, badges);
      });
      break;
    case 'template':
      Badge.get({ status: 'template' }, handleResults);
      break;
    default:
      Badge.get({ status: 'draft', published: false }, handleResults);
      break;
  }
};

exports.addBadge = function addBadge (req, res, next) {
  const category  = req.query.category || 'draft';

  Badge.put({ name: 'New Badge', status: category, created: new Date() }, function (err, result) {
    if (err)
      return res.send(500, err);
    
    req.session.lastCreatedId = result.insertId;

    Badge.getOne({ id: result.insertId }, function(err, row) {
      if (err)
        return res.send(500, err);

      row.setCriteria([{ }], function(err) {
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

    row.createCopy({status: 'draft'}, function(err, newRow) {
      if (err)
        return res.send(500, err);
      
      const directoryUrl = res.locals.url('directory') + '?category=draft';
      return middleware.redirect(directoryUrl, 302)(req, res, next);
    });
  });
};
