
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../lib/utils')


var login = function (req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo)
    delete req.session.returnTo
    return
  }
  res.send({'info': req.user})
}

exports.signin = function (req, res) {

  console.log( 'signin success ')
}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  // res.redirect('/login')
  res.send( {'success': true})
}

/**
 * Session
 */

exports.session = login

/**
 * Create user
 */

exports.create = function (req, res) {

  var user = new User(req.body)
  user.provider = 'local'
  user.save(function(err, user){
    if(err){
      res.send({
        'errors': err.errors,
        user: user
      })
    }
    else{
      res.send( {'success': true, 'doc': user})
      // req.logIn(user, function(err){
      //   if( err)
      //     res.send( {'success': false, err: error})
      //   else
      //     res.send( {'success': true})
      // });
      
      // var notify = require('../mailer/notify')
      // notify.welcome({
      //   currentUser: user
      // });
    }
  })


}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
