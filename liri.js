function LiriInit() {
	this.fs = require('fs');
	this.twitter = require('twitter');
	this.spotify = require('spotify');
	this.request = require('request');

	this.commands = ['my-tweets','spotify-this-song','movie-this', 'do-what-it-says'];

}

////////////////// Prototypes ////////////////////


LiriInit.prototype.twitterGetClient =function (key) {
	var client =  new this.twitter({
		consumer_key: key.twitterKeys.consumer_key,
		consumer_secret: key.twitterKeys.consumer_secret,
		access_token_key: key.twitterKeys.access_token_key,
		access_token_secret: key.twitterKeys.access_token_secret
	});
	return client;
};
//-----------------------------------------------
LiriInit.prototype.twitterGetTweets = function () {
	var client = this.twitterGetClient(require('./keys.js'));

	var params = {
		screen_name: 'user'
	};

	var params = {screen_name: 'Flavio Martins'};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			tweets.forEach(function (tweet, index) {
				console.log('Tweet# ' + parseInt(index + 1) + ': ' + tweet.text);
			});
		}
		console.log('===================');
	}.bind(this));

};
//-----------------------------------------------
LiriInit.prototype.spotfyGet = function (input) {
	var params = {
		type: 'track',
		query: input,
		limit: 1
	};

	this.spotify.search(params, function(err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			var obj = data.tracks.items;

			console.log(obj["0"].name);
			console.log(obj["0"].artists["0"].name);
			console.log(obj["0"].preview_url);
			console.log(obj["0"].album.name);
			console.log('============================');
			//console.log(JSON.stringify(obj, null, 2));
		}

	});
};
//-----------------------------------------------
LiriInit.prototype.omdbGet = function (movieName) {
	var request = 'http://www.omdbapi.com/?t='+movieName+'&plot=full';

	this.request(request, function (error, response, body) {
		console.log('=========================');
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('body:', body); // Print the HTML for the Google homepage.
	});
};











var liri = new LiriInit();

liri.twitterGetTweets();

liri.spotfyGet('velha infancia');

liri.omdbGet('star wars');