var Badge = require('../app/models/badge')("TEST_DATABASE");
var helpers = require('./');

describe('Badge Model', function () {

  before(function (done) {
    helpers.recreateDatabase({ up: true }, done); 
  });

  it('should default to draft', function (done) {
    Badge.put({ name: 'My cool badge' }, function (err, result) {
      if (err) return done(err);
      Badge.getOne({}, function (err, row) {
        if (err) return done(err);
        row.should.have.property('status', 'draft');
        return done();
      });
    });
  });

});