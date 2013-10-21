module.exports = function(app, passport) {
  
  // Load middleware
  var auth = require('../config/middlewares/authorization')

  // Load controllers
  var users = require('./controllers/users')
  var products = require('./controllers/products')
  var bids = require('./controllers/bids')
  var richUsers = require('./controllers/richUsers')

  // set api header
  app.all('/api/*',function(req,res,next){
    res.setHeader('content-type','text/json; charset=UTF-8');
    res.setHeader("Access-Control-Allow-Origin", "*");
    next(); 
  });

  // Middleware combo
  TokenAuthentication = [ auth.requireAuthentication, users.load ]
  RichUserTokenAuthentication = [ TokenAuthentication, richUsers.load ]

  app.get('/api', auth.requireAuthentication);
  app.post('/api', TokenAuthentication, function(req, res){
      res.send('API is working')
  });

  app.post('/api/superme', RichUserTokenAuthentication, function(req, res){
    res.send(req.richUser)
  })

  // Require authToken on post, put, del methods, get method should always safe
  app.post('/api/*', TokenAuthentication);
  app.put('/api/*', TokenAuthentication);
  app.del('/api/*', TokenAuthentication);

  // Routes going here ...
  app.get('/api/product/:pid', products.fetch);
  app.post('/api/product', products.photos, products.create);
  app.param('pid', products.product)

  // bids
  app.post('/api/product/:pid/bid', RichUserTokenAuthentication, products.product, bids.bid)
}