'use strict';

module.exports = function (app, db) {
	var n = require("nonce")();
	var oauthSignature = require("oauth-signature");
	var qs = require("querystring");
	var request = require("request");
	var passport = require("passport");
	require("node-env-file")(".env");
	
	var restoreSearch = {city: "", title: "", special: ""};
	
	app.route("/")	
		.get(function (req, res) {
			var userID = "";
			if (req.user) {
				console.log(req.session);
				userID = JSON.stringify(req.user.twitterid);
			}
			res.render(process.cwd() + "/public/index.pug", {userID: userID});	
		});
		
		
	app.route("/search")
		.post(function (req, res) {
			var url = 'http://api.yelp.com/v2/search';
			var consumerSecret = process.env.YELP_CONSUMER_SECRET;
			var tokenSecret = process.env.YELP_TOKEN_SECRET;
			var data = {
				location: req.body.city,
				term: req.body.term,
			};
			if (req.body.category) {
				data.category_filter = req.body.category;
			}
			
			data.oauth_consumer_key = process.env.YELP_CONSUMER_KEY;
			data.oauth_token = process.env.YELP_TOKEN;
			data.oauth_nonce = n();
			data.oauth_timestamp = n().toString().substr(0,10);
			data.oauth_signature_method = 'HMAC-SHA1';
			data.oauth_version = '1.0';
			
			var signature = oauthSignature.generate("GET", url, data, consumerSecret, tokenSecret, { encodeSignature: false});
			data.oauth_signature = signature;
			request(url + "?" + qs.stringify(data), function (error, response, body) {
				if (error) throw error;
				console.log("City: " + data.location + " Special: " + data.category_filter);
				var obj = {body: JSON.parse(body), pubID: restoreSearch.title};;
				res.send(obj);
			});
		});
		
		
	app.route("/going")
		.post(function (req, res) {
			var index = req.body.index;
			var pub = req.body.pubTitle;
			var userID = req.body.userID;
			var choices = db.collection("choices");
			choices.find({pub: pub}).toArray(function (err, docs) {
				if (err) throw err;
				if (docs.length > 0) {
					if (docs[0].attending.length > 0) {
						if (docs[0].attending.indexOf(userID) >= 0) {
							choices.update({pub: pub}, {$inc: {numgoing: -1}});
							choices.update({pub: pub}, {$pull: {attending: userID}});
						}
						else {
							choices.update({pub: pub}, {$inc: {numgoing: 1}});
							choices.update({pub: pub}, {$push: {attending: userID}});
						}
					}
					else {
						choices.update({pub: pub}, {$inc: {numgoing: 1}});
						choices.update({pub: pub}, {$push: {attending: userID}});
					}
				}
				else {
					var attending = [userID];
					choices.insert({pub: pub, numgoing: 1, attending: attending});
				}
			});
			res.send({index: index, pub: pub});
		});
		
		
	app.route("/update")
		.post(function (req, res) {
			var pub = req.body.pubID;
			var ind = req.body.ind;
			var choices = db.collection("choices");
			choices.find({pub: pub}).toArray(function (err, docs) {
				if (err) throw err;
				var obj = {docs: docs, ind: ind};
				res.send(obj);
			});
		});
		
		
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));
                                     
    app.route("/restore")
    	.post(function (req, res) {
    		restoreSearch.city = req.body.restoreCity;
    		restoreSearch.title = req.body.pubTitle;
    		restoreSearch.special = req.body.restoreSpecial;
    		res.send("ok");
    	})
    	
    	.get(function (req, res) {
    		res.send(restoreSearch);	
    	});
};