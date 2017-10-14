var twitterKeys = require("./keys.js");
var inquirer = require("inquirer");

inquirer.prompt([
{
	type: "list",
	message: "What would you like to do?",
	choices: ["Spotify", "Twitter", "Movie"],
	name: "choice"
}	
]).then(function(response) {

	if (response.choice === "Twitter") {
		inquireTweets();
	};
	if (response.choice === "Spotify") {
		inquireSong();
	};
	if (response.choice === "Movie") {
		inquireMovie();
	};
})

function inquireSong() {
	inquirer.prompt([
	{ 
		type: "input",
		message: "What song would you like to search?",
		name: "song"
	}
	]).then(function(response) {
		song = response.song;
		console.log("Loading Spotify Song...");
		getSpotify();
	})
};

function inquireTweets() {
	inquirer.prompt([
	{ 
		type: "input",
		message: "Who's tweets would you like to see? Enter username: @",
		name: "username"
	}
	]).then(function(response) {
		username = response.username;
		console.log("Loading Tweets...")
		getTweets();
	})
};

function inquireMovie() {
	inquirer.prompt([
	{
		type: "input",
		message: "What movie would you like to search?",
		name: "movie"
	}
		]).then(function(response) {
			movie = response.movie;
			console.log("Loading movie details...");
			// getMovie();
		})
};

function getTweets() {

	var Twitter = require("twitter");

	var client = new Twitter(twitterKeys);

	var params = {screen_name: username};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			console.log("Here are your 20 most recent tweets: ");
			for (var i = 0; i < 20; i++)
				console.log("Tweet #" + (i+1) + ": " + tweets[i].text);
		}
	});
};

function getSpotify() {

	var Spotify = require("node-spotify-api");

	var spotify = new Spotify({
		id: "390c81d9501549f3b1fdd756e2425eba",
		secret: "7294aac6ddf543d1b964abb54e5f89a6"
	});

	spotify.search({ type: "track", query: song }, function(err, data) {

		if (err) {
			return console.log("Error occurred: " + err);
		}

		console.log("Song Name: " + data.tracks.items[0].name); 

		console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 

		console.log("Album: " + data.tracks.items[0].album.name); 

		if (data.tracks.items[0].preview_url === null) {
			console.log("This song has no preview link.");
		} else {
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
		};
	});
};

function getMovie() {

};
