var mongoose = require('mongoose')
  , RichUser = mongoose.model('RichUser')
  , _ = require('underscore')

module.exports = {
	load: function(req, res, next){
		if( _.isUndefined(req.user ) )
			return next(new Error('User not pass'))
		else{

			RichUser.findOne({user: req.user.id}).exec(function(err, richUser){
				if(err) next(err)
				if (!richUser) return next(new Error('not found'))
				req.richUser = richUser
				next()
			})
		}

	}
}