
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Product = mongoose.model('Product')
  , fs = require('fs')

var cookies, count, owner

describe('Products', function () {
	describe('CRUD', function () {
		
			before(function (done) {
		        Product.count(function (err, cnt) {
		          count = cnt
		        })

		        var user = new User({
			      email: 'vendor@example.com',
			      name: 'Ven dor ',
			      username: 'vendor',
			      password: 'foobar'
			    })
			    user.save(function(err, doc){
			    	if(err){
			    		User.findOne({name: 'vendor'}).exec(function(err, doc){
			    			owner = doc
			    			done()
			    		})
			    	}
			    	else{
			    		owner = doc
			    		done()
			    	}	    	
			    })
		        
		    });

		    it('(POST) fail if upload with no image', function (done) {
		    	User.findOne({ username: 'vendor' }).exec(function (err, user) {
		          request(app)
		          .post('/api/product')
		          .field('authToken', user.authToken)
		          .expect(/no picture cannot create/)
		          .end(function(err, res){
			        if (err) return done(err);
			        done()
			      });
		        });
		    });

		    it('(POST)invalid params - should respond with errors', function (done) {
		    	this.timeout(15000);
		    	User.findOne({ username: 'vendor' }).exec(function (err, user) {
		          request(app)
		          .post('/api/product')
		          .field('authToken', user.authToken)
		          .attach('images', 'test/x.png')
		          .expect(/Validation failed/)
		          .end(function(err, res){
			        if (err) return done(err);
			        done()
			      });
		        });
		        
		    });

		    it('(POST)create a product success', function (done) {
		    	this.timeout(15000);
		    	var t = new Date();
				t.setSeconds(t.getSeconds() + 10);

		    	request(app)
		    	.post('/api/product')
		    	.field('authToken', owner.authToken)
		    	.field('name', 'First')
		    	.field('description', 'This is the description')
			    .field('base_price', '12')
			    .field('tags', 'phone,HTC,kevin')
			    .field('reference_urls[0]', 'http://inx.io')
			    .field('date_start', new Date().toISOString())
			    .field('date_end', t.toISOString())
			    .attach('images', 'test/x.png')
			    .expect(200)
			    .expect(/"success":true/)
		    	.end(done)
		    });

		    it('should insert a record to the database', function (done) {
		        Product.count(function (err, cnt) {
		          cnt.should.equal(count + 1)
		          done()
		        })
		      })


			it('(GET)fetch product via restful', function (done) {
				Product.findOne({'name':'First'}).exec(function(err, product){
					product.id.should.not.be.empty
					request(app)
					.get('/api/product/'+product.id)
					.expect(200)
					.expect(/"name":"First"/)
					.expect(/"state"/)
					.end(done)
				})
			});
	});
});