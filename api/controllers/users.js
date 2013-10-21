var mongoose = require('mongoose')
  , User = mongoose.model('User')

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

exports.update = function(req, res){
	res.send('update')
}

exports.fetch = function(req, res){
	res.send('fetch')
}

exports.remove = function(req, res){
	res.send('remove')
}