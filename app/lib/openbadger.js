var config = require('./config');

exports = module.exports = require('openbadger-client')(
  config('OPENBADGER_URL'),
  config('OPENBADGER_SECRET')
);

