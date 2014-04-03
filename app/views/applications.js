const openbadger = require('../lib/openbadger');

exports.home = function home (req, res, next) {
  const views = {
    'pending': pending,
    'awarded': awarded,
  };

  const view = req.query.view || 'pending';

  if (views.hasOwnProperty(view))
    return views[view](req, res, next);

  const error = new Error('Page Not Found');
  Object.defineProperties(error, {
    name: {value: 'ResourceNotFoundError'},
    code: {value: 404},
  });
  return next(error);
}

function pending (req, res, next) {
  const context = res.locals.makeContext();

  // There's currently no way to get only pending applications through the API
  openbadger.getApplications(context, function (err, applications) {
    if (err)
      return next(err);

    res.render('applications/pending-list.html', {
      applications: applications,
    });
  });
}

function awarded (req, res, next) {
  const context = res.locals.makeContext();

  // There's currently no way to get only awarded applications through the API
  openbadger.getApplications(context, function (err, applications) {
    if (err)
      return next(err);

    res.render('applications/awarded-list.html', {
      applications: applications,
    });
  });
}

exports.forBadge = function forBadge (req, res, next) {
  const context = res.locals.makeContext({
    badge: req.params.badgeId,
  });

  openbadger.getApplications(context, function (err, applications) {
    if (err)
      return next(err);

    res.render('applications/for-badge.html', {
      applications: applications,
    });
  });
}

exports.application = function application (req, res, next) {
  const context = res.locals.makeContext({
    badge: req.params.badgeId,
    application: req.params.applicationId,
  });

  openbadger.getApplication(context, function (err, application) {
    if (err)
      return next(err);

    // Does an application carry a state? `processed` is probably the best fit.
    const state = !!application.processed ? 'awarded' : 'pending';
    const template = 'applications/' + state + '-single.html';

    res.render(template, {
      application: application,
    });
  });
}
