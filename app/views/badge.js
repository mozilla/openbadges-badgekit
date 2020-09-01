const fs = require('fs');
const path = require('path');
const Badge = require('../models/badge')("DATABASE");
const BadgeCategory = require('../models/badge-category')("DATABASE");
const Image = require('../models/image')("DATABASE");
const async = require('async');
const url = require('url');
const config = require('../lib/config');

const openbadger = require('../lib/openbadger');
const middleware = require('../middleware');

const studioPath = 'images/studio/';

function getBadgeById(badgeId, category, context, callback) {
  if (category === 'draft' || category === 'template') {
    Badge.getOne({ id: badgeId }, { relationships: true }, function(err, row) {
      if (!row && !err) {
        err = new Error('User not found');
        err.code = 404;
      }

      callback(err, { badge: row } );
    });
  }
  else {
    context.badge = badgeId;
    openbadger.getBadge(context, function(err, data) {
      if (err) return callback(err);

      BadgeCategory.get({}, function (err, categories) {
        if (err)
          return callback(err);

        var categoryMap = categories.reduce(function (map, category) {
          map[category.label.toLowerCase().replace(/\W/, '')] = category;
          return map;
        }, {});

        // We're ignoring categories we don't have internally
        // It might make sense to create them instead - not sure
        data.categories = (data.categories || []).reduce(function (categories, category) {
          var key = (''+category).toLowerCase().replace(/\W/, '');
          if (categoryMap.hasOwnProperty(key))
            categories.push(categoryMap[key]);
          return categories;
        }, []);

        data = openbadger.toBadgekitBadge(data);

        callback(err, { badge: data });
      });
    });
  }
}

exports.home = function home (req, res, next) {
  const badgeId = req.params.badgeId;
  const category = req.query.category || 'draft';

  getBadgeById(badgeId, category, res.locals.makeContext(), function(err, data) {
    if (err)
      return res.send(500, err);

    if (!data.badge)
      return res.send(404, "Not Found");

    data.createdFormatted = middleware.getMonthName(data.badge.created.getMonth()) + ' ' +
                                  data.badge.created.getDate() + ', ' +
                                  data.badge.created.getFullYear();

    if (data.badge.status === 'template') {
      data.shareUrl = url.resolve(config('PERSONA_AUDIENCE'), res.locals.url('share.template', { shareId: data.badge.slug }));
    }

    res.render('badge/home.html', data);
  });
};

exports.del = function del (req, res, next) {
  const badgeId = req.params.badgeId;

  Badge.getOne({ id: badgeId }, function(err, row) {
    if (err)
      return res.send(500, err);

    if (!row) {
      err = new Error('Badge not found');
      err.code = 404;
      return next(err);
    }

    row.del(function(err) {
      if (err)
        return res.send(500, err);

      return res.send(200, { location: res.locals.url('directory') + '?category=' + row.status });
    });
  });
};

exports.criteria = function criteria (req, res, next) {
  const badgeSlug = req.params.badgeId;
  const system = req.params.systemId;
  const category = 'published';

  // not my favorite solution, but iterating over all the badges in the system, transforming their titles into 'slugs'
  // returning the one that matches.
  var finalBadge = false; // will be the badge once the iteration is done, not a great solution to contend with async.

  Badge.getAll({ relationships: false }, function(err, badges) {
    if (err) console.log("got an error " + err);
    for (var i in badges) {
      var badge = badges[i];
      var oldSlug = badge.name.trim().toLowerCase().replace(/\s+/g, '-');
      if ((badgeSlug == oldSlug) && (!finalBadge)) {
        finalBadge = badge;
      }
    }
    if (finalBadge) {
      // we found a badge, let's get the criteria relationships now.
      Badge.getOne({id: finalBadge.id}, {relationships: true, relationshipsDepth: -1}, function(err, badge) {
        if (err) {
          return res.send(404);
        }
        return res.render('badge/criteria.html', badge);
      })
    } else {
      return res.send(404);
    }
  });
};

