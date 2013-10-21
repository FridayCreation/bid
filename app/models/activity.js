var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , notification = require('../../config/notification')

var ActivitySchema = new Schema({
  type: { type: String },
  identity: { type: Schema.ObjectId },
  remark: { type: String, default: ''},
  event: { type: String, default: ''},
  createdAt: { type : Date, default : Date.now }
},{ strict: false, 
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    } 
})

ActivitySchema
  .virtual('channel')
  .get(function(channel) {
    return this.type + '/' + this.identity
  })

ActivitySchema.statics = {
	add: function(model, identity, options, cb) {
		var activity = new this()

		activity.type = model
		activity.identity = identity
		activity.event = options.event || ''
		activity.remark = options.remark || ''
		

		activity.save(function(err, act){
			if(err) cb(err, null)
			else{
				if( options.notify )
					notification.send( act.channel, act.toJSON() )
				cb(null, act)
			}
			
		})
	}

}

ActivitySchema.index({ "type": 1, "createdAt": -1})
mongoose.model('Activity', ActivitySchema)
