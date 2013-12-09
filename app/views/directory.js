const openbadger = require('../lib/openbadger');

exports = module.exports = function home (req, res, next) {
  const pageNum = req.query.page || 1;

  openbadger.getBadges({ page: pageNum, pageSize: 12 }, function (err, data) {
    return res.render('directory/home.html', data);
  });
}