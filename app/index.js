// New Relic Server monitoring support
if ( process.env.NEW_RELIC_ENABLED ) {
  require( "newrelic" );
}

const config = require('./lib/config');
const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');
const middleware = require('./middleware');
const views = require('./views');
const persona = require('express-persona-observer');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader([path.join(__dirname, './templates'),
                                                                  path.join(__dirname, './static/templates')]),
                                   { autoescape: true, watch: true });

env.express(app);

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
app.use(middleware.csrf({ whitelist: [ '/persona/login', '/persona/logout', '/persona/verify'] }));
app.use(middleware.sass(staticDir, staticRoot));
app.use(middleware.addCsrfToken);
app.use(staticRoot, express.static(staticDir));

persona.express(app, { audience: config('PERSONA_AUDIENCE'),
                       redirects: { notLoggedIn: '/', notLoggedOut: '/directory' },
                       selectors: { login: '.js-login', logout: '.js-logout' } });

var secureRouteHandlers = [persona.ensureLoggedIn(), middleware.verifyPermission(config('ACCESS_LIST', []), 'sorry.html')];

app.get('/', 'home', [persona.ensureLoggedOut()], views.home);
app.get('/directory', 'directory', secureRouteHandlers, views.directory.home);
app.get('/directory/addBadge', 'directory.addBadge', secureRouteHandlers, views.directory.addBadge);
app.get('/directory/useTemplate', 'directory.useTemplate', secureRouteHandlers, views.directory.useTemplate);

app.get('/badge/:badgeId', 'badge', secureRouteHandlers, views.badge.home);
app.get('/badge/:badgeId/edit', 'badge.edit', secureRouteHandlers, views.badge.edit);
app.post('/badge/:badgeId/edit', 'badge.save', secureRouteHandlers, views.badge.save);
app.post('/badge/:badgeId/archive', 'badge.archive', secureRouteHandlers, views.badge.archive);
app.post('/badge/:badgeId/publish', 'badge.publish', secureRouteHandlers, views.badge.publish);
app.post('/badge/:badgeId/copy', 'badge.copy', secureRouteHandlers, views.badge.copy);

app.get('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.renderIssueByEmail);
app.post('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', secureRouteHandlers, views.badge.issueByEmail);

app.get('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.renderIssueByClaimCode);
app.post('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', secureRouteHandlers, views.badge.issueByClaimCode);

app.get('/images/badge/:badgeId', 'badge.image', views.badge.image);

app.get('/settings', 'settings', secureRouteHandlers, views.settings.home);

app.get('/studio/backgrounds', 'studio.backgrounds', secureRouteHandlers, views.badge.getBackgrounds);
app.get('/studio/texts', 'studio.texts', secureRouteHandlers, views.badge.getTexts);
app.get('/studio/icons', 'studio.icons', secureRouteHandlers, views.badge.getIcons);
app.get('/studio/colors', 'studio.colors', secureRouteHandlers, views.badge.getColors);

app.get('/help', 'help', views.help.home);

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
