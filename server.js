'use strict';

var express = require("express");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
var mongo = require("mongodb").MongoClient;
var app = express();

mongo.connect("mongodb://localhost:27017/clementinejs", function (err, db) {
	if (err) throw err;
	app.use("/public", express.static(process.cwd() + "/public"));
	app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
	app.use(bodyParser.urlencoded({extended: false}));
	routes(app, db);
	
	app.listen(8080, function () {
		console.log("App listening on port 8080...");	
	});
});
