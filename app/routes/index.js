'use strict';

module.exports = function (app) {
	var n = require("nonce")();
	var oauthSignature = require("oauth-signature");
	var qs = require("querystring");
	var request = require("request");
	
	app.route("/")	
		.get(function (req, res) {
			res.sendFile(process.cwd() + "/public/index.html");	
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
				console.log(req.body.city);
				res.send(JSON.parse(body));
			});
		});
		
		
	app.route("/going")
		.post(function (req, res) {
			console.log(req.body.id);
			res.send("received");
		});
};