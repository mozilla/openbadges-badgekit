var clientSessions = require('client-sessions');
var config = require('../lib/config');
var formatUrl = require('url').format;
var parseUrl = require('url').parse;
var sass = require('node-sass');
var xtend = require('xtend');
var jwt = require('jwt-simple');
var util = require('util');

var Account = require('../models/account')("DATABASE");

exports.csrf = require('./csrf');

var COOKIE_KEY = config('COOKIE_KEY', 'session');
var COOKIE_SECRET = config('COOKIE_SECRET');
var API_SECRET = config('API_SECRET');

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

exports.debug = function debug (req, res, next) {
  const debug = (config('NODE_ENV', '') === 'test') || config('DEBUG', false);
  res.locals.debug = debug;
  next();
}

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

exports.verifyPermission = function verifyPermission (siteAdminList, deniedPage) {
  if (typeof siteAdminList === 'string' || siteAdminList instanceof String) {
    siteAdminList = JSON.parse(siteAdminList);
  }

  siteAdminList = siteAdminList || [];

  return function (req, res, next) {
    function makeContext(context) {
      context = context || {};

      var slugContext = { system: context.system.slug };
      if (context.issuer)
        slugContext.issuer = context.issuer.slug;
      if (context.program)
        slugContext.program = context.program.slug;

      return function (data) {
        return xtend(slugContext, data);
      }  
    }

    function buildContext(permissions) {
      var context = {};
      if (permissions.system)
        context.system = { slug: permissions.system };
      if (permissions.issuer)
        context.issuer = { slug: permissions.issuer };
      if (permissions.program)
        context.program = { slug: permissions.program };

      return context;
    }

    function makeContextName(context) {
      var contextName = 'System: ' + (context.system.name || context.system.slug);
      if (context.issuer)
        contextName = 'Issuer: ' + (context.issuer.name || context.issuer.slug);
      if (context.program)
        contextName = 'Program: ' + (context.program.name || context.program.slug);

      return contextName;
    }

    function sendDenied() {
      if (!deniedPage)
        return res.send(403, 'Access Denied');
      else
        res.status(403);
        return res.render(deniedPage);
    }

    if (req.fromLoggedInUser()) {
      if (siteAdminList.some(function(email) { return new RegExp(email.replace('*', '.+?')).test(req.session.email) })) {
        if (!req.session.context)
          req.session.context = { system: { slug: config('OPENBADGER_SYSTEM') }};

        res.locals.contextName = makeContextName(req.session.context);
        res.locals.isSiteAdmin = true;
        res.locals.hasPermission = function() { return true; }
        res.locals.makeContext = makeContext(req.session.context);
        res.locals.canCreateDraft = true;
        return next();
      }
      else {
        return Account.getOne({ email: req.session.email }, { relationships: true }, function(err, row) {
          if (err)
            return res.send(500, err);
          if (!row || !row.accountPermissions.length)
            return sendDenied();

          res.locals.hasPermission = row.hasPermission.bind(row);
          
          if (!req.session.context)
            req.session.context = buildContext(row.accountPermissions[0]);
          if (!req.session.context.system) {
            return sendDenied();
          }
          res.locals.contextName = makeContextName(req.session.context);
          res.locals.makeContext = makeContext(req.session.context);
          res.locals.canCreateDraft = row.hasPermission(res.locals.makeContext(), 'draft');
          return next();
        });
      }
    }
    return sendDenied();
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

exports.verifyApiRequest = function verifyApiRequest () {
  return function (req, res, next) {
    const token = req.body.auth;

    const now = Date.now()/1000|0;
    var decodedToken, msg;
    if (!token)
      return res.send(403, 'missing mandatory `auth` param');
    try {
      decodedToken = jwt.decode(token, API_SECRET);
    } catch(err) {
      return res.send(403, 'error decoding JWT: ' + err.message);
    }

    if (decodedToken.prn.email !== req.body.email) {
      msg = '`prn.email` mismatch: given %s, expected %s';
      return res.send(403, util.format(msg, decodedToken.prn.email, req.body.email));
    }

    const jwtContext = JSON.stringify(decodedToken.prn.context);
    const receivedContext = JSON.stringify(req.body.context);

    if (jwtContext !== receivedContext) {
      msg = '`prn.context` mismatch: given %s, expected %s';
      return res.send(403, util.format(msg, jwtContext, receivedContext));
    }

    const jwtPermissions = JSON.stringify(decodedToken.prn.permissions);
    const receivedPermissions = JSON.stringify(req.body.permissions);

    if (jwtPermissions !== receivedPermissions) {
      msg = '`prn.permissions` mismatch: given %s, expected %s';
      return res.send(403, util.format(msg, jwtPermissions, receivedPermissions));
    }

    if (decodedToken.method !== req.method) {
      msg = '`method` mismatch: given %s, expected %s';
      return res.send(403, util.format(msg, decodedToken.method, req.method));
    }

    if (!decodedToken.exp)
      return res.send(403, 'Token must have exp (expiration) set');

    if (decodedToken.exp < now)
      return res.send(403, 'Token has expired');

    return next();
  }
}

exports.clearSession = function clearSession (req, res, next) {
  req.session.context = null;
  next();
};
