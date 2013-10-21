/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , articles = require('../app/controllers/articles')
  , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  
  app.post('/users', users.create)

  app.post('/users/session', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.send({'errors': info.message })
      }
      // req.logIn(user, function(err) {
      //   if (err) { return next(err); }
      return res.send({'success': true, 'user': user});
      // });


    })(req, res, next);
  });

  // app.del('/users/session', users.logout);

  // app.get('/users/:userId', users.show);

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

  // article routes
  // app.get('/articles', articles.index)
  // app.get('/articles/new', auth.requiresLogin, articles.new)
  // app.post('/articles', auth.requiresLogin, articles.create)
  // app.get('/articles/:id', articles.show)
  // app.get('/articles/:id/edit', articleAuth, articles.edit)
  // app.put('/articles/:id', articleAuth, articles.update)
  // app.del('/articles/:id', articleAuth, articles.destroy)

  // app.param('id', articles.load)

  // // home route
  // app.get('/', articles.index)

  // // comment routes
  // var comments = require('../app/controllers/comments')
  // app.post('/articles/:id/comments', auth.requiresLogin, comments.create)
  // app.get('/articles/:id/comments', auth.requiresLogin, comments.create)

  // // tag routes
  // var tags = require('../app/controllers/tags')
  // app.get('/tags/:tag', tags.index)

}
