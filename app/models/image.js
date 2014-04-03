var getDb = require('../lib/db').getDb;

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

