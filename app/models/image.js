var getDb = require('../lib/db').getDb;
var async = require('async');

module.exports = function getImageModel (key) {
  var db = getDb(key);

  var Image = db.table('image', {
    fields: 
      ['id',
       'mimetype',
       'data',
       'url']
  });

  return Image;
};

