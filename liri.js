// Variables: ----------------------------------------------------------

// Importing our keys from the keys.js file:
var keys = require("./keys.js");

var inquirer = require("inquirer");

// Functions: ----------------------------------------------------------

// Main inquire menu where the user can select what they want Liri to do:
function startMenu() {
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
};

// Asks the user what song they want to look up:
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

// Asks the user who's tweets they want to look up:
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

// Asks the user what movie they want to look up: 
function inquireMovie() {
	inquirer.prompt([
	{
		type: "input",
		message: "What movie would you like to search?",
		name: "movie"
	}
	]).then(function(response) {
		movie = response.movie;
		getMovie();
	})
};

// Function that uses twitter npm package to pull tweets:
function getTweets() {

	var Twitter = require("twitter");

	var client = new Twitter(keys.twitter);

	var params = {screen_name: username};

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			console.log("Here are your 20 most recent tweets: ");
			for (var i = 0; i < 20; i++)
				console.log("Tweet #" + (i+1) + ": " + tweets[i].text);
		}
	});
};

// Function that uses spotify npm package to find song:
function getSpotify() {

	var Spotify = require("node-spotify-api");

	var spotify = new Spotify(keys.spotify);

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

// Function that uses request npm package to search OMDB API to find movie:
function getMovie() {

	var request = require("request");

	if (movie === "") {
		console.log("You didn't enter a movie, here's a great one though: ");
		movie = "Mr. Nobody";
	}

	console.log("Loading movie details...");

	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

  		// If the request is successful (i.e. if the response status code is 200)
  		if (JSON.parse(body).Response === "False") {
  			console.log("Your search returned no results. Please try again.");
  		} else {

  			if (!error && response.statusCode === 200) {

  				console.log("Title: " + JSON.parse(body).Title);
  				console.log("Year: " + JSON.parse(body).Year);
  				console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
  				console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
  				console.log("Production Country: " + JSON.parse(body).Country);
  				console.log("Language(s) of Movie: " + JSON.parse(body).Language);
  				console.log("Plot: " + JSON.parse(body).Plot);
  				console.log("Actors: " + JSON.parse(body).Actors);

  			}
  		}
  	});
};

// Code: ----------------------------------------------------------

startMenu();