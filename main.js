var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	methodOverride			= require("method-override"),
	Task					= require("./models/task"),
	User					= require("./models/user"),
	LocalStrategy 			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	async 					= require('async');

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
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
	if (req.isAuthenticated()) {
		res.redirect("/mytasks");
	} else {
		res.render("home");
	}
});

app.get("/account", isLoggedIn, function(req, res){
	var user = req.user;
	res.render("account", {user: user});
}); 

app.put("/account", isLoggedIn, function(req, res){
	User.findByIdAndUpdate(req.body.id, req.body.user, function(err, updatedUser){
		res.redirect("/account");
	});
});

app.delete("/account", isLoggedIn, function(req, res){
	var currentUser = req.user;
	User.findOne({username: currentUser.username}).populate("tasks").exec(function(err, user){
			if (err){
				console.log(err);
			} else {
				var index = user.groups.indexOf(req.body.groupname);
				if (index > -1) {
				    user.groups.splice(index, 1);
				    user.save(function(err){
				    	if (err){
				    		console.log(err);
				    	}
				    });
				}
				res.redirect("/account");
			}
		});
});

app.get("/projects", isLoggedIn, function(req, res){
	res.render("projects");
});


app.get("/mytasks", isLoggedIn, function(req, res){
	var currentUser = req.user.username;
	User.findOne({username: currentUser}).populate("tasks").exec(function(err, user){
		if (err){
			console.log(err);
		} else {
			res.render("mytasks", {user: user});
		}
	});
});

app.put("/mytasks", isLoggedIn, function(req, res){
	var status = req.body.status;
	if (status == "Not started") {
		var newStatus = "In progress";
	} else if (status == "In progress") {
		var newStatus = "Done";
	} else {
		var newStatus = "Not started";
	}
	Task.findByIdAndUpdate(req.body.id, {status: newStatus}, function(err, updatedTask){
		if (err){
			console.log(err);
		} else {
			res.redirect("/mytasks");
		}
	});
});

app.delete("/mytasks", isLoggedIn, function(req, res){
	var id = req.body.id;
	Task.findByIdAndRemove(id, function(err){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/mytasks");
		}
	});
});

app.get("/tasks/:groupname", isLoggedIn, function(req, res){
	var currentUser = req.user;
	var groupname = req.params.groupname;
	var members = [];
	if (currentUser.groups.includes(groupname)){
		User.find({}).populate("tasks").exec(function(err, users){
			if (err){
				console.log(err);
			} else {
				users.forEach(function(user){
					if (user.groups.includes(groupname)) {
						members.push(user);
					}
				});
				res.render("tasks", {members: members, groupname: groupname, user: currentUser});
			}
		});
	} else {
		res.redirect("/mytasks");
	}
});

app.post("/mytasks/:groupname", isLoggedIn, function(req, res){
	var todo = req.body.todo;
	var people = req.body.people.split(", ");
	var groupname = req.params.groupname;
	addTask(todo, people, groupname);
	res.redirect("/mytasks");
});

app.post("/tasks", isLoggedIn, function(req, res){
	var todo = req.body.todo;
	var people = req.body.people.split(", ");
	var url = req.body.groupname;
	var groupname = url.substring(7, url.length);
	addTask(todo, people, groupname);
	res.redirect(url);
});

app.put("/tasks/:groupname", isLoggedIn, function(req, res){
	var status = req.body.status;
	if (status == "Not started") {
		var newStatus = "In progress";
	} else if (status == "In progress") {
		var newStatus = "Done";
	} else {
		var newStatus = "Not started";
	}
	Task.findByIdAndUpdate(req.body.id, {status: newStatus}, function(err, updatedTask){
		if (err){
			console.log(err);
		} else {
			res.redirect("/tasks/" + req.params.groupname);
		}
	});
});

app.delete("/tasks/:groupname", isLoggedIn, function(req, res){
	var id = req.body.id;
	Task.findByIdAndRemove(id, function(err){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/tasks/" + req.params.groupname);
		}
	});
});

app.get("/newteam", isLoggedIn, function(req, res){
	User.find({}, function(err, users){
		if (err){
			console.log(err);
		} else {
			res.render("newgroup", {users: users});
		}
	});
});

app.post("/newteam", isLoggedIn, function(req, res){
	var groupname = req.body.groupname;
	User.find({}, function(err, users){
		if (err){
			console.log(err);
		} else {
			async.forEach(users, function(user, next){
				var name = user.username;
				if (req.body.members[name] == name) {
					user.groups.push(groupname);
					user.save(function(err, data){
						if (err){
							console.log(err);
						}
						next();
					});
				}
			}, function() {
			});
		}
	});
	res.redirect("/tasks/" + groupname);
});

app.get("/newminutes", isLoggedIn, function(req, res){
	var user = req.user;
	res.render("newminutes", {user: user});
});

app.post("/newminutes", isLoggedIn, function(req, res){
	var groupname = req.body.group;
	var minutes = req.body.minutes.split("\n");
	async.forEach(minutes, function(line, next){
		line = line.split(": ");
		var todo = line[1];
		var index = line[0].indexOf(" ");
		var action = line[0].substr(0, index);
		if (action == "ACTIE" || action == "TODO") {
			var people = line[0].substr(index + 1).split(", ");
			addTask(todo, people, groupname);
		} else if (action == "ACTIES" || action == "TODOS"){
			var people = [];
			User.find({}, function(err, users){
				async.forEach(users, function(user){
					if (user.groups.includes(groupname)) {
						people.push(user.username);
					}
				});
				addTask(todo, people, groupname);
			});
		}
		next();
	}, function(){

	});
	res.redirect("/tasks/" + groupname);
});

app.get("/register", function(req, res){
	if (req.isAuthenticated()) {
		res.redirect("/mytasks");
	} else {
		res.render("register");
	}
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
	if (req.isAuthenticated()) {
		res.redirect("/mytasks");
	} else {
		res.render("login");
	}
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

function addTask(todo, people, groupname){
	var newTask = {
		todo: todo,
		people: people,
		group: groupname,
		status: "Not started"
	}
	Task.create(newTask, function(err, newTask){
		if (err) {
			console.log(err);
		} else {
			User.find({}, function(err, users) {
				users.forEach(function(user){
					if (newTask.people.includes(user.username)){
						user.tasks.push(newTask);
						user.save(function(err, data){
							if (err){
								console.log(err);
							} 
						});
					}
				});
			});
		}
	});
};

app.get("*", isLoggedIn, function(req, res){
	res.send("Dead link");
});

app.listen(3000, process.env.IP);