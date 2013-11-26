var mongoose = require('mongoose')
  , Product = mongoose.model('Product')
  , Activity = mongoose.model('Activity')
  , User = mongoose.model('User')
  , _ = require('underscore')

exports.bid = function(req, res){
  var user = req.user
  var pro = req.product
  var value = req.body.value
  var errorMsg = {'success': false, 'errors': 'Bid value lower than current' }
  var theBid = { user: req.user.id, value: value }

  //validate
  if( !_.isUndefined(pro.bids) && !_.isEmpty(pro.bids) ){
  	if( value > pro.base_price && value > pro.bids[0].value )
  		pro.bids.unshift( theBid )
  	else{
  		return res.send(errorMsg)
  	}
  } 
  else{
  	if( value > pro.base_price )
	  	pro.bids = [ theBid ]
	else
		return res.send(errorMsg)
  }

  pro.save(function(err, product){
  	if(err) 
  		return res.send({'success': false, 'errors': err })

  	Activity.add( 'Product', product.id , {event: 'bid', remark: value, notify: true}, function(err, act){
      if(err) res.send({'success': false, 'errors': err })
      else{
      	user.listen(act.channel, function(){
      		res.send({'success': true, doc: act})
      	})
      }
    })
  	// res.send('')

  })
}