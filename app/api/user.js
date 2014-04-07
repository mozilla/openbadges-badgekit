const Account = require('../models/account')("DATABASE");

exports.addUser = function addUser (req, res, next) {
  const email = req.body.email;
  const context = { system: req.body.context.system,
                    issuer: req.body.context.issuer || null,
                    program: req.body.context.program || null };

  const permissions = { canDraft: req.body.permissions.canDraft ? true : false,
                        canPublish: req.body.permissions.canPublish ? true : false,
                        canReview: req.body.permissions.canReview ? true : false };

  function finish(row) {
    row.setPermission(context, permissions, function(err, result) {
      if (err)
        return next(err);

      result.row.email = email;

      return res.send(200, { user: result.row });
    });
  }

  Account.getOne({ email: email }, function(err, accountRow) {
    if (err)
      return next(err);

    if (!accountRow) {
      Account.put({ email: email}, function(err, result) {
        if (err)
          return next(err);

        Account.getOne({ id: result.insertId }, function(err, newRow) {
          if (err)
            return next(err);

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
  const context = { system: req.body.context.system,
                    issuer: req.body.context.issuer || null,
                    program: req.body.context.program || null };

  Account.getOne({ email: email }, function(err, accountRow) {
    if (err)
      return next(err);

    if (!accountRow) {
      var err = new Error('User not found');
      err.code = 404;
      return next(err);
    }

    accountRow.setPermission(context, null, function(err) {
      if (err)
        return next(err);

      return res.send(200);
    });
  });
};