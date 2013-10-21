var faye = require('faye');
var client = new faye.Client('http://localhost:8000/faye');

module.exports = {
	send: function( channel, msg) {
		// msg should be a object type
		client.publish('/channel/'+ channel, {
			msg: JSON.stringify(msg)
		})
	}
}