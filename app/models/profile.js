var mongoose = require('mongoose'),
bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var ProfileSchema = mongoose.Schema({
	FirstName 		:  		String,
	LastName   		:  		String,
	About			: 		String,
	PhotoUrl 		: 		String,
	PhotoSource		: 		String,
	randomNumb		:     	Number
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Profile', ProfileSchema);