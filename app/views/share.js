const Badge = require('../models/badge')("DATABASE");
const request = require('request');
const url = require('url');
const validator = require('validator');

function isUrl (str) {
  return validator.isURL(str);
}

function isValidTemplate (data) {
  // TODO: verify it really is a valid template
  return true;
}

function serializeTemplate (template) {
  // TODO: serialize template
  return JSON.stringify(template);
}

function consumeTemplate (data, callback) {
  if (!isValidTemplate(data))
    return callback(new Error('Invalid template'), null);

  // TODO: convert data into working template, and return via callback
  callback(null, {id: 1});
}

exports.home = function home (req, res, next) {
  return res.render('share/home.html');
}

exports.subscribe = function subscribe (req, res, next) {
  var subscription = req.body.subscription;

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
      return handleError(err);

    consumeTemplate(body, function (err, template) {
      if (err)
        return handleError(err);

      var redirect = res.locals.url('badge', {badgeId: template.id});

      if (!req.xhr)
        return res.redirect(303, redirect);

      res.json(200, {status: 'ok', message: redirect});
    })
  });

  function handleError (err) {
    if (!req.xhr)
      return next(err);

    res.json(500, {status: 'error', message: err.message});
  }
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
    return res.json(500, err); // TODO: do this properly

  if (!template)
    return res.json(404, {error: 'Not Found'})

  return res.send(200, serializeTemplate(template));
}

function templateAsHtml (err, template, req, res, next) {
  // Render template as HTML - instructions on how to consume this template

  if (err)
    return next(err);

  if (!template)
    return next(); // Should force a 404

  return res.render('share/template.html', {
    template: template
  });
}