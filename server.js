'use strict';

var express = require("express");
var routes = require("./app/routes/index.js");
var bodyParser = require("body-parser");
var app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
app.use(bodyParser.urlencoded({extended: false}));
routes(app);

app.listen(8080, function () {
	console.log("App listening on port 8080...");	
});