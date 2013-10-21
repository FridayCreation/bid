var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')


var RichUserSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  location: { type: String, default: ''},
  role: {type: String, default: ''},
  activate: { type: Boolean, default: true},
  bids: { type: Schema.ObjectId, ref: 'Product'},
  subscribes: [{ type: String, default: '/'}]
})

RichUserSchema.methods = {
	listen: function(channel,cb){
		if( !_.contains( this.subscribes, channel ))
			this.subscribes.append(channel)
		cb()
	},

	mute: function(channel,cb){
		var index = this.subscribes.indexOf(channel)
		if(  index > -1 ){
			this.subscribes.splice(index,index+1);
		}
		cb()
	}
}

mongoose.model('RichUser', RichUserSchema)