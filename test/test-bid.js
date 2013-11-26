
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

var cookies, count, owner, product

describe('Bids behavior', function () {
	
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

	        var t = new Date();
				t.setSeconds(t.getSeconds() + 10);

	        var product = new Product({
	        	'name': 'First',
		    	'description': 'This is the description',
			    'base_price': '12',
			    'tags': 'phone,HTC,kevin',
			    'photos': ['http://i.inx.io/4'],
			    'reference_urls': 'http://inx.io',
			    'date_start': new Date().toISOString(),
			    'date_end': t.toISOString()
	        })

	        product.save(function(err, doc){})

		    user.save(function(err, doc){
		    	if(err){
		    		User.findOne({username: 'vendor'}).exec(function(err, doc){
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

	    it('(POST)User bid a product', function (done) {
	    	Product.findOne({name: 'First'}).exec(function(err, pro){
	    		pro.should.have.property('id')
	    		product = pro
	    		request(app)
	    		.post('/api/product/'+pro.id+'/bid')
	    		.field('access_token', owner.authToken)
	    		.field('value', '30')
	    		.expect(200)
	    		.end(done)
	    	})
	    });

	    it('User should listen product channel', function(done){
	    	User.findOne({ username: 'vendor'}).exec(function(err, doc){
    			owner = doc
    			owner.subscribes.should.be.instanceof(Array)
    			owner.subscribes[0].should.equal('Product/'+product.id)
    			done()
    		})
	    });

	    it('(POST) fail if bid price lower than current', function (done) {
	    	Product.findOne({name: 'First'}).exec(function(err, pro){
	    		pro.should.have.property('id')
	    		request(app)
	    		.post('/api/product/'+pro.id+'/bid')
	    		.field('access_token', owner.authToken)
	    		.field('value', '11')
	    		.expect(200)
	    		.expect(/Bid value lower than current/)
	    		.end(done)
	    	})
	    });

		
});