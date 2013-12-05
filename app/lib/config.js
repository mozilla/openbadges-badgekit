const path = require('path');

var config = require(path.join(__dirname, '../../lib/config'));

try {
  exports = module.exports = config(path.join(__dirname, '../../config.json'));
} catch (e) {
  exports = module.exports = config();
}