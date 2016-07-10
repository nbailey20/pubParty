'use strict';

module.exports = function (app, db) {
	var n = require("nonce")();
	var oauthSignature = require("oauth-signature");
	var qs = require("querystring");
	var request = require("request");
	var passport = require("passport");
	
	var restoreSearch = {city: "", title: ""};
	
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
			var consumerSecret = "ApdePzlz-K65Iq5Fa4Fw-srSDaM";
			var tokenSecret = "s-wJW1XH04aeY44qJr3DpiwP77g";
			var data = {
				location: req.body.city,
				term: req.body.term,
				oauth_consumer_key: "0Pt0EUmSdQgeoWGtGOi4Og",
				oauth_token: "MEFo-1NGZdZQO5aWld6cdMen_xXIkq35",
				oauth_nonce: n(),
				oauth_timestamp: n().toString().substr(0,10),
				oauth_signature_method : 'HMAC-SHA1',
				oauth_version : '1.0'
			};
			
			var signature = oauthSignature.generate("GET", url, data, consumerSecret, tokenSecret, { encodeSignature: false});
			data.oauth_signature = signature;
			request(url + "?" + qs.stringify(data), function (error, response, body) {
				if (error) throw error;
				console.log("City " + req.body.city);
				var obj = {body: JSON.parse(body), pubID: restoreSearch.title};
				console.log(obj);
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
				console.log(docs);
				res.send(obj);
			});
		});
		
		
	app.get('/auth/twitter', passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/done' }));
                                     
    
    app.route("/restore")
    	.post(function (req, res) {
    		restoreSearch.city = req.body.restoreCity;
    		restoreSearch.title = req.body.pubTitle;
    		console.log(JSON.stringify(restoreSearch));
    		res.send("ok");
    	})
    	
    	.get(function (req, res) {
    		res.send(restoreSearch);	
    	});
                                     
    // app.get("/auth/success", function (req, res) {
    // 	console.log(req.session);
    // 	res.render(process.cwd() + "/public/authSuccess.pug", {userID: JSON.stringify(req.user.id)});	
    // });
    
    
    // app.get("/bullshit", function (req, res) {
    // 	var choices = db.collection("choices");
    // 	choices.drop();
    // 	res.send("done");
    // });
    
    app.get("/done", function (req, res) {
    	res.send("<a href='/'>Home</a>");	
    });
};