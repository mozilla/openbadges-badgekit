const async = require('async');
const fs = require('fs');
const path = require('path');

const Badge = require('../models/badge')("DATABASE");

const STUDIO_PATH = path.join(__dirname, '../static/images/studio');


exports.edit = function editDesign (req, res, next) {
  const badgeId = req.params.badgeId;

  Badge.getOne({id: badgeId}, {relationships: true}, function (err, badge) {
    if (err)
      return next(err);

    var staticDir = res.locals.static('images/studio');

    async.parallel({
      shapes: getShapes.bind(null, staticDir),
      backgrounds: getBackgrounds.bind(null, staticDir),
      branding: getBranding.bind(null, staticDir),
      graphics: getGraphics.bind(null, staticDir),
      swatches: getSwatches,
    }, function (err, data) {
      data.badge = badge;
      res.render('studio/index.html', data)
    });
  });
}

exports.save = function saveDesign (req, res, next) {
  console.log(req.body);
  res.send(200, 'Saved!');
}

function readDirectory (filepath, prefix, callback) {
  fs.readdir(filepath, function(err, files) {
    if (err)
      return callback(err, null);

    callback(null, files.map(function(file) {
      var filename = path.basename(file, path.extname(file));
      var label = filename.toLowerCase()
                    .replace('_', ' ')
                    .replace(/((?:^| )\w)/, function (e) { return e.toUpperCase(); })
      return {
        label: label,
        value: filename,
        src: prefix + '/' + file
      };
    }));
  });
}

function getShapes (prefix, callback) {
  var filepath = path.join(STUDIO_PATH, 'shapes');
  readDirectory(filepath, prefix + '/shapes', callback);
}

function getBackgrounds (prefix, callback) {
  var filepath = path.join(STUDIO_PATH, 'backgrounds');
  readDirectory(filepath, prefix + '/backgrounds', callback);
}

function getBranding (prefix, callback) {
  callback(null, []);
}

function getGraphics (prefix, callback) {
  var filepath = path.join(STUDIO_PATH, 'graphics');
  readDirectory(filepath, prefix + '/graphics', callback);
}

function getSwatches (callback) {
  callback(null, [
    {
      value: 1,
      colors: ['#333', '#666', '#999'],
    },
    {
      value: 2,
      colors: ['#FF0000', '#0000FF', '#00FF00'],
    },
    {
      value: 3,
      colors: ['#FF9900', '#9900FF', '#00FF99'],
    },
    {
      value: 4,
      colors: ['#009900', '#990000', '#000099'],
    }
  ]);
}
