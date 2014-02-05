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

app.get('/', 'home', [persona.ensureLoggedOut()], views.home);
app.get('/directory', 'directory', [persona.ensureLoggedIn()], views.directory.home);
app.get('/directory/addBadge', 'directory.addBadge', [persona.ensureLoggedIn()], views.directory.addBadge);
app.get('/directory/useTemplate', 'directory.useTemplate', [persona.ensureLoggedIn()], views.directory.useTemplate);

app.get('/badge/:badgeId', 'badge', [persona.ensureLoggedIn()], views.badge.home);
app.get('/badge/:badgeId/edit', 'badge.edit', [persona.ensureLoggedIn()], views.badge.edit);
app.post('/badge/:badgeId/edit', 'badge.save', [persona.ensureLoggedIn()], views.badge.save);

app.get('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', [persona.ensureLoggedIn()], views.badge.renderIssueByEmail);
app.post('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', [persona.ensureLoggedIn()], views.badge.issueByEmail);

app.get('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', [persona.ensureLoggedIn()], views.badge.renderIssueByClaimCode);
app.post('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', [persona.ensureLoggedIn()], views.badge.issueByClaimCode);

app.get('/images/badge/:badgeId.png', 'badge.image', views.badge.image);

app.get('/settings', 'settings', [persona.ensureLoggedIn()], views.settings.home);

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