exports.edit = function edit (req, res, next) {
  const badgeId = req.params.badgeId;
  const section = req.query.section || 'description';
  const category = req.query.category || 'draft';

  async.parallel([
    function(callback) {
      getBadgeById(badgeId, category, res.locals.makeContext(), function(err, data) {
        if (err)
          return callback(err);

        if (res.locals.hasPermission(data.badge, 'publish')) {
          data.canPublish = true;
        }

        data.section = section;
        data.badge.categories = (data.badge.categories || []).map(function (category) {
          return category.id;
        });

        var badgeContext = { system: data.badge.system };
        if (data.badge.issuer) badgeContext.issuer = data.badge.issuer;
        if (data.badge.program) badgeContext.program = data.badge.program;

        openbadger.getAllBadges(badgeContext, function (err, supportData) {
          if (err)
            return callback(err);

          supportData.forEach(function(badgeData) {
            data.badge.supportBadges.forEach(function(supportBadge) {
              if (badgeData.slug === supportBadge.supportBadgeSlug) {
                supportBadge.imageUrl = badgeData.imageUrl;
                badgeData.checked = true;
              }
            });
          });

          data.availableSupportBadges = supportData.map(function(badge) {
            return { slug: badge.slug, name: badge.name, imageUrl: badge.imageUrl, checked: badge.checked };
          });

          callback(null, data);
        });
      });
    },
    function(callback) {
      fs.readdir(path.join(__dirname, '../static', studioPath, 'shapes'), function(err, files) {
        if (err)
          return callback(err);

        var shapes = files.map(function(file) {
          return { id: file,
                   image: res.locals.static(path.join(studioPath, 'shapes', file)) };
        });

        callback(null, shapes);
      });
    },
    function(callback) {
      // getAll doesn't seem to be working here
      BadgeCategory.get({}, callback);
    }],
    function(err, results) {
      if (err)
        return next(err);

      var data = results[0];
      data.shapes = results[1];
      data.badgeTypes = ['Community', 'Skill', 'Knowledge', 'Showcase'];
      data.badgeCategories = results[2];
      res.render('badge/edit.html', data);
    }
  );
};

exports.getBackgrounds = function getBackgrounds(req, res, next) {
  fs.readdir(path.join(__dirname, '../static', studioPath, 'backgrounds'), function(err, files) {
    if (err)
      return res.send(500, err);

    var backgrounds = files.map(function(file) {
      return { id: file,
               image: res.locals.static(path.join(studioPath, 'backgrounds', file)) };
    });

    res.send(200, { backgrounds: backgrounds });
  });
};

exports.getTexts = function getTexts(req, res, next) {
  fs.readdir(path.join(__dirname, '../static', studioPath, 'texts'), function(err, files) {
    if (err)
      return res.send(500, err);

    var texts = files.map(function(file) {
      return { id: file,
               image: res.locals.static(path.join(studioPath, 'texts', file)) };
    });

    res.send(200, { texts: texts });
  });
};

exports.getIcons = function getIcons(req, res, next) {
  fs.readdir(path.join(__dirname, '../static', studioPath, 'icons'), function(err, files) {
    if (err)
      return res.send(500, err);

    var icons = files.map(function(file) {
      return { id: file,
               image: res.locals.static(path.join(studioPath, 'icons', file)) };
    });

    res.send(200, { icons: icons });
  });
};

exports.getColors = function getColors(req, res, next) {
  fs.readdir(path.join(__dirname, '../static', studioPath, 'colors'), function(err, files) {
    if (err)
      return res.send(500, err);

    var colors = files.map(function(file) {
      return { id: file,
               image: res.locals.static(path.join(studioPath, 'colors', file)) };
    });

    res.send(200, { colors: colors });
  });
};

