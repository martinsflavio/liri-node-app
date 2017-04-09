function LiriInit() {
	this.fs = require('fs');
	this.inquirer = require('inquirer');

	this.apis = ['Spotify','Twitter','OMDB-Movies','Chose For Me'];
}

////////////////// Prototypes ////////////////////
LiriInit.prototype.clearScreen = function () {
	console.log('\033c');
};
//-----------------------------------------------
LiriInit.prototype.oneMoreSearch = function () {

	this.inquirer.prompt([
		{
			type: 'confirm',
			name: 'tryAgain',
			message: 'Do you want to search again?',
			default: true
		}
	]).then(function (anw) {
		var output;

		if (anw.tryAgain) {
			this.log('\n Do you want to search again:   True \n');
			this.apiSelector();
		} else {
			this.clearScreen();
			output =  '\n Do you want to search again:   False \n' +
								'\n========================================================\n' +
								' Thank\'s for choosing Liri! \n' +
								'========================================================\n';
			this.log(output);
			console.log(output);
		}
	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.apiSelector = function () {
this.clearScreen();

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

		this.log('\n Option selected:  ' + anws.api + '\n');

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

		this.log('\n ' + choice + ' search for:  ' + dataSearch.userInput + '\n');

	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.twitterGetTweets = function () {
	this.clearScreen();

	var Twitter = require('twitter');
	var client =  new Twitter(require('./keys').twitterKeys);


	var params = {screen_name: 'FlavioRMartins1'};

	client.get('statuses/user_timeline', params, function(err, tweets) {
		var output;

		output = '\n===================== My Tweets =============================\n';
		if (err) {
			output += ' Error occurred: ' + err;
			return;
		} else {
			tweets.forEach(function (tweet, index) {
				output += '\n Created At: ' + tweet.created_at + '\n' +
									'  Tweet# ' + parseInt(index + 1) + ': ' + tweet.text + '\n';
			});
		}
		output += '\n============================================================\n';

		console.log(output);
		this.log(output);
		this.oneMoreSearch();

	}.bind(this));

};
//-----------------------------------------------
LiriInit.prototype.spotifyGet = function (input) {
	this.clearScreen();

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
		var output = '\n===================== Spotify =============================\n';

		if (track.length === 0) {
			output += 'Error occurred: Song not Founded! \n';
		} else {
			output +=  '      Artist(s): ' + track['0'].artists['0'].name + '\n' +
								'The song\'s Name: ' + track['0'].name + '\n' +
								'   Spotify Link: ' + track['0'].preview_url + '\n' +
								'          Album: ' + track['0'].album.name + '\n';
		}
		output += '===========================================================\n';
		console.log(output);
		this.log(output);
		this.oneMoreSearch();

	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.omdbGet = function (movieName) {
	this.clearScreen();

	var request = require('request');
	if (!movieName) {
		movieName = 'Mr. Nobody';
	}

	var endpoint = 'http://www.omdbapi.com/?t='+movieName;

	request(endpoint, function (err, response, body) {
		var movie = JSON.parse(body);
		var output;

		output = '\n===================== OMDB =============================\n';
		if (movie.Response === 'False') {
			output += movieName + ' : Movie not founded!\n';
		} else {
			output += '          Title: ' + movie.Title + '\n' +
								'           Year: ' + movie.Year + '\n' +
								'        Country: ' + movie.Country + '\n' +
								'       Language: ' + movie.Language + '\n' +
								'         Actors: ' + movie.Actors + '\n' +
								'    OMDB Rating: ' + movie.imdbRating + '\n';
			if(movie.Rating){
				output += 'Rotten Tomatoes: ' + movie.Ratings["0"].Value + '\n';
			}
			output +=	'           Plot: ' + movie.Plot + '\n';
		}
		output += '========================================================\n';

		console.log(output);
		this.log(output);
		this.oneMoreSearch();

	}.bind(this));
};
//-----------------------------------------------
LiriInit.prototype.randomGet = function () {
	this.clearScreen();

	this.fs.readFile('./random.txt', 'utf8', function (err, data) {
		var randomApiIndex = Math.floor(Math.random() * 3);
		var possibilitiesObj = this.stringSort(data);
		var output = ' Api random selected:  ';


		switch (this.apis[randomApiIndex]) {
			case 'Spotify':
				var randomItemIndex = Math.floor(Math.random() * possibilitiesObj.spotify.length);

				output += this.apis[randomApiIndex] +
									'\n Random search: ' + possibilitiesObj.spotify[randomItemIndex] + '\n';

				this.spotifyGet(possibilitiesObj.spotify[randomItemIndex]);
				break;
			case 'Twitter':
				this.twitterGetTweets();

				output += this.apis[randomApiIndex] + '\n';

				break;
			case 'OMDB-Movies':
				var randomItemIndex = Math.floor(Math.random() * possibilitiesObj.omdb.length);

				output += this.apis[randomApiIndex] +
									'\n Random search: ' + possibilitiesObj.omdb[randomItemIndex] + '\n';

				this.omdbGet(possibilitiesObj.omdb[randomItemIndex]);
				break;

		}

		this.log(output);

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

LiriInit.prototype.log = function (string) {
	this.fs.appendFile('./log.txt', string, function (err) {
		if (err) {
			console.log('Error occurred: ' + err);
		}
	});
};




var liri = new LiriInit();

liri.apiSelector();
