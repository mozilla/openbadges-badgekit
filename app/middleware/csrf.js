function defaultCsrfValue (req) {
  return (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token']);
}

function whitelisted (list, input) {
  var pattern;

  for (var i = list.length; i--;) {
    pattern = list[i];
    if (RegExp('^' + list[i] + '$').test(input))
      return true;
  }

  return false;
}

function uid (len) {
  var buf = [];
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;
  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join('');
};

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports = module.exports = function (options) {
  options = options || {};
  var value = options.value || defaultCsrfValue;
  var list = options.whitelist || [];

  return function (req, res, next) {
    if (whitelisted(list, req.url))
      return next();

    var token = req.session._csrf || (req.session._csrf = uid(24));

    if ('GET' === req.method || 'HEAD' === req.method)
      return next();

    var val = value(req);
    if (val != token) {
      // logger.debug("CSRF token failure");
      return next(new Error('Forbidden - expecting "'+token+'", got "'+val+'"'));
    }

    next();
  };
};