function saveBadge(req, callback) {
  const timeValue = parseInt(req.body.timeValue, 10);
  const limitNumber = parseInt(req.body.limitNumber, 10);
  const numCriteria = parseInt(req.body.numCriteria, 10);
  const numAlignments = parseInt(req.body.numAlignments, 10);

  const query = {
    id: req.body.badgeId,
    name: req.body.name,
    description: req.body.description,
    issuerUrl: req.body.issuerUrl,
    earnerDescription: req.body.earnerDescription,
    consumerDescription: req.body.consumerDescription,
    rubricUrl: req.body.rubricUrl,
    timeValue: timeValue > 0 ? timeValue : 0,
    timeUnits: req.body.timeUnits,
    limit: req.body.limit == 'limit' ? (limitNumber > 0 ? limitNumber : 0) : 0,
    unique: req.body.unique == 'unique' ? 1 : 0,
    multiClaimCode: req.body.multiClaimCode,
    badgeType: req.body.badgeType,
    milestoneNumRequired: req.body.milestoneNumRequired,
    isMilestone: req.body.isMilestone == 'yes' ? 1 : 0,
    evidenceType: req.body.evidenceType || null
  };

  if ('shape' in req.body) query.studioShape = req.body.shape;
  if ('textType' in req.body) query.studioTextType = req.body.textType;
  if ('textContents' in req.body) query.studioTextContents = req.body.textContents;
  if ('icon' in req.body) query.studioIcon = req.body.icon;
  if ('color' in req.body) query.studioColor = req.body.color;

  Badge.put(query, function (err, result) {
    if (err)
      return callback(err);

    Badge.getOne({ id: result.row.id }, function(err, badgeRow) {
      if (err)
        return callback(err);

      async.parallel([
        function(innerCallback) {
          if ('criteria' in req.body) {
            const criteria = req.body.criteria.slice(0,numCriteria).map(function(criterion) {
              return {
                id: criterion.id || null,
                description: criterion.description,
                required: criterion.required == 'on' ? 1 : 0,
                note: criterion.note
              };
            });

            badgeRow.setCriteria(criteria, function(err) {
              return innerCallback(err);
            });
          }
          else {
            return innerCallback(null);
          }
        },
        function(innerCallback) {
          if ('alignments' in req.body) {
            const alignments = req.body.alignments.slice(0,numAlignments).map(function(alignment) {
              return {
                id: alignment.id || null,
                name: alignment.name,
                url: alignment.url,
                description: alignment.description
              };
            });

            badgeRow.setAlignments(alignments, function(err) {
              return innerCallback(err);
            });
          }
          else {
            return innerCallback(null);
          }
        },
        function(innerCallback) {
          var image = req.files ? (req.files.studioImage || req.files.uploadImage) : null;

          if (image) {
            var path = image.path;
            var type = image.type;

            fs.stat(path, function (err, stats) {
              if (err)
                return innerCallback(err);

              if (stats.size > (256 * 1024))
                return innerCallback(new Error('Maximum image size is 256 KB'));

              // Need to determine acceptable mime types... this is just accepting everything right now.
              fs.readFile(path, function(err, data) {
                if (err)
                  return innerCallback(err);

                const imageQuery = {
                  id: badgeRow.imageId,
                  mimetype: type,
                  data: data,
                  url: null
                };

                Image.put(imageQuery, function(err, imageResult) {
                  if (err)
                    return innerCallback(err);

                  if (badgeRow.imageId === null) {
                    Badge.put({ id: badgeRow.id, imageId: imageResult.insertId }, function(err, result) {
                      return innerCallback(err);
                    });
                  }
                  else {
                    return innerCallback(null);
                  }
                });
              });
            });
          }
          else {
            return innerCallback(null);
          }
        },
        function(innerCallback) {
          if (!('category' in req.body))
            return innerCallback(null);

          badgeRow.setCategories(req.body.category, innerCallback);
        },
        function(innerCallback) {
          var supportBadges = req.body.supportBadges || [];

          badgeRow.setSupportBadges(supportBadges, innerCallback);
        },
        function(innerCallback) {
          if (!('tags' in req.body))
            return innerCallback(null);

          badgeRow.setTags(req.body.tags, innerCallback);
        }],
        function(err) {
          callback(err, badgeRow);
        }
      );
    });
  });
};

exports.save = function save (req, res, next) {
  saveBadge(req, function(err, row) {
    if (err)
      return res.send(500, err.message);

    if (!('notification' in req.session)) {
      req.session.notification = 'saved';
    }

    return res.send(200, { location: res.locals.url('directory') + '?category=' + row.status });
  });
};

exports.archive = function archive (req, res, next) {
  const badgeId = req.params.badgeId;
  openbadger.getBadge(res.locals.makeContext({ badge: { slug: badgeId }}), function(err, badge) {
    if (err)
      return res.send(500, err);

    badge.archived = true;
    openbadger.updateBadge(res.locals.makeContext({ badge: badge }), function(err) {
      if (err)
        return res.send(500, err);

      req.session.notification = 'archived';

      return res.send(200);
    });
  });
};

exports.publish = function publish (req, res, next) {
  const badgeId = req.params.badgeId;
  async.series([
    function(callback) {
      if (req.body.skipSave) {
        return callback();
      }

      return saveBadge(req, callback);
    }
  ],
  function(err, results) {
    if (err)
      return res.send(500, err.message);

    Badge.getOne({ id: badgeId }, { relationships: true }, function(err, row) {
      if (err)
        return res.send(500, err.message);

      if (!res.locals.hasPermission({ system: row.system, issuer: row.issuer, program: row.program }, 'publish'))
        return res.send(403, 'You do not have permission to publish this badge');

      if (row.published)
        return res.send(500, 'This badge has already been published');

      var badge = openbadger.toOpenbadgerBadge(row);

      openbadger.createBadge({ system: row.system, issuer: row.issuer, program: row.program, badge: badge }, function(err, newBadge) {
        if (err) {
          if ((/^ResourceConflictError/).test(err.toString())) {
            return res.send(409, 'A badge with that name already exists');
          }
          return res.send(500, err.message);
        }

        Badge.put({ id: badgeId, published: true }, function(err, result) {
          if (err)
            return res.send(500, err.message);

          if (row.isMilestone) {
            async.map(row.supportBadges, function (supportBadge, callback) {
              openbadger.getBadge({ system: row.system, badge: supportBadge.supportBadgeSlug }, callback);
            },
            function (err, supportBadges) {
              if (err)
                return console.log('Error creating milestone: ' + err.message);

              var milestone = { numberRequired: row.milestoneNumRequired, action: row.milestoneAction, primaryBadgeId: newBadge.id, supportBadges: [] };
              supportBadges.forEach(function(supportBadge) {
                milestone.supportBadges.push(supportBadge.id);
              });

              openbadger.createMilestone({ system: row.system, milestone: milestone}, function (err) {
                if (err)
                  return console.log('Error creating milestone: ' + err.message)
              });
            });
          }

          req.session.lastCreatedId = badge.slug;
          req.session.notification = 'published';
          return res.send(200, { location: res.locals.url('directory') + '?category=published' });
        });
      });
    });
  });
};

