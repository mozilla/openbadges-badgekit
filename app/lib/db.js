const path = require('path');
const fs = require('fs');
const streamsql = require('streamsql');
const config = require('./config');

var opts = config("DATABASE");
if (!opts['driver']) opts['driver'] = 'mysql';
module.exports = streamsql.connect(opts);
