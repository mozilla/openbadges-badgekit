var clientSessions = require('client-sessions');
var config = require('../lib/config');
var formatUrl = require('url').format;
var parseUrl = require('url').parse;
var sass = require('node-sass');

exports.csrf = require('./csrf');

var COOKIE_KEY = config('COOKIE_KEY', 'session');
var COOKIE_SECRET = config('COOKIE_SECRET');

exports.session = function session () {
  return clientSessions({
    cookieName: COOKIE_KEY,
    secret: COOKIE_SECRET,
    maxAge: (7 * 24 * 60 * 60 * 1000), //one week
    cookie: {
      httpOnly: true
    }
  });
};

exports.addCsrfToken = function addCsrfToken (req, res, next) {
  res.locals.csrfToken = req.session._csrf;
  next();
};

exports.redirect = function (target, params, status) {
  if (typeof params === 'number') {
    status = params;
    params = {};
  }

  return function (req, res, next) {
    var url;
    try {
      url = res.locals.url(target, params);
    } catch (e) {
      url = target;
    }

    if (params._qsa && req.query) {
      url = parseUrl(url, true);
      if (!url.query) url.query = {};

      Object.keys(req.query).forEach(function(key) {
        if (!url.query.hasOwnProperty(key))
          url.query[key] = req.query[key];
      });

      url = formatUrl(url);
    }

    return res.redirect(status || 302, url);
  };
};

exports.sass = function (root, prefix) {
  return sass.middleware({
    root: root,
    src: 'scss',
    dest: 'css',
    prefix: prefix,
    debug: config('debug', false)
  });
};

exports.verifyPermission = function verifyPermission (accessList, deniedPage) {
  if (typeof accessList === 'string' || accessList instanceof String) {
    accessList = JSON.parse(accessList);
  }

  return function (req, res, next) {
    accessList = accessList || [];

    if (req.fromLoggedInUser()) {
      if (accessList.some(function(email) { return new RegExp(email.replace('*', '.+?')).test(req.session.email) }))
        return next();
      else {
        if (!deniedPage)
          return res.send(403, 'Access Denied');
        else
          return res.render(deniedPage);
      }
    }
    return next();
  };
};

const monthNamesByLanguage = {
  en: {
    fullNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
}

exports.getMonthName = function getMonthName (monthNum, getShort, lang) {
  lang = (lang && (lang in monthNamesByLanguage)) ? lang : 'en';

  if (!getShort) {
    return monthNamesByLanguage[lang].fullNames[monthNum];
  }
  else {
    return monthNamesByLanguage[lang].shortNames[monthNum];
  }
}
