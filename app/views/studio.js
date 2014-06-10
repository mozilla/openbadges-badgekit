const async = require('async');
const config = require('../lib/config');
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

    if (!badge) {
      err = new Error('Badge not found');
      err.code = 404;
      return next(err);
    }

    var staticDir = res.locals.static('images/studio');

    async.parallel({
      shapes: getShapes.bind(null, staticDir),
      backgrounds: getBackgrounds.bind(null, staticDir),
      branding: getBranding.bind(null, staticDir),
      graphics: getGraphics.bind(null, staticDir),
      swatches: getSwatches,
    }, function (err, data) {
      if (err)
        return next(err);

      var brandingLabel = config('BRANDING_' + badge.system.replace(/\W/g, ''), '')
                          || config('BRANDING', '');

      data.badge = badge;
      data.brandingLabel = brandingLabel;
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

    if (!badgeRow) {
      err = new Error('Badge not found');
      err.code = 404;
      return next(err);
    }

    var imageData;

    try {
      imageData = dataUriToBuffer(req.body.image);
    } catch (e) {
      return next(e);
    }

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
        studioIcon: req.body.graphic,
        studioColor: req.body.palette,
        studioBranding: req.body.brand,
        studioBrandingLabel: req.body.brandLabel
      }

      Badge.put(badgeQuery, function(err, badgeResult) {
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
                    .replace(/[_-]/g, ' ')
                    .replace(/((?:^| )\w)/g, function (e) { return e.toUpperCase(); })
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
  // This is a quick fix for the fact that we have an empty backgrounds directory.
  callback(null, []);
  //readDirectory(filepath, prefix + '/backgrounds', callback);
}

function getBranding (prefix, callback) {
  var filepath = path.join(STUDIO_PATH, 'ribbons');
  readDirectory(filepath, prefix + '/ribbons', callback);
}

function getGraphics (prefix, callback) {
  var filepath = path.join(STUDIO_PATH, 'graphics');
  readDirectory(filepath, prefix + '/graphics', callback);
}

function getSwatches (callback) {
  var colorSets = [
    ['#ffb500','#fffd00','#ff6f00'],
    ['#bfecff','#ffbfc3','#ffefbf'],
    ['#d7bfff','#fff5bf','#d6ffbf'],
    ['#e6d873','#5777ae','#ba5d9f'],
    ['#63458a','#be5f9c','#5a75b3'],
    ['#ffb000','#f5ff00','#ff5500'],
    ['#1220ba','#660099','#00a67e'],
    ['#540099','#c40098','#1e14ad']
  ];

  callback(null, colorSets.map(function (c, i) {
    return {value: i+1, colors: c};
  }));
}
