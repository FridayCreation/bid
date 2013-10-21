var imgur = require('imgur-node-api'),
	_ = require('underscore'),
	async = require('async');

imgur.setClientID('3dd6e9ef1e8fa8d');

module.exports = {

	upload: function(path, cb){
		imgur.upload(path, function(err,res){
			if(err) cb(err)
		    cb(res.data.link)
		});
	},

	batchUpload: function( paths, cb){

		// console.log( paths )
		async.map(paths, this.upload, function(results){
			if( _.all(results, function(elem){
				return typeof(elem) == 'string'
			}))
				cb(null,results)
			else{
				cb( _.find(results, function(elem){
					return typeof(elem) != 'string'
				}))
			}
	    })
	}

}