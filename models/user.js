var mongoose 				= require("mongoose"),
	passportLocalMongoose 	= require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	groups: Array,
	tasks:[ 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Task"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);