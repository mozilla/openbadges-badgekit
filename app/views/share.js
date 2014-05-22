const Badge = require('../models/badge')("DATABASE");
const Image = require('../models/image')("DATABASE");
const request = require('request');
const url = require('url');
const validator = require('validator');
const async = require('async');

const badgeView = require('./badge');

function isUrl (str) {
  return validator.isURL(str);
}

function serializeTemplate (template) {
  // TODO: serialize template
  return JSON.stringify(template);
}

function consumeTemplate (data, makeContext, callback) {
  const timeValue = parseInt(data.timeValue, 10);
  const limitNumber = parseInt(data.limitNumber, 10);

  const query = makeContext({
    name: data.name,
    description: data.description,
    issuerUrl: data.issuerUrl,
    earnerDescription: data.earnerDescription,
    consumerDescription: data.consumerDescription,
    rubricUrl: data.rubricUrl,
    timeValue: timeValue > 0 ? timeValue : 0,
    timeUnits: data.timeUnits,
    limit: data.limit == 'limit' ? (limitNumber > 0 ? limitNumber : 0) : 0,
    unique: data.unique == 'unique' ? 1 : 0,
    multiClaimCode: data.multiClaimCode,
    badgeType: data.badgeType,
    slug: Badge.generateSlug(),
    created: new Date(),
    status: 'template'
  });

  Badge.put(query, function (err, result) {
    if (err)
      return callback(err);

    Badge.getOne({ id: result.insertId }, function(err, badgeRow) {
      if (err)
        return callback(err);

      async.parallel([
        function(innerCallback) {
          if ('criteria' in data) {
            const criteria = data.criteria.map(function(criterion) {
              return {
                description: criterion.description,
                required: criterion.required,
                note: criterion.note
              };
            });

            badgeRow.setCriteria(criteria, function(err) {
              return innerCallback(err);
            });
          }
          else {
            return innerCallback(null);
          }
        },
        function(innerCallback) {
          if (data.image && data.image.mimetype) {
            var imageQuery = {
              mimetype: data.image.mimetype,
              data: data.image.data ? new Buffer(data.image.data) : null,
              url: data.image.url
            }

            Image.put(imageQuery, function(err, imageResult) {
              if (err)
                return innerCallback(err);

              if (badgeRow.imageId === null) {
                Badge.put({ id: badgeRow.id, imageId: imageResult.insertId }, function(err, result) {
                  return innerCallback(err);
                });
              }
              else {
                return innerCallback(null);
              }
            });
          }
          else {
            return innerCallback(null);
          }
        },
        function(innerCallback) {
          if (!('categories' in data))
            return innerCallback(null);

          var categories = data.categories.map(function (category) { return category.label; });
          badgeRow.setCategories(categories, innerCallback);
        },
        function(innerCallback) {
          if (!('tags' in data))
            return innerCallback(null);

          badgeRow.setTags(data.tags, innerCallback);
        }],
        function(err) {
          callback(err, badgeRow);
        }
      );
    });
  });
};

exports.home = function home (req, res, next) {
  return res.render('share/home.html');
}

exports.subscribe = function subscribe (req, res, next) {
  var subscription = req.body.subscription.trim();

  if (!subscription)
    return res.redirect(303, res.locals.url('share'));

  // Test subscription is a URL. If not, reformat.
  if (!isUrl(subscription)) {
    subscription = url.format({
      protocol: req.protocol,
      host: req.headers.host,
      pathname: res.locals.url('share.template', {shareId: encodeURI(subscription)})
    });
  }

  // Fetch subscription URL content
  var options = {
    url: subscription,
    json: true
  };

  request(options, function (err, rsp, body) {
    if (err)
      return next(err);

    if (rsp.statusCode >= 300) {
      return res.render('share/home.html', {
        subscription: req.body.subscription,
        message: 'Error importing template'
      });
    }

    consumeTemplate(body, res.locals.makeContext, function (err, template) {
      if (err)
        return next(err);

      var redirect = res.locals.url('badge', {badgeId: template.id});

      return res.redirect(303, redirect);
    })
  });
}

exports.template = function template (req, res, next) {
  // This view needs to handle two options, depending on the
  // requested content type.

  const shareId = req.params.shareId;

  Badge.getOne({slug: shareId, status: 'template'}, {
    relationships: true
  }, function (err, badge) {
    if (req.accepts('json, html') === 'json')
      return templateAsJson(err, badge, req, res, next);

    return templateAsHtml(err, badge, req, res, next);
  });
}

function templateAsJson (err, template, req, res, next) {
  // Render template as JSON - the actual data needed for sharing this template

  if (err)
    return res.json(500, {error: err.message});

  if (!template)
    return res.json(404, {error: 'Not Found'});

  return res.send(200, serializeTemplate(template));
}

function templateAsHtml (err, template, req, res, next) {
  // Render template as HTML - instructions on how to consume this template

  if (err)
    return next(err);

  if (!template)
    return next(); // Should force a 404

  return res.render('share/template.html', {
    badge: template
  });
}