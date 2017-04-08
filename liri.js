function LiriInit() {
	this.fs = require('fs');
	this.inquirer = require('inquirer');

	this.apis = ['Spotify','Twitter','OMDB-Movies','Chose For Me'];

}

////////////////// Prototypes ////////////////////
LiriInit.prototype.oneMoreSearch = function () {
	this.inquirer.prompt([
		{
			type: 'confirm',
			name: 'tryAgain',
			message: 'Do you want to search again?',
			default: true
		}
	]).then(function (anw) {
		if (anw.tryAgain) {
			this.apiChooser();
		} else {
			console.log('========================================================\n');
			console.log('\n Thank\'s for choosing Liri! \n');
			console.log('========================================================\n');
		}
	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.apiChooser = function () {

	this.inquirer.prompt([
		{
			type: 'list',
			name: 'api',
			message: 'Witch sevice do you like to use?',
			choices: this.apis
		}
	]).then(function (anws) {
		var userChoice;
		var message;

		switch (anws.api) {
			case 'Spotify':
				userChoice = 'Spotify';
				message = 'Enter the track name:';
				break;
			case 'Twitter':
				this.twitterGetTweets();
				break;
			case 'OMDB-Movies':
				userChoice = 'OMDB-Movies';
				message = 'Enter the movie name:';
				break;
			case 'Chose For Me':
				this.randomGet();
		}

		if(userChoice){
			this.apiCaller(userChoice, message);
		}
	}.bind(this));

};
//-----------------------------------------------
LiriInit.prototype.apiCaller = function (choice, message) {
	this.inquirer.prompt([
		{
			type: 'input',
			name: 'userInput',
			message: message
		}
	]).then(function (dataSearch) {
		switch (choice) {
			case 'Spotify':
				this.spotifyGet(dataSearch.userInput);
				break;
			case 'OMDB-Movies':
				this.omdbGet(dataSearch.userInput);
				break;
		}

	}.bind(this));
};
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

		this.oneMoreSearch();
	}.bind(this));

};
//-----------------------------------------------
LiriInit.prototype.spotifyGet = function (input) {
	var spotify = require('spotify');

	if (!input) {
		input = 'The Sign by Ace of Base';
	}

	var params = {
		type: 'track',
		query: input,
		limit: 1
	};

	spotify.search(params, function(err, data) {
		var track = data.tracks.items;

		if (track.total === 0) {
			console.log('Error occurred: ' + err);
			return;
		} else {
			console.log('===================== Spotify =============================\n');
			console.log('      Artist(s): ' + track['0'].artists['0'].name);
			console.log('The song\'s Name: ' + track['0'].name);
			console.log('   Spotify Link: ' + track['0'].preview_url);
			console.log('          Album: ' + track['0'].album.name + '\n');
			console.log('===========================================================\n');
		}
		this.oneMoreSearch();
	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.omdbGet = function (movieName) {
	var request = require('request');
	if (!movieName) {
		movieName = 'Mr. Nobody';
	}

	var endpoint = 'http://www.omdbapi.com/?t='+movieName;

	request(endpoint, function (err, response, body) {
		var movie = JSON.parse(body);

		console.log('===================== OMDB =============================\n');
		if (movie.Response === 'False') {
			console.log( movieName + ' : Movie not founded!');
		} else {
			console.log('          Title: ' + movie.Title);
			console.log('           Year: ' + movie.Year);
			console.log('        Country: ' + movie.Country);
			console.log('       Language: ' + movie.Language);
			console.log('         Actors: ' + movie.Actors);
			console.log('    OMDB Rating: ' + movie.imdbRating);
			console.log('Rotten Tomatoes: ' + movie.Ratings["0"].Value);
			console.log('           Plot: ' + movie.Plot + '\n');
		}
		console.log('========================================================\n');

		this.oneMoreSearch();
	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.randomGet = function () {
	this.fs.readFile('./random.txt', 'utf8', function (err, data) {

		var randomApi = Math.floor(Math.random() * 3);
		var possibilitiesObj = this.stringSort(data);

		switch (this.apis[randomApi]) {
			case 'Spotify':
				var randomItem = Math.floor(Math.random() * possibilitiesObj.spotify.length);
				this.spotifyGet(possibilitiesObj.spotify[randomItem]);
				break;
			case 'Twitter':
				this.twitterGetTweets();
				break;
			case 'OMDB-Movies':
				var randomItem = Math.floor(Math.random() * possibilitiesObj.omdb.length);
				this.omdbGet(possibilitiesObj.omdb[randomItem]);
				break;

			}


	}.bind(this));
};
//-----------------------------------------------



LiriInit.prototype.stringSort = function (arr) {
	var optArr = arr.split('\n');
	var trackList;
	var movieList;

	//Split song's from movies and save in different arr
	for (var i = 0; i < optArr.length; i ++) {
		if(optArr[i] !== ''){
			var test = optArr[i].split(':');
			switch (test[0].toLowerCase()) {
				case 'spotify':
					trackList = test[1].split(',');
					break;
				case 'omdb':
					movieList = test[1].split(',');
					break;
				default:
			}
		}
	}
	return {spotify: trackList, omdb: movieList};
};



var liri = new LiriInit();

liri.apiChooser();




