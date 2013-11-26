var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')


describe('End', function () {

	before(function (done) {
		require('./helper').clearDb(done)
	})

	it('should not find anything in db', function (done) {
		User.count(function (err, cnt) {
          cnt.should.equal(0)
          done()
        })
	});
});