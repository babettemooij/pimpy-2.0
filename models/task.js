var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pimpy", {useMongoClient: true});

var taskSchema = new mongoose.Schema({
	todo: String,
	people: Array,
	group: String,
	status: String
});

module.exports = mongoose.model("Task", taskSchema);