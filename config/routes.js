/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  // , articles = require('../app/controllers/articles')
  // , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

// var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  
  app.get('/login', users.login)
  app.get('/join', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  // home route
  app.get('/', users.login)

  app.post('/users/session', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.send({'errors': info.message })
      }

      return res.send({'success': true, 'user': user});

    })(req, res, next);
  });


  // Get picture by http://graph.facebook.com/{facebook_id}/picture?type=square/large/small/normal
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin)

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback)

  app.param('userId', users.user)

}
