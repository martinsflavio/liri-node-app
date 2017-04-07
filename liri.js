function LiriInit() {
	this.fs = require('fs');
	this.apis = ['Spotify','Twetter','IMDB-Movies','Chose For Me'];
}

////////////////// Prototypes ////////////////////

//-----------------------------------------------
LiriInit.prototype.twitterGetTweets = function () {
	var Twitter = require('twitter');
	var client =  new Twitter(require('./keys').twitterKeys);


	var params = {screen_name: 'Flavio Martins'};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {
		console.log('===================== My Tweets =============================\n');
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			tweets.forEach(function (tweet, index) {
				console.log('Created At: ' + tweet.created_at);
				console.log('  Tweet# ' + parseInt(index + 1) + ': ' + tweet.text + '\n' );
			});
		}
		console.log('============================================================\n');
	}.bind(this));

};
//-----------------------------------------------
LiriInit.prototype.spotifyGet = function (input) {
	var spotify = require('spotify');

	var params = {
		type: 'track',
		query: input,
		limit: 1
	};

	spotify.search(params, function(err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			var track = data.tracks.items;
			console.log('===================== Spotify =============================\n');
			console.log('      Artist(s): ' + track['0'].artists['0'].name);
			console.log('The song\'s Name: ' + track['0'].name);
			console.log('   Spotify Link: ' + track['0'].preview_url);
			console.log('          Album: ' + track['0'].album.name + '\n');
			console.log('===========================================================\n');
			//console.log(JSON.stringify(obj, null, 2));
		}

	});
};
//-----------------------------------------------
LiriInit.prototype.omdbGet = function (movieName) {
	var request = require('request');
	var endpoint = 'http://www.omdbapi.com/?t='+movieName;

	request(endpoint, function (err, response, body) {
		console.log('===================== OMDB =============================\n');
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			var movie = JSON.parse(body);
			console.log('          Title: ' + movie.Title);
			console.log('           Year:' + movie.Year);
			console.log('        Country:' + movie.Country);
			console.log('       Language: ' + movie.Language);
			console.log('         Actors: ' + movie.Actors);
			console.log('    IMDB Rating: ' + movie.imdbRating);
			console.log('Rotten Tomatoes: ' + movie.Ratings["0"].Value);
			console.log('           Plot: ' + movie.Plot + '\n');
		}
		console.log('===================== Spotify =============================\n');
	});
};
//-----------------------------------------------
LiriInit.prototype.apiChoser = function () {
	var inquirer = require('inquirer');

	inquirer.prompt([
		{
			type: 'list',
			name: 'api',
			message: 'Witch sevice do you like to use?',
			choices: this.apis
		}
	]).then(function (anws) {
		var comands = ['my-tweets','spotify-this-song','movie-this', ''];

		switch (anws.api) {
			case 'Spotify':
				console.log('spotify-this-song');
				break;
			case 'Twetter':
				console.log('my-tweets');
				break;
			case 'IMDB-Movies':
				console.log('movie-this');
				break;
			default:
				console.log('do-what-it-says');
		}
	});

};
//-----------------------------------------------



var liri = new LiriInit();

//liri.twitterGetTweets();

//liri.spotifyGet('track','raimundos');

//liri.omdbGet('star wars');

//liri.apiChoser();



