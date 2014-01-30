exports.home = function home (req, res, next) {
  res.render('home.html');
};

exports.directory = require('./directory');
exports.badge = require('./badge');
exports.settings = require('./settings');
