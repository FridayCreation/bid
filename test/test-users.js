
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')

var cookies, count



/**
 * Users tests
 */

describe('Users', function () {
  describe('POST /users', function () {
    describe('Invalid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('no email - should respond with errors', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', '')
        .field('password', 'foobar')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(/Email cannot be blank/)
        .end(done)
      })

      it('should not save the user to the database', function (done) {
        User.count(function (err, cnt) {
          count.should.equal(cnt)
          done()
        })
      })
    })

    describe('Valid parameters', function () {
      before(function (done) {
        User.count(function (err, cnt) {
          count = cnt
          done()
        })
      })

      it('should return json include success:true', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /json/)
        // .expect('Location', /\//)
        .expect(200)
        // .expect(/Moved Temporarily/)
        .expect(/"success":true/)
        .end(done)
      })

      it('same email problem', function (done) {
        request(app)
        .post('/users')
        .field('name', 'Foo bar')
        .field('username', 'foobar')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect('Content-Type', /json/)
        // .expect('Location', /\//)
        .expect(200)
        // .expect(/Moved Temporarily/)
        .expect(/Email already exists/)
        .end(done)
        
      });

      it('should insert a record to the database', function (done) {
        User.count(function (err, cnt) {
          cnt.should.equal(count + 1)
          done()
        })
      })

      it('should save the user to the database', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.email.should.equal('foobar@example.com')
          done()
        })
      })

    })
    describe('Login', function () {
      it('Sign in with email and password', function (done) {
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .expect(200)
        .expect(/authToken/)
        .end(done)
      });
    });
    describe('AuthToken', function () {
      it('should contain access_token', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          should.not.exist(err)
          user.should.be.an.instanceOf(User)
          user.authToken.should.have.length(32)
          done()
        })
      })

      it('should not allow to access /api', function (done) {
        request(app)
        .get('/api')
        .expect(/Unauthorized/)
        .end(done)
      });

      it('should not allow access /api with wrong authToken', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          request(app)
          .post('/api')
          .field('access_token', '123')
          .expect(401)
          .expect(/Unauthorized/)
          .end(done)
        });
      });


      it('should allow access /api with authToken', function (done) {
        User.findOne({ username: 'foobar' }).exec(function (err, user) {
          request(app)
          .post('/api')
          .field('access_token', user.authToken)
          .expect(/foobar@example.com/)
          .end(done)
        });
      });
    });
  })

})
