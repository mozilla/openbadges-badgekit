exports.home = function home (req, res, next) {
  res.render('home.html');
};

exports.sorry = function sorry (req, res, next) {
  res.render('sorry.html');
};

exports.directory = require('./directory');
exports.badge = require('./badge');
exports.settings = require('./settings');
exports.help = require('./help');
exports.about = require('./about');