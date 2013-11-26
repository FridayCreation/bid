module.exports = function(app, passport) {
  
  // Load controllers
  var users = require('./controllers/users')
  var products = require('./controllers/products')
  var bids = require('./controllers/bids')

  // set api header
  app.all('/*',function(req,res,next){
    res.setHeader('content-type','text/json; charset=UTF-8');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next(); 
  });

  // Middleware combo
  TokenAuthentication = passport.authenticate('bearer', { session: false })

  app.all('/api', TokenAuthentication, function(req, res){
    res.send({ username: req.user.username, email: req.user.email });
  });

  // Require authToken on post, put, del methods, get method should always safe
  app.post('/api/*', TokenAuthentication);
  app.put('/api/*', TokenAuthentication);
  app.del('/api/*', TokenAuthentication);

  // Routes going here ...
  app.get('/api/product/:pid', products.fetch);
  app.post('/api/product', products.photos, products.create);
  app.param('pid', products.product)

  // bids
  app.post('/api/product/:pid/bid', products.product, bids.bid)
}