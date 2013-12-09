var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')

exports.load = function(req, res, next){

  User.loadByToken( req.body.authToken , function (err, user) {
    if (err) return next(err)
    if (!user) return next(new Error('not found'))
    req.user = user
    next()
  })
}

exports.create = function(req, res){
	res.send('create')
}

exports.update = function(req, res, next){
	req.body = _.pick(
    req.body,
    'contacts',
    'name',
    'username'
  )

  if( _.isArray(req.body.contacts) ){
    
    contacts = []
    for( var i in req.body.contacts ){
      contact = JSON.parse(req.body.contacts[i])
      for( var k in contact){
        contacts.push( {'method': k, 'value': contact[k]} )
      }
    }

    req.body.contacts = contacts

  }

  User.findOne({'_id': req.user.id}).exec(function(err, doc){
    updateUser = _.extend(doc, req.body)
    updateUser.save(function(err, user){
      if (err) return console.log(err)
      if (!user) return next(new Error('not found'))
      req.user = user
      res.send({'success': true, 'doc': user})
    })
  })
    

  


}

exports.fetch = function(req, res){
	res.send('fetch')
}

exports.remove = function(req, res){
	res.send('remove')
}