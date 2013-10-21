
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Article = mongoose.model('Article')
  , User = mongoose.model('User')
  , Product = mongoose.model('Product')
  , Activity = mongoose.model('Activity')

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(cb)
    },
    function (cb) {
      Product.collection.remove(cb)
    }
    // ,
    // function (cb) {
    //   Activity.collection.remove(cb)
    // }
  ], done)
}
