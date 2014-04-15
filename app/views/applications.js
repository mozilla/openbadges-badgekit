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

    const badges = [];
    var currentBadge = {};
    applications.forEach(function (application) {
      if (application.badge.id !== currentBadge.id) {
        currentBadge = application.badge;
        currentBadge.applications = [];
        badges.push(currentBadge);
      }
      currentBadge.applications.push(application);
    })

    res.render('applications/pending-list.html', {
      badges: badges,
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

  function render (badge, applications) {
    res.render('applications/for-badge.html', {
      badge: badge,
      applications: applications || [],
    });
  }

  openbadger.getApplications(context, function (err, applications) {
    if (err)
      return next(err);

    if (applications.length)
      return render(applications[0].badge, applications);

    openbadger.getBadge(context, function (err, badge) {
      if (err)
        return next(err);

      render(badge);
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
      badge: application.badge,
      application: application,
    });
  });
}

exports.submitReview = function submitReview (req, res, next) {
  const context = res.locals.makeContext({
    badge: req.params.badgeId,
    application: req.params.applicationId,
    review: {
      author: req.session.email,
      comment: req.body.comment,
      reviewItems: req.body.reviewItems
    }
  });

  openbadger.addReview(context, function (err, review) {
    if (err)
      return next(err);

    return res.send(200, 'Success');
  });
};