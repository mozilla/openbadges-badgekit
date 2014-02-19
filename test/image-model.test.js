var Image = require('../app/models/image')("TEST_DATABASE");
var helpers = require('./');
var fs = require('fs');
var path = require('path');

describe('Image Model', function () {

  before(function (done) {
    helpers.recreateDatabase({ up: true }, done); 
  });

  it('should accept image data', function (done) {
    fs.readFile(path.join(__dirname, './test-image.png'), function (err, data) {
      if (err)
        return done(err);

      Image.put({ mimetype: 'image/png', data: data }, function (err, result) {
        if (err) return done(err);
        Image.getOne({}, function (err, row) {
          if (err) return done(err);
          row.should.have.property('mimetype', 'image/png');
          row.should.have.property('data');
          row.data.toString().should.be.exactly(data.toString());
          return done();
        });
      });
    });
  });
});
