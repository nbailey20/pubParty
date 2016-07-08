'use strict';

var express = require("express");
var session = require("express-session");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
var mongo = require("mongodb").MongoClient;
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var app = express();

mongo.connect("mongodb://localhost:27017/clementinejs", function (err, db) {
	if (err) throw err;
	app.use("/public", express.static(process.cwd() + "/public"));
	app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(session({ secret: 'alskdkfhj' }));
	app.use(passport.initialize());
	app.use(passport.session());
	
	passport.use('twitter', new TwitterStrategy({
	    consumerKey: "E8pmOhv8tos5F2KKzRMj83xiG",
		consumerSecret: "PeKXR6fxDuVmLXANTU3e9d0uTzuKpuK0D3rR2NlsvoU8JBH2RM",						//figure out how to export eventually
	    callbackURL: "https://pubparty-bartowski20.c9users.io/auth/twitter/callback"
	  },
	  function(token, tokenSecret, profile, done) {
	  	var Users = db.collection("users");
	    Users.findOne({ id: profile.id }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                user = {
                    name: profile.displayName,
                    twitterid: profile.id
                };
                Users.insert({name: user.name, twitterid: user.id});
                console.log(user);
                return done(err, user);
                }
            else {
            	console.log(JSON.stringify(user));
                return done(err, user);
            }
        });
	  }
	));
	
	passport.serializeUser(function(user, done) {  
		console.log(JSON.stringify(user));
    	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {  
		var Users = db.collection("users");
    	Users.findOne({ id: id }, function (err, user) {
    		console.log(JSON.stringify(id));
        	done(err, user);
    	});
	});

	routes(app, db);
	
	app.listen(8080, function () {
		console.log("App listening on port 8080...");	
	});
});
