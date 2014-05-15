const validator = require('validator');
const openbadger = require('../lib/openbadger');
const async = require('async');

const Account = require('../models/account')("DATABASE");
const AccountPermission = require('../models/account-permission')("DATABASE");

exports.home = function home (req, res, next) {
  getSystems(res.locals.hasPermission, function(err, data) {
    if (err)
      return res.send(500, err);

    data.issuersUrl = res.locals.url('settings.issuers');
    data.programsUrl = res.locals.url('settings.programs');
    data.systemsUrl = res.locals.url('settings.systems');
    data.usersUrl = res.locals.url('settings.users');

    return res.render('settings/home.html', data);
  });
};

exports.systems = function systems (req, res, next) {
  getSystems(res.locals.hasPermission, function(err, data) {
    if (err)
      return res.send(500, err);

    return res.send(200, data);
  });
}

function getSystems(hasPermission, callback) {
  openbadger.getSystems(function(err, systemData) {
    if (err)
      return callback(err)

    var data = { systems: [] };

    systemData.forEach(function(system) {
      var context = { system: system.slug };
      if (hasPermission(context, 'view')) {
        system.canAdmin = hasPermission(context, 'admin');
        delete system.issuers;
        data.systems.push(system);
      }
    });

    return callback(null, data);
  });
}

exports.issuers = function issuers (req, res, next) {
  const systemSlug = req.query.systemSlug;
  const issuerSlug = req.query.issuerSlug;

  if (typeof issuerSlug === 'undefined' || issuerSlug === null) {
    openbadger.getIssuers( { system: systemSlug }, function(err, issuerData) {
      if (err)
        return res.send(500, err);

      var data = { issuers: [] };

      issuerData.forEach(function(issuer) {
        var context = { system: systemSlug, issuer: issuer.slug };
        if (res.locals.hasPermission(context, 'view')) {
          issuer.canAdmin = res.locals.hasPermission(context, 'admin');
          delete issuer.programs;
          data.issuers.push(issuer);
        }
      });

      return res.send(200, data);
    });
  }
  else {
    var context = { system: systemSlug, issuer: issuerSlug };
    if (res.locals.hasPermission(context, 'view')) {
      openbadger.getIssuer(context, function(err, issuerData) {
        return res.send(200, { issuer: issuerData });
      });
    }
    else {
      return res.send(403, 'Access Denied');
    }
  }
};

exports.programs = function issuers (req, res, next) {
  const systemSlug = req.query.systemSlug;
  const issuerSlug = req.query.issuerSlug;
  const programSlug = req.query.programSlug;

  if (typeof programSlug === 'undefined' || programSlug === null) {
    openbadger.getPrograms( { system: systemSlug, issuer: issuerSlug }, function(err, programData) {
      if (err)
        return res.send(500, err);

      var data = { programs: [] };

      programData.forEach(function(program) {
        var context = { system: systemSlug, issuer: issuerSlug, program: program.slug };
        if (res.locals.hasPermission(context, 'view')) {
          program.canAdmin = res.locals.hasPermission(context, 'admin');
          delete program.programs;
          data.programs.push(program);
        }
      });

      return res.send(200, data);
    });
  }
  else {
    var context = { system: systemSlug, issuer: issuerSlug, program: programSlug };
    if (res.locals.hasPermission(context, 'view')) {
      openbadger.getProgram(context, function(err, programData) {
        return res.send(200, { program: programData });
      });
    }
    else {
      return res.send(403, 'Access Denied');
    }
  }
};

exports.users = function users (req, res, next) {
  const systemSlug = req.query.systemSlug;
  const issuerSlug = req.query.issuerSlug;
  const programSlug = req.query.programSlug;
  const email = req.query.email;

  var query = { system: systemSlug,
                issuer: issuerSlug || null,
                program: programSlug || null };

  if (!res.locals.hasPermission(query, 'admin')) {
    return res.send(403, 'Access Denied');
  }

  if (typeof email === 'undefined' || email === null) {
    AccountPermission.get(query, { relationships: true }, function(err, data) {
      if (err)
        return res.send(500, err);

      return res.send(200, { users: data });
    });
  }
  else {
    Account.getOne({ email: email }, function(err, accountRow) {
      if (err)
        return res.send(500, err);

      if (!accountRow)
        return res.send(404, 'User Not Found');

      query.accountId = accountRow.id;

      AccountPermission.getOne(query, function(err, permissionRow) {
        if (err)
          return res.send(500, err);

        if (!permissionRow)
          return res.send(404, 'User Not Found');

        permissionRow.email = accountRow.email;

        var canEdit = permissionRow.email !== req.session.email;

        return res.send(200, { user: permissionRow, canEdit: canEdit });
      });
    });
  }
};

