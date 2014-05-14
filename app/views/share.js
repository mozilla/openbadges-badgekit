const Badge = require('../models/badge');
const request = require('request');
const url = require('url');

function isUrl (str) {
  // TODO: verify it really is a URL!
  return true;
}

exports.home = function home (req, res, next) {
  return res.render('share/home.html');
}

exports.subscribe = function subscribe (req, res, next) {
  var subscription = req.body.subscription;

  // Test subscription is a URL. If not, reformat.
  if (!isUrl(subscription)) {
    subscription = url.format({
      protocol: req.protocol,
      host: req.host,
      pathname: res.locals.url('share.template', {shareId: subscription})
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

    // TODO: validate body
    // TODO: consume new template

    // If content is valid template (see `templateAsJson` below),
    // 'import' it and redirect to new template

    // If content is invalid, display error message
  });
}

exports.template = function template (req, res, next) {
  // This view needs to handle two options, depending on the
  // requested content type.

  const shareId = req.params.shareId;

  Badge.get({shareId: shareId}, function (err, badge) {
    if (req.accepts('json'))
      return templateAsJson(err, badge, req, res, next);

    return templateAsHtml(err, badge, req, res, next);
  });
}

function templateAsJson (err, template, req, res, next) {
  // Render template as JSON - the actual data needed for sharing this template

  if (err)
    return res.send(500, JSON.stringify(err)); // TODO: do this properly

  if (!template)
    return res.send(404, JSON.stringify(new Error('Not found'))) // TODO

  // Is this sufficient? Not sure what data is required for sharing
  return res.send(200, JSON.stringify(template));
}

function templateAsHtml (err, template, req, res, next) {
  // Render template as HTML - instructions on how to consume this template

  if (err)
    return next(err);

  if (!template)
    return next(new Error('Not found')); // TODO: should be a 404 really

  return res.render('share/template.html', {
    template: template
  });
}