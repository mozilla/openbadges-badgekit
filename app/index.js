const config = require('./lib/config');
const nunjucks = require('nunjucks');
const express = require('express');
const path = require('path');
const middleware = require('./middleware');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.join(__dirname, './templates')), {autoescape: true});

env.express(app);

require('../lib/router.js')(app);

var staticDir = path.join(__dirname, '/static');
var staticRoot = '/static';

app.use(function (req, res, next) {
  res.locals.static = function static (staticPath) {
    return path.join(app.mountPoint, staticRoot, staticPath);
  }
  next();
});

app.use(express.compress());
app.use(express.bodyParser());
app.use(middleware.session());
app.use(middleware.csrf({ whitelist: [] }));

app.use(staticRoot, express.static(staticDir));

app.get('/', function (req, res, next) {
  res.render('home.html');
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
