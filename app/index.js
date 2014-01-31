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

persona.express(app, { audience: config('PERSONA_AUDIENCE') });

app.get('/', 'home', middleware.redirect('directory', 302));
app.get('/directory', 'directory', views.directory.home);
app.get('/directory/addBadge', 'directory.addBadge', views.directory.addBadge);
app.get('/directory/useTemplate', 'directory.useTemplate', views.directory.useTemplate);

app.get('/badge/:badgeId', 'badge', views.badge.home);
app.get('/badge/:badgeId/edit', 'badge.edit', views.badge.edit);
app.post('/badge/:badgeId/edit', 'badge.save', views.badge.save);

app.get('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', views.badge.renderIssueByEmail);
app.post('/badge/:badgeId/issueByEmail', 'badge.issueByEmail', views.badge.issueByEmail);

app.get('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', views.badge.renderIssueByClaimCode);
app.post('/badge/:badgeId/issueByClaimCode', 'badge.issueByClaimCode', views.badge.issueByClaimCode);

app.get('/images/badge/:badgeId.png', 'badge.image', views.badge.image);

app.get('/settings', 'settings', views.settings.home);

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