exports.editUser = function editUser (req, res, next) {
  const email = req.body.email;

  if (!validator.isEmail(email))
    return res.send(500, 'Invalid email address');

  const context = { system: req.body.systemSlug,
                    issuer: req.body.issuerSlug || null,
                    program: req.body.programSlug || null };

  const permissions = { canDraft: req.body.canDraft ? true : false,
                        canPublish: req.body.canPublish ? true : false,
                        canReview: req.body.canReview ? true : false };

  if (!res.locals.hasPermission(context, 'admin') || email === req.session.email) {
    return res.send(403, 'Access Denied');
  }

  function finish(row) {
    row.setPermission(context, permissions, function(err, result) {
      if (err)
        return res.send(500, err);

      result.row.email = email;

      return res.send(200, { user: result.row, canEdit: true });
    });
  }

  Account.getOne({ email: email }, function(err, accountRow) {
    if (err)
      return res.send(500, err);

    if (!accountRow) {
      Account.put({ email: email}, function(err, result) {
        if (err)
          return res.send(500, err);

        Account.getOne({ id: result.insertId }, function(err, newRow) {
          if (err)
            return res.send(500, err);

          return finish(newRow);
        });
      });
    }
    else {
      return finish(accountRow);
    }
  });
};

exports.deleteUser = function deleteUser (req, res, next) {
  const email = req.body.email;

  const context = { system: req.body.systemSlug,
                    issuer: req.body.issuerSlug || null,
                    program: req.body.programSlug || null };

  if (!res.locals.hasPermission(context, 'admin')) {
    return res.send(403, 'Access Denied');
  }

  Account.getOne({ email: email }, function(err, accountRow) {
    if (err)
      return res.send(500, err);

    if (!accountRow)
      return res.send(404, 'User Not Found');

    accountRow.setPermission(context, null, function(err) {
      if (err)
        return res.send(500, err);

      return res.send(200);
    });
  });
};

function nameSort(a, b) {
  if (a.name.toUpperCase() > b.name.toUpperCase())
    return 1;
  return -1;
};

exports.context = function context (req, res, next) {
  var data = { dataUrl: res.locals.url('settings.contextData') };
  return res.render('settings/context.html', data);
}

exports.setContext = function setContext (req, res, next) {
  var context = { system: req.body.system };

  if (req.body.issuer)
    context.issuer = req.body.issuer;

  if (req.body.program)
    context.program = req.body.program;

  req.session.context = context;
  res.send(200, { location: res.locals.url('directory') });
}

exports.contextData = function contextData (req, res, next) {
  var util = require('util');
  openbadger.getSystems(function(err, systems) {
    if (err) {
      console.log("error! " + err);
      return next(err);
    };

    var data = { systems: [] };

    async.each(systems, function(system, innerCallback) {
      if (res.locals.hasPermission({ system: system.slug }, 'view')) {
        openbadger.getIssuers({ system: system.slug }, function(err, issuers) {
          if (err) {
            console.log("inner error" + util.inspect(err));
            return innerCallback(err);
          };

          system.issuers = [];

          if (issuers) {
            issuers.forEach(function(issuer) {
              if (res.locals.hasPermission({ system: system.slug, issuer: issuer.slug }, 'view')) {

                var programs = [];

                if (issuer.programs) {
                  issuer.programs.forEach(function(program) {
                    if (res.locals.hasPermission({ system: system.slug, issuer: issuer.slug, program: program.slug }, 'view')) {
                      programs.push({ name: program.name, slug: program.slug });
                    }
                  });
                };
                programs.sort(nameSort);
                system.issuers.push({ name: issuer.name, slug: issuer.slug, programs: programs });
              }
            });
          };

          system.issuers.sort(nameSort);
          data.systems.push({ name: system.name, slug: system.slug, issuers: system.issuers });

          return innerCallback();
        });
      }
      else {
        return innerCallback();
      }
    },
    function(err) {
      if (err) {
        console.log("error" + err);
        return next(err);
      }

      data.systems.sort(nameSort);
      return res.send(200, data);
    });
  });
}
