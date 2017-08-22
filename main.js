var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	Task					= require("./models/task"),
	User					= require("./models/user"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/pimpy", {useMongoClient: true});
app.use(require("express-session")({
	secret: "Femke is the one and only persus",
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/stylesheets'));
app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var user = {
		name: "Babette Mooij",
		groups: ["FSR FNWI", "DB", "PR", "SOFacIT"],
		tasks: [
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "In progress",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "Done",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "Not started",
				group: "DB"
			}
		]
	}

var users = [
	{
		name: "Babette Mooij",
		groups: ["FSR FNWI", "DB", "PR", "SOFacIT"],
		tasks: [
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "In progress",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "Done",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Babette Mooij"],
				status: "Not started",
				group: "DB"
			}
		]
	},
	{
		name: "Roan de Jong",
		groups: ["FSR FNWI", "DB", "ExtraCurry", "Reglementen"],
		tasks: [
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Roan de Jong"],
				status: "In progress",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Roan de Jong"],
				status: "Done",
				group: "DB"
			},
			{
				todo: "[vv] Denk na waar we de 500 euro voor kunnen gebruiken.",
				people: ["Roan de Jong"],
				status: "Not started",
				group: "DB"
			}
		]
	}
]

// Task.create({
// 	name: "Babette Mooij",
// 	tasks: []
// }, function(err, member){
// 	Group.findOne({groupname: "DB"}, function(err, group){
// 		if (err){
// 			console.log(err);
// 		} else {
// 			group.members.push(member);
// 			group.save(function(err, data){
// 				if (err){
// 					console.log(err);
// 				} else {
// 					console.log(data);
// 				}
// 			});
// 		}
// 	});
// });

// Task.create({
// 	todo: "Denk na waar we de 500 euro voor kunnen gebruiken.",
// 	people: ["Roan de Jong", "Babette Mooij"],
// 	status: "Not started"
// }, function(err, task){
// 	Group.findOne({groupname: "DB"}, function(err, group){
// 		if (err){
// 			console.log(err);
// 		} else {
// 			group.members.forEach(function(member){
// 				if (task.people.includes(member.name)){
// 					member.tasks.push(task);
// 					member.save(function(err, data){
// 						if (err){
// 							console.log(err);
// 						} else {
// 							console.log(data);
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});
// });

app.get("/", function(req, res){
	res.render("home");
});

app.get("/account", function(req, res){
	res.render("account");
}); 

app.get("/projects", function(req, res){
	res.render("projects");
});


app.get("/mytasks", function(req, res){
	res.render("mytasks", {user: user});
});

app.get("/tasks/:groupname", function(req, res){
	var groupname = req.params.groupname;
	res.render("tasks", {members: users, groupname: groupname, user: user});
});

app.post("/tasks", function(req, res){
	var todo = req.body.todo;
	var people = req.body.people;
	var newTask = {
		todo: todo,
		people: people,
		status: "Not started"
	}
});

app.delete("tasks", function(req, res){
	console.log("delete");
});

app.get("/newgroup", function(req, res){
	User.find({}, function(err, users){
		if (err){
			console.log(err);
		} else {
			res.render("newgroup", {users: users});
		}
	});
});

app.post("/newgroup", function(req, res){
	members = ["Babette Mooij", "Roan de Jong", "Femke Mostert"];
	groupname: req.body.groupname
	members.forEach(function(member) {
		User.findOne({name: member}, function(err, user){
			if(err){
				console.log(err);
			} else {
				user.groups.push(groupname);
			}
		});
	});
});

app.get("/newminutes", function(req, res){
	res.render("newminutes", {user: user});
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	User.register(new User({
		username: req.body.username, 
		email: req.body.email, 
		groups: [], 
		tasks: []
	}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/mytasks");
		})
	});
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/mytasks",
	failureRedirect: "/login"
	}), function(req, res){

});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

app.get("*", function(req, res){
	res.send("Dead link");
});

app.listen(3000, process.env.IP);