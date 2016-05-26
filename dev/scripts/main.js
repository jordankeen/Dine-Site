// Create a global object for the app called 'app'
var app = {};

var dineAloneArtists = [ 
			'…And You Will Know Us By The Trail Of Dead', 
			'Aero Flynn', 
			'Alberta Cross', 
			'Alexisonfire', 
			'At The Drive-In', 
			'Attack in Black', 
			'Avenue', 
			'Billy Bragg',
 			'Black Lungs', 
 			'Black Mountain', 
 			'BR/DGES', 
 			'Brendan Philip', 
 			'BRONCHO', 
 			'Chuck Ragan', 
 			'City and Colour', 
 			'Craig Finn', 
 			'Dave Monks',
			'Delta Spirit', 
			'Diarrhea Planet', 
			'Dicey Hollow', 
			'Dune Rats',
			'DZ Deathrays',
			'Eagulls',
			'Elliot Moss',
			'FIDLAR',
			'Field Report',
			'Fine Points',
			'Fireside',
 			'Fly Golden Eagle',
 			'FREEMAN',
 			'Gateway Drugs',
 			'Grade',
 			'Hannah Georgas',
 			'HBS',
 			'Heartless Bastards',
 			'Helicon Blue',
 			'Hey Rosetta!',
			'Heyrocco',
			'High Ends',
			'Ivan & Alyosha',
			'James Vincent McMorrow',
			'JEFF The Brotherhood',
			'Jimmy Eat World',
			'k-os',
			'Kate Nash',
			'Kopecky',
			'Langhorne Slim & The Law',
			'Lieutenant',
 			'Little Scream',
 			'Lucius',
 			'Marilyn Manson',
 			'Matthew Logan Vasquez',
 			'Miami Horror',
 			'Moneen',
 			'Monster Truck',
 			'Music Band',
 			'Neverending White Lights, ft. Dallas Green',
			'Noah Gundersen',
			'Oh Pep!',
			'PHOX',
			'RNDM',
			'Rumba Shaker',
			'Say Yes',
			'Sego',
			'Shovels & Rope',
			'Single Mothers',
			'Sleepy Sun',
			'Solids',
 			'Spanish Gold',
 			'Spencer Burton',
 			'Streets of Laredo',
 			'Swervedriver',
 			'Sylvan Esso',
 			'The Amazing',
 			'The Cult',
 			'The Dandy Warhols',
 			'The Dirty Nil',
			'The Dodos',
			'The Jezabels',
			'The Lumineers',
			'The Sheepdogs',
			'The Wytches',
			'Tokyo Police Club',
			'Twin Forks',
			'Vanessa Carlton',
			'Vanishing Life',
			'Violent Soho',
			'Walter Schreifels',
			'Wild Child',
			'Wintersleep',
			'You+Me',
			'Yukon Blonde'
];

// Temporary Array for testing.
app.tempArray = ['arkells','Wintersleep','You+Me','Yukon Blonde'];

// Create an empty array into which we can push our artists
app.artists = [];

// Create an empty array of songs
app.songs = [];

// Create an object of artists for the purpose of having a key that the artistCardTemplate will use (keyname: artist).
app.artistObj = {
	artists: dineAloneArtists.map(function(artist){
		return {
			name: artist
		}
	})
}

// Select html from handlebars template
app.artistCardTemplate = $('#artistCardTemplate').html();
// Compile html for handlebars template
app.template = Handlebars.compile(app.artistCardTemplate);


// Create an app.init function to run that will house all functions that are initialized when the page loads
// app.init = {
// 	app.getArtistsInfo();
// };

// app.getArtistsInfo loops through an array and gets calls the getData method to get the artist object from spotify. Note: the getData method also appends the artist object returned from spotify to the handlebars artistCardTemplate.
app.getArtistsInfo = function(arrayName){
	arrayName.forEach(function(artistName){
		app.getData(artistName);
	})
}

// Create a method to get artists from spotify that requires an input of the artist name
// The query filters for artists and guarantees the search term in the artist name.
app.getData = function(artistName) {
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		method: 'GET',
		dataType: 'json',
		data: {
			q: artistName+" artist:"+ artistName,
			type: 'artist',
			artist: artistName,
		}
	})
	.then(function(res){
		app.artists.push(res.artists.items[0]);
		$('.artistsContainer').append(app.template(res.artists.items[0]));
	});
};

// Create a function to get songs based on an artist ID.
// method requires an artistID, a country code (e.g. CA)
app.getSongs = function(artistID, country, numberOfSongs) {
	$.ajax({
		url: "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks",
		method: 'GET',
		dataType: 'json',
		data: {
			country: country,
		}
	})
	.then(function(res){
		// console.log(res);
		for (var i = 0; i < numberOfSongs; i++) {
			app.songs.push(res.tracks[i].id);
		}
	});
}



// app.show = function(){
// 	for (var i = 0; i<)
// }

$(function(){
	// app.getArtistsInfo();
});

// add in jquery plug in to auto complete search bar



$('#autocomplete').autocomplete({
    lookup: dineAloneArtists,
    transformResult: function(response) {
        return {
            suggestions: $.map(response.myData, function(dataItem) {
                return { value: dataItem.valueField, data: dataItem.dataField };
            })
        };
    }
});

// add in jquery for accordian 


// make var for user choice of artist and function for on change or on select or on enter

//make var for spotify key
// write ajax call to begin getting information from Spotify using choice of artist


// use a for loop or use forEach() to loop through list and return data
	// make call to access artists songs
	// return the songs into an array
// 
// for loop through the artist chosen
	// we want to store the genre of the artist chosen

	// we want to store the image of the artist chosen

	// we want to store the popularity

	// push information into html/text


// we want to do whatever we need to do to build a playlist in our page





// BONUS: we can use the spotify artist id to get the songkick artist upcoming events

