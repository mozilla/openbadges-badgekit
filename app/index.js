var newrelic;
if (process.env.NEW_RELIC_ENABLED) {
  newrelic = require('newrelic');
}
else {
  newrelic = {
    getBrowserTimingHeader: function () {
      return "<!-- New Relic RUM disabled -->";
    }
  };
}

const config = require('./lib/config');
const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const views = require('./views');
const api = require('./api');
const persona = require('express-persona-observer');
const http = require('http');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([path.join(__dirname, './templates'),
                                                                  path.join(__dirname, './static/templates')]),
                                   { autoescape: true, watch: true });

env.express(app);

app.locals.newrelic = newrelic;

require('express-monkey-patch')(app);

var staticDir = path.join(__dirname, '/static');
var staticRoot = '/static';

app.use(function (req, res, next) {
  res.locals.static = function static (staticPath) {
    return path.join(app.mountPoint, staticRoot, staticPath);
  };
  next();
});

app.use(express.compress());
app.use(express.bodyParser());
app.use(middleware.session());
app.use(middleware.csrf({ whitelist: [ '/persona/login', '/persona/logout', '/persona/verify', '/api/user'] }));
app.use(middleware.sass(staticDir, staticRoot));
app.use(middleware.addCsrfToken);
app.use(middleware.debug);
app.use(staticRoot, express.static(staticDir));

persona.express(app, { audience: config('PERSONA_AUDIENCE'),
                       redirects: { notLoggedIn: '/', notLoggedOut: '/directory' },
                       selectors: { login: '.js-login', logout: '.js-logout' },
                       middleware: middleware.clearSession });

var secureRouteHandlers = [persona.ensureLoggedIn(), middleware.verifyPermission(config('ACCESS_LIST', []), 'sorry.html')];
var secureApiHandlers = [middleware.verifyApiRequest()];

app.get('/', 'home', [persona.ensureLoggedOut()], views.home);
app.get('/directory', 'directory', secureRouteHandlers, views.directory.home);
app.get('/directory/addBadge', 'directory.addBadge', secureRouteHandlers, views.directory.addBadge);
app.get('/directory/useTemplate', 'directory.useTemplate', secureRouteHandlers, views.directory.useTemplate);

app.get('/badge/:badgeId', 'badge', secureRouteHandlers, views.badge.home);
app.get('/badge/:badgeId/edit', 'badge.edit', secureRouteHandlers, views.badge.edit);
app.del('/badge/:badgeId/delete', 'badge.delete', secureRouteHandlers, views.badge.del);
app.post('/badge/:badgeId/edit', 'badge.save', secureRouteHandlers, views.badge.save);
app.post('/badge/:badgeId/archive', 'badge.archive', secureRouteHandlers, views.badge.archive);
app.post('/badge/:badgeId/publish', 'badge.publish', secureRouteHandlers, views.badge.publish);
app.post('/badge/:badgeId/copy', 'badge.copy', secureRouteHandlers, views.badge.copy);
app.get('/badge/:badgeId/design', 'studio.edit', secureRouteHandlers, views.studio.edit);
app.post('/badge/:badgeId/design', 'studio.save', secureRouteHandlers, views.studio.save);

app.get('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.renderIssueByEmail);
app.post('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.issueByEmail);

app.get('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.renderIssueByClaimCode);
app.post('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.issueByClaimCode);

app.get('/images/badge/:badgeId', 'badge.image', views.badge.image);

app.get('/settings', 'settings', secureRouteHandlers, views.settings.home);
app.get('/settings/systems', 'settings.systems', secureRouteHandlers, views.settings.systems);
app.get('/settings/issuers', 'settings.issuers', secureRouteHandlers, views.settings.issuers);
app.get('/settings/programs', 'settings.programs', secureRouteHandlers, views.settings.programs);
app.get('/settings/context', 'settings.context', secureRouteHandlers, views.settings.context);
app.post('/settings/context', 'settings.setContext', secureRouteHandlers, views.settings.setContext);
app.get('/settings/context/data', 'settings.contextData', secureRouteHandlers, views.settings.contextData);
app.get('/settings/users', 'settings.users', secureRouteHandlers, views.settings.users);
app.post('/settings/users', 'settings.editUser', secureRouteHandlers, views.settings.editUser);
app.del('/settings/users', 'settings.deleteUser', secureRouteHandlers, views.settings.deleteUser);

app.get('/studio/backgrounds', 'studio.backgrounds', secureRouteHandlers, views.badge.getBackgrounds);
app.get('/studio/texts', 'studio.texts', secureRouteHandlers, views.badge.getTexts);
app.get('/studio/icons', 'studio.icons', secureRouteHandlers, views.badge.getIcons);
app.get('/studio/colors', 'studio.colors', secureRouteHandlers, views.badge.getColors);

app.get('/applications', 'applications', secureRouteHandlers, views.applications.home);
app.get('/applications/:badgeId', 'applications.forBadge', secureRouteHandlers, views.applications.forBadge);
app.get('/applications/:badgeId/:applicationId', 'application', secureRouteHandlers, views.applications.application);
app.post('/applications/:badgeId/:applicationId', 'application.submit', secureRouteHandlers, views.applications.submitReview);

app.get('/help', 'help', views.help.home);
app.get('/about', 'about', views.about.home);
app.get('/termsofuse', 'termsofuse', views.termsofuse.home);

app.get('/system/:systemId/badge/:badgeId/criteria', 'badge.criteria', views.badge.criteria);

app.get('/share', 'share', secureRouteHandlers, views.share.home);
app.post('/share', 'share.subscribe', secureRouteHandlers, views.share.subscribe);
app.get('/share/:shareId', 'share.template', views.share.template);

app.post('/api/user', 'api.user.add', secureApiHandlers, api.user.addUser);
app.del('/api/user', 'api.user.delete', secureApiHandlers, api.user.deleteUser);

app.get('*', function (req, res, next) {
  var error = new Error('Page not found');

  Object.defineProperties(error, {
    name: {value: 'ResourceNotFoundError'},
    code: {value: 404},
  });

  next(error);
});

app.all('*', function (req, res, next) {
  var error = new Error('Method not allowed');

  Object.defineProperties(error, {
    name: {value: 'MethodNotAllowedError'},
    code: {value: 405},
  });

  next(error);
});

app.use(function (err, req, res, next) {
  const status = err.code || 500;
  const msg = http.STATUS_CODES[status] || err.message;

  res.status(status).render('error.html', {
    message: msg,
    error: err
  });
});

if (!module.parent) {
  const port = config('PORT', 3000);

  app.listen(port, function(err) {
    if (err) {
      throw err;
    }

    console.log('Listening on port ' + port + '.');
  });
} else {
  module.exports = http.createServer(app);
}
