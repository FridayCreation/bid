var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schedule = require('node-schedule')

var states = 'pending racing completed'.split(' ')

// Getters

var getTags = function (tags) {
  return tags.join(',')
}

// var getScheduler = function(scheduler){
//   return JSON.parse(scheduler)
// }

// Setters

var setTags = function (tags) {
  return tags.split(',')
}

// var setScheduler = function(scheduler){
//   return JSON.stringify(scheduler)
// }


var ProductSchema = new Schema({
  
  owner: {type: Schema.ObjectId, ref: 'User'},

  name: { type: String, default: ''},
  description: { type: String, default: ''},
  base_price: { type: Number, default: 0},
  current_price: { type: Number, default: 0},

  tags: {type: [], get: getTags, set: setTags},
  photos: [ { type: String } ],
  reference_urls: [{type: String}],
  hit: { type: Number, default: 0},
  
  date_start: {type : Date, default : Date.now},
  date_end: { type: Date },
  createdAt  : {type : Date, default : Date.now},
  scheduler: { 
    start: {type: Object},
    end: {type: Object}
  },
  policy: { type: String, default: 'private' },
  bids: [{
    value: { type : Number, default: 0 },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }]

},{ strict: false, 
    toObject: {
      virtuals: true
    }
    ,toJSON: {
      virtuals: true
    } 
})

/**
 * Virtuals
 */

ProductSchema
  .virtual('state')
  .get(function(state) {
    var now = Date.now()
    if ( now < this.date_start )
      this._state = 'pending'
    else if ( now < this.date_end )
      this._state = 'racing'
    else
      this._state = 'completed'
    return this._state
  })
  // .get(function() { return this._state })

// ProductSchema.set('toJSON', { getters: true, virtuals: false });

// Hooks
ProductSchema.pre('save', function (next) {
  next()
})

ProductSchema.post('save', function(next){
  // After save, we start the scheduler
  var self = this
  this.scheduler.start = schedule.scheduleJob( this.date_start, function(){
    self.start() 
  })
  this.scheduler.end = schedule.scheduleJob( this.date_end, function(){
    self.close() 
  })

})

ProductSchema.post('remove', function(next){
  next()
})

/**
 * Validations
 */

ProductSchema.path('name').validate(function (name) {
  return name.length > 0
}, 'Prodcut name cannot be blank')

ProductSchema.path('base_price').validate(function (base_price) {
  return base_price > 0
}, 'Product base price should be at least $1')

ProductSchema.path('date_end').validate( function (date_end){
  return date_end.length
}, 'The end date of prodcut doesn\'t valid ')

ProductSchema.path('date_start').validate( function (date_start){
  return date_start.length && date_start >= Date.now
}, 'The start date of the bid should be a datetime that in the future')

ProductSchema.path('date_end').validate( function (date_end){
  return date_end.length && date_end >= date_start
}, 'The end date of the bid should be a datetime later than start date')

ProductSchema.methods = {
  start: function(){
    // console.log( 'product started')
  },

  close: function(){
    // console.log( 'product close ')
  }
}

ProductSchema.statics = {
	load: function (id, cb) {
	  this.findOne({ _id : id })
	    .populate('owner', 'name email username')
	    .exec(cb)
	},

	report: function( id, cb){
		this.findOne({ _id : id })
	    .populate('owner', 'name email username')
	    .exec(cb)
	}

}


ProductSchema.index({ 'owner': 1, 'date_start': -1, 'date_end': -1, 'createdAt': -1})

mongoose.model('Product', ProductSchema)
