var express 	= require("express");
	app 		= express();
	bodyParser 	= require("body-parser");
	mongoose 	= require("mongoose");

mongoose.connect("mongodb://localhost/pimpy", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/stylesheets'));
app.set("view engine", "ejs");

var taskSchema = new mongoose.Schema({
	todo: String,
	people: Array,
	status: String
});

var Task = mongoose.model("Task", taskSchema);

// Task.create(
// 	{
// 		todo: "Bestel shirts",
// 		people: ["Babette", "Roan"],
// 		status: "Not started"
// 	});

app.get("/", function(req, res){
	res.send("<h1> HOME PAGE BITCH </h1>")
});

app.get("/tasks", function(req, res){
	Task.find({}, function(err, tasks) {
		if(err) {
			console.log(err);
		} else {
			res.render("tasks", {tasks: tasks});
		}
	});
});

app.post("/tasks", function(req, res){
	var todo = req.body.todo;
	var people = req.body.people;
	var newTask = {
		todo: todo,
		people: people,
		status: "Not started"
	}
	Task.create(newTask, function(err, newTask) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/tasks");
		}
	});
});

app.listen(3000, process.env.IP);