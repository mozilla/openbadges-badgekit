const async = require('async');
const dataUriToBuffer = require('data-uri-to-buffer');
const fs = require('fs');
const path = require('path');

const Badge = require('../models/badge')("DATABASE");
const Image = require('../models/image')("DATABASE");

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
  const badgeId = req.params.badgeId;

  Badge.getOne({id: badgeId}, function(err, badgeRow) {
    if (err) {
      return next(err);
    }

    const imageData = dataUriToBuffer(req.body.image);
    const imageQuery = {
      id: badgeRow.imageId,
      mimetype: imageData.type,
      data: imageData,
      url: null
    };

    Image.put(imageQuery, function(err, imageRow) {
      if (err) {
        return next(err);
      }

      const badgeQuery = {
        id: badgeId,
        // handle INSERT || UPDATE
        imageId: imageRow.insertId || imageRow.row.id,
        studioShape: req.body.shape,
        studioBackground: req.body.background,
        studioIcon: req.body.graphic,
        studioColor: req.body.palette
        // how do I shot brand? studioBrand: req.body.brand ?
      }

      Badge.update(badgeQuery, function(err, badgeResult) {
        if (err) {
          return next(err);
        }

        res.redirect("/badge/" + badgeId + "/edit?category=" + badgeRow.status);
      });
    });
  });
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
