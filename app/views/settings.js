const Account = require('../models/account')("DATABASE");
const openbadger = require('../lib/openbadger');

exports.home = function home (req, res, next) {
  getSystems(res.locals.hasPermission, function(err, data) {
    if (err)
      return res.send(500, err);

    data.issuersUrl = res.locals.url('settings.issuers');
    data.programsUrl = res.locals.url('settings.programs');
    data.systemsUrl = res.locals.url('settings.systems');
    
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

  if (typeof issuerSlug === 'undefined') {
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

  if (typeof programSlug === 'undefined') {
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