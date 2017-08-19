var express 	= require("express");
	app 		= express();
	bodyParser 	= require("body-parser");
	mongoose 	= require("mongoose");

mongoose.connect("mongodb://localhost/pimpy", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/stylesheets'));
app.set("view engine", "ejs");

var groups = [
	{
		title: "FSR FNWI",
		members: [
			{
				name: "Babette Mooij",
				email: "babette_mooij@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Willemien zuilhof",
				email: "femke_mosterdt@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Not started"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Veerle Groot",
				email: "roan_jong@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			}

		]
	},
	{
		title: "DB",
		members: [
			{
				name: "Babette Mooij",
				email: "babette_mooij@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Femke Mostert",
				email: "femke_mosterdt@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Not started"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Roan de Jong",
				email: "roan_jong@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			}

		]
	},
	{
		title: "PR",
		members: [
			{
				name: "Babette Mooij",
				email: "babette_mooij@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Parcival Maissan",
				email: "femke_mosterdt@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Not started"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			},
			{
				name: "Kjeld Oostra",
				email: "roan_jong@hotmail.com",
				password: "abc1234",
				tasks: [
					{
						todo: "[voor vakantie] Navragen bij masterstudenten die je kent welke onderzoeken/lezingen voor hen interessant zouden zijn (kijk bijvoorbeeld ook bij CWI)",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "Done"
					},
					{
						todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
						people: ["Boas Kluiving", "Babette Mooij"],
						status: "In progress"
					}
				]
			}

		]
	}
]

var taskSchema = new mongoose.Schema({
	todo: String,
	people: Array,
	status: String
});

var Task = mongoose.model("Task", taskSchema);

app.get("/", function(req, res){
	res.send("<h1> HOME PAGE BITCH </h1>");
});

app.get("/mytasks", function(req, res){
	Task.find({}, function(err, tasks) {
		if(err) {
			console.log(err);
		} else {
			var group = groups.filter(function(group) {
  				return group.title == "DB";
			});
			res.render("mytasks", {tasks: tasks, groups: groups, group: group[0]});
		}
	});
});

app.get("/tasks/:groupname", function(req, res){
	Task.find({}, function(err, tasks) {
		if(err) {
			console.log(err);
		} else {
			var groupname = req.params.groupname;
			var group = groups.filter(function(group) {
  				return group.title == groupname;
			});
			res.render("tasks", {tasks: tasks, groups: groups, group: group[0]});
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

app.delete("tasks", function(req, res){
	console.log("delete");
});

app.get("/newgroup", function(req, res){
	members = ["Babette", "Roan", "Femke"]
	res.render("newgroup", {members: members});
});

app.get("*", function(req, res){
	res.send("Dead link");
});

app.listen(3000, process.env.IP);