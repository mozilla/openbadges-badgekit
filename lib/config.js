function normalise (value) {
  return (''+value).replace(/([^A-Z_])([A-Z])/g, '$1_$2').toUpperCase();
}

function parse (config) {
  var parsed = {};

  Object.keys(config).forEach(function (key) {
    var normalised = normalise(key);

    if (Object.prototype.toString.call(config[key]) === '[object Object]') {
      var subconfig = parse(config[key]);
      Object.keys(subconfig).forEach(function(key) {
        parsed[normalised+'_'+key] = subconfig[key];
      });
    } else {
      parsed[normalised] = config[key];
    } 
  });

  return parsed;
}

const argv = parse(require('optimist').argv);

exports = module.exports = function config (config) {
  if (typeof config === 'string')
    config = require(config);

  config = parse(config || {});

  return function (param, defaultValue) {
    param = normalise(param);

    if (param in argv)
      return argv[param];

    if (param in config)
      return config[param];

    if (param in process.env)
      return process.env[param];

    if (arguments.length > 1) {
      if (typeof defaultValue === 'function')
        return defaultValue(param);
      else
        return defaultValue;
    }

    throw new ReferenceError('Unable to find ' + param + ' configuration');
  }
}