'use strict';

var express = require("express");
var session = require("express-session");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
var mongo = require("mongodb").MongoClient;
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
require("node-env-file")(".env");
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
	    consumerKey: process.env.TWITTER_CONSUMER_KEY,
		consumerSecret: process.env.TWITTER_CONSUMER_SECRET,					
	    callbackURL: process.env.APP_URL + "auth/twitter/callback"
	  },
	  function(token, tokenSecret, profile, done) {
	  	var Users = db.collection("users");
	    Users.findOne({ twitterid: profile.id }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                user = {
                    name: profile.displayName,
                    twitterid: profile.id
                };
                Users.insert({name: user.name, twitterid: user.twitterid});
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
    	done(null, user.twitterid);
	});

	passport.deserializeUser(function(id, done) {  
		var Users = db.collection("users");
    	Users.findOne({ twitterid: id }, function (err, user) {
        	done(err, user);
    	});
	});

	routes(app, db);
	
	app.listen(8080, function () {
		console.log("App listening on port 8080...");	
	});
});
