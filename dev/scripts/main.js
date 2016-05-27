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

// Create an empty array into which we can push our artists that have been searched/viewed
app.artists = [];

// Create an empty array of songs
app.songs = [];

// Create an empty array of artists that have been addedToPlaylist
app.addedArtists = [];

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
app.init = function() {
	app.searchButtonListener();
	app.addToPlaylistListener();
};

// app.getArtistsInfo loops through an array and gets calls the getData method to get the artist object from spotify. Note: the getData method also appends the artist object returned from spotify to the handlebars artistCardTemplate.
app.getArtistsInfo = function(arrayName){
	// console.log(arrayName);
	arrayName.forEach(function(artistName){
		app.getData(artistName);
	});
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
		app.artists = [];
		$('.artistsContainer').empty();
		app.artists.push(res.artists.items[0]);
		$('.artistsContainer').append(app.template(res.artists.items[0]));
		app.checkAddToPlaylistStatus();
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
	app.init();
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
//IN HERE
app.searchButtonListener = function(){
	$('form').on('submit', function(e){
	var userArtistChoice = []
		e.preventDefault();
		var artist = $('.searchFormInput').val();
		userArtistChoice.push(artist);
		$('.searchFormInput').val('');
		app.getArtistsInfo(userArtistChoice);
		
	});
}

// Create a function to check if artist being shown is already addedToPlaylist
// for loop to go through each artist id in the app.addedArtists array
// if data attribute in current artistCardTemplate is equal to it
// add addToPlaylistPressed class
app.checkAddToPlaylistStatus = function() {
	console.log('app.checkAddToPlaylistStatus is running!');
	for (var i = 0; i < app.addedArtists.length; i++) {
		// console.log(i);
		var currentArtistID = $('.artistsContainer').find('.addToPlaylist').data();
		// console.log($('.artistsContainer').find('.addToPlaylist').data());
		if (currentArtistID.artist === app.addedArtists[i]) {
			$('.artistsContainer').find('.addToPlaylist').addClass('addToPlaylistPressed');
				// console.log(app.addedArtists[i], "if is working");
		};
		// if (dynamically create id = i.id)
	}
}

// Create a listener to add currently displayed artist to addedArtists artist on click of addToPlaylist, and...
// change the appearance of addToPlaylist to appear added and
app.addToPlaylistListener = function() {
	console.log('addtoplaylistisnowlistening');
	$('.artistsContainer').on('click', ".addToPlaylist", function(){
		// Check if artists id is already in app.addedArtists
		var index = app.addedArtists.indexOf(app.artists[0].id)
		console.log(index);
		if (index >= 0) {
			app.addedArtists.splice(index,1)
			console.log('i have removed item number ', index);
			console.log(app.addedArtists);
			$('.addToPlaylist').removeClass('addToPlaylistPressed');
		}
		else {
			console.log('i am new, add to addedArtists array');
			app.addedArtists.push(app.artists[0].id);
			console.log(app.addedArtists);
			$('.addToPlaylist').addClass('addToPlaylistPressed');
		}
		// console.log('add to play list listener is working')
	})
}
 



// we want to do whatever we need to do to build a playlist in our page

// Join all spotify song IDs into one string and create into URL for spotify player
// concat user selected songs into one comma separated string and store in variable

app.createPlaylist = function(){
	// Create a string of all song IDs from the app.songs array and store it in the spotifySongListChain
	var spotifySongListChain = app.songs.join(',');
	// create iframe html code that uses spotifySongListChain to dynamically create an iframe, store it in a widgetCode variable, and....
	var widgetCode = `<iframe class="spotify" src="https://embed.spotify.com/?uri=spotify:trackset:DineAloneRecords:${spotifySongListChain}" width="300" height="400" frameborder="0" allowtransparency="true"></iframe>`;
	// insert it into the spotifyContainer in the html using the widgetCode
	$('.spotifyContainer').html(widgetCode);
};


// BONUS: we can use the spotify artist id to get the songkick artist upcoming events