exports.copy = function copy (req, res, next) {
  const badgeId = req.params.badgeId;

  openbadger.getBadge(res.locals.makeContext({ badge: { slug: badgeId }}), function(err, badge) {
    if (err)
      return res.send(500, err);

    var context = {
      system: badge.system ? badge.system.slug : undefined,
      issuer: badge.issuer ? badge.issuer.slug : undefined,
      program: badge.program ? badge.program.slug : undefined
    }

    if (!res.locals.hasPermission(context, 'draft'))
      return res.send(403, 'You do not have permission to create a badge');

    Image.put({ url: badge.imageUrl }, function(err, imageResult) {
      if (err)
        return res.send(500,err);

      badge = openbadger.toBadgekitBadge(badge);
      delete badge.id;
      delete badge.lastUpdated;
      badge.created = new Date();
      delete badge.imageUrl;
      badge.imageId = imageResult.insertId;
      var criteria = badge.criteria;
      delete badge.criteria;
      var alignments = badge.alignments;
      delete badge.alignments;
      var categories = badge.categories;
      delete badge.categories;
      var tags = badge.tags;
      delete badge.tags;
      var supportBadges = badge.supportBadges;
      delete badge.supportBadges;
      badge.status = 'draft';
      badge.system = context.system;
      badge.issuer = context.issuer;
      badge.program = context.program;
      badge.slug = Badge.generateSlug();
      Badge.put(badge, function (err, badgeResult) {
        if (err) {
          return res.send(500, err);
        }

        Badge.getOne({ id: badgeResult.insertId }, function(err, badgeRow) {
          if (err) {
            return res.send(500, err);
          }

          async.parallel([
            badgeRow.setCriteria.bind(badgeRow, criteria),
            badgeRow.setAlignments.bind(badgeRow, alignments),
            badgeRow.setCategories.bind(badgeRow, categories),
            badgeRow.setTags.bind(badgeRow, tags),
            badgeRow.setSupportBadges.bind(badgeRow, supportBadges),
            ],
            function(err, results) {
              if (err) {
                return res.send(500, err);
              }

              return res.send(200, { location: res.locals.url('directory') + '?category=draft' })
            }
          );
        });
      });
    });
  });
};

exports.image = function image (req, res, next) {
  const badgeId = req.params.badgeId;

  Badge.getOne({ id: badgeId }, { relationships: true }, function(err, row) {
    if (err)
      return res.send(500, err);

    if (row) {
      if (row.image.id !== null) {
        if (row.image.url === null) {
          res.type(row.image.mimetype);
          return res.send(row.image.data);
        }
        else {
          var location = row.image.url.toString('ascii');
          res.header('Location', location);
          return res.send(301, {location: location});
        }
      }
      else {
        res.sendfile(path.join(__dirname, '../static/images/badge-template-1.png'));
      }
    }
    else {
      res.send(404);
    }
  });
};

exports.renderIssueByEmail = function renderIssueByEmail (req, res, next) {
  const badgeId = req.params.badgeId;

  openbadger.getBadge(res.locals.makeContext({ badge: { slug: badgeId }}), function(err, data) {
    if (err)
      return res.send(500, err);

    data = openbadger.toBadgekitBadge(data);
    res.render('badge/issue-by-email.html', { badge: data });
  });
};

exports.issueByEmail = function issueByEmail (req, res, next) {
  var query = res.locals.makeContext({ badge: { slug: req.body.badgeId }, email: req.body.email });

  return openbadger.createBadgeInstance(query, function (err, data) {
    return res.redirect(302, res.locals.url('directory') + '?category=published');
  });
};

exports.renderIssueByClaimCode = function renderIssueByClaimCode (req, res, next) {
  const badgeId = req.params.badgeId;

  openbadger.getBadge(res.locals.makeContext({badge: { slug: badgeId }}), function(err, data) {
    if (err)
      return res.send(500, err);

    data = openbadger.toBadgekitBadge(data);
    res.render('badge/issue-by-claim-code.html', { badge: data });
  });
};

exports.issueByClaimCode = function issueByClaimCode (req, res, next) {
  // openbadger does not yet support generation of claim codes via its API
  return middleware.redirect('directory', 302)(req, res, next);
};
