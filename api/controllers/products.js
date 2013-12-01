var mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Activity = mongoose.model('Activity')
  , _ = require('underscore')
  , imgurS = require('../../config/imgur-service')
  , fs = require('fs')
  , async = require('async')


/**
 * Load
 */

exports.product = function(req, res, next, id){

  Product.load(id, function (err, product) {
    if (err) return next(err)
    if (!product) return next(new Error('not found'))
    req.product = product
    next()
  })
}

exports.photos = function(req, res, next){

  req.body.photos = []

  async.parallel([
    function(cb){
      // If images uploaded to server
      if( !_.isNull(req.files.images) && !_.isUndefined(req.files.images) ){
          
          if(!_.isArray(req.files.images)) req.files.images = [req.files.images]
          var imagesPaths = _.map( req.files.images, function(image){
            return image.path
          })
          imgurS.batchUpload( imagesPaths, function(err, results){

            if(err) return cb(err, null)
            req.body.photos = req.body.photos + results 
            cb(null, null)
          } )
            
      }
      else{
        cb(null,null)
      }
    },
    function(cb){
      // If images shared by url
      if( ! _.isNull(req.body.image_urls) && !_.isUndefined(req.body.image_urls)){

          if( !_.isArray(req.body.image_urls)) req.body.image_urls = [req.body.image_urls]
          imgurS.batchUpload( req.body.image_urls, function(err, results){
            if(err) return cb(err, null)
            req.body.photos.push.apply( req.body.photos, results )
            cb(null, null)
          } )
      }else{
        cb(null,null)
      }
    }], function(err, result){
      if( _.isEmpty(req.body.photos) ){
        return next(new Error('no picture cannot create'))
      }
      else{
        next()
      }
    }
  )
  

  
}

exports.create = function(req, res){
  req.body = _.pick(
    req.body,
    'name',
    'slug',
    'policy',
    'description',
    'base_price',
    'tags',
    'photos',
    'reference_urls',
    'date_start',
    'date_end'
  )
	var product = new Product(req.body)
  product.owner = req.user
  product.save(function(err, pro){
    if(err) 
      return res.send({'success': false, 'errors': err })
    // New activity when product created
    
    Activity.add( 'Product', pro.id , {event: 'new', notify: true}, function(err, act){
      if(err) res.send({'success': false, 'errors': err })
      else{
        res.send({'success': true, doc: pro})
      }
    })
    
  })
}

exports.update = function(req, res){
	res.send('update')
}

exports.fetch = function(req, res){
	res.send(req.product)
}

exports.remove = function(req, res){
	res.send('remove')
}