
// Create a global object for the app called 'app'
var app = {};

// Array of all Dine Alone Artists
var dineAloneArtists = [ 
			'…And You Will Know Us By The Trail Of Dead', 
			'Aero Flynn', 
			'Alberta Cross', 
			'Alexisonfire', 
			'At The Drive-In', 
			'Attack in Black', 
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
 			'Gateway Drugs',
 			'Grade',
 			'Hannah Georgas',
 			'HBS',
 			'Heartless Bastards',
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
 			'Neverending White Lights',
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
			'Yukon Blonde'
];

// Create an empty array into which we can push our artists that have been searched/viewed
app.artists = [];

// Create an empty array for songs
app.songs = [];

// Create an empty array for artists that have been addedToPlaylist
app.addedArtists = [];

// Create an object of artists for the purpose of having a key that the artistCardTemplate will use (keyname: artist).
app.artistObj = {
	artists: dineAloneArtists.map(function(artist){
		return {
			name: artist
		};
	})
};

// Select html from handlebars template
app.artistCardTemplate = $('#artistCardTemplate').html();
// Compile html for handlebars template
app.template = Handlebars.compile(app.artistCardTemplate);

// Added artist Handlebars template
// Select html from handlebars template
app.addedArtistsTemplate = $('#addedArtistsTemplate').html();
// Compile html for handlebars template
app.addedTemplate = Handlebars.compile(app.addedArtistsTemplate);


// Create an app.init function to run that will house all functions that are initialized when the page loads
app.init = function() {
	app.searchButtonListener();
	app.addToPlaylistListener();
	app.closeArtistContainerListener();
	app.startButton();
	app.events();
	app.closeSpotifyContainerListener();
	app.littleImageListener();
	app.closeAddedArtistContainer();
	app.infoMessage();
	app.maxArtistsMessage();
};

// Generate playlist function
app.events = function() {
	$('.play').on('click', function(){
		app.createPlaylistListener();
		$('.spotifyContainer').css('display','flex');
		$('.form-box').hide();
		$('.artistsContainer').hide();
		$('.addedArtistsContainer').hide();
		$('.info-icon').hide();
		$('.info-container').hide();
	});
};

// This function loops through array and calls the getData method to get the artist object from spotify. 
// Note: the getData method also appends the artist object returned from spotify to the handlebars artistCardTemplate.
app.getArtistsInfo = function(arrayName){
	arrayName.forEach(function(artistName){
		app.getData(artistName);
	});
};

// Get data function using the spotify api
app.getData = function(artistName) {
	$.ajax({
		url: "https://api.spotify.com/v1/search",
		method: 'GET',
		dataType: 'json',
		data: {
			q: artistName +" artist:"+ artistName,
			type: 'artist',
			artist: artistName,
		}
	})
	.then(function(res){ 
		app.artists = [];
		$('.artistsContainer').empty();
		$('.artistsContainer').html('<button type="button" class="add-another-artist">Back to Search</button>');
		app.artists.push(res.artists.items[0]);
		$('.artistsContainer').append(app.template(res.artists.items[0]));
		app.checkAddToPlaylistStatus();
	});
};

// Function to retrieve songs, taking artistId for search parameter
app.getSongs = function(artistID) {
	return $.ajax({
		url: "https://api.spotify.com/v1/artists/" + artistID + "/top-tracks",
		method: 'GET',
		dataType: 'json',
		data: {
			country: 'CA',
		}
	});
};

// Function to run on playlist button click
app.createPlaylistListener = function(){
	var counter = 0;
	// For each added artist, get 5 songs.
	for (var i = 0; i < app.addedArtists.length; i++){
		// Run getSongs function for each artist
		app.getSongs(app.addedArtists[i])
		// Send 5 songs from each artist into app.songs
		.then(function(res){
			counter++;
			for (var i = 0; i < 5; i++) {
				app.songs.push(res.tracks[i].id);
			}
			// Run createPlaylist function
			if( counter === app.addedArtists.length) {
				app.createPlaylist();
			}
		});
	}
};

// Document ready
$(function(){
	// init function
	app.init();
});


// Ajax Autocomplete
// Source: https://github.com/devbridge/jQuery-Autocomplete
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

// Function for Search input
app.searchButtonListener = function(){
	// On submit of search
	$('form').on('submit', function(e){
		e.preventDefault();
		// Empty array for artist choice
		var userArtistChoice = []
		// Get value of search input
		var artist = $('.searchFormInput').val();
		// Check if search is a dine alone artist
		if(dineAloneArtists.indexOf(artist) >= 0){
			userArtistChoice.push(artist);
			app.getArtistsInfo(userArtistChoice);
			$('.searchFormInput').val('');
			app.hideSearchForm();
		}
		// This was an easter egg for Heather Payne of HackerYou, Taylor's twin sister.
		else if (artist === "heather") {
			userArtistChoice.push("Taylor Swift");
			app.getArtistsInfo(userArtistChoice);
			$('.searchFormInput').val('');
			app.hideSearchForm();
		}
		// Error handling for improper search
		else {
			$('.searchFormInput').focus();
			$('.searchFormInput').addClass('wrong');
			$('.searchFormInput').addClass('animated shake');
			setTimeout(function(){
				$('.searchFormInput').removeClass('animated shake');
				$('.searchFormInput').removeClass('wrong');
				$('.searchFormInput').val('');
			}, 1000);
		}
		// Close info message if visible
		if( $('.info-container').is(":visible") ) {
			$('.info-container').hide();
			$('.info-icon').addClass('fa-info-circle').removeClass('fa-times-circle');
		}
	});
};

// This function checks if artist that is searched is already in playlist,
// If so, set the artist card styling
app.checkAddToPlaylistStatus = function() {

	for (var i = 0; i < app.addedArtists.length; i++) {
		var currentArtistID = $('.artistsContainer').find('.addToPlaylist').data();
		if (currentArtistID.artist === app.addedArtists[i]) {
			$('.artistsContainer').find('.addToPlaylist').addClass('addToPlaylistPressed');
			$('.artistsContainer').find('.addToPlaylist').text('Remove');

		}
	
	}
};

// Add to playlist function
// Check if artist has already been added, allows max of 4 artists in playlist.
app.addToPlaylistListener = function() {
	
	$('.artistsContainer').on('click', ".addToPlaylist", function(){
		// Check if artists id is already in app.addedArtists
		var index = app.addedArtists.indexOf(app.artists[0].id);
		if (index >= 0) {
			app.addedArtists.splice(index,1);
			$('.addToPlaylist').removeClass('addToPlaylistPressed');
			$('.artistsContainer').find('.addToPlaylist').text('Add to Playlist');
			// Remove Artist from addedArtistContainer if already present
			$('.addedArtistsContainer .addedArtistsCard[data-addedartist="' + app.artists[0].id +'"]').remove(); 
		}
		else {
			if (app.addedArtists.length < 4){
				app.addedArtists.push(app.artists[0].id);
				$('.addToPlaylist').addClass('addToPlaylistPressed');
				$('.artistsContainer').find('.addToPlaylist').text('Remove');
				// Send artist to added artists template in addedArtistContainer
				$('.addedArtistsContainer').append(app.addedTemplate(app.artists[0]));
				$('.addedArtistsContainer').addClass('show');
			}else {
				$('.artistsContainer').find('.artistCardImgContainer').append("<div class='alert'><i class='fa fa-times-circle alert-message' aria-hidden='true'></i><p>Four artists have been chosen. You can create your playlist now or choose different artists.</p></div>");
			} 
		}
		
	});
};

// Start button function
app.startButton = function() {
	$('.startButton').on('click',function(){
		$('.form-box').css('display','flex').show();
		// Run animation events function
		app.splashHideFormLoad();
	});
};

// Join all spotify song IDs into one string and create into URL for spotify player
app.createPlaylist = function(){
	// Create a string of all song IDs from the app.songs array and store it in the spotifySongListChain
	var spotifySongListChain = app.songs.join(',');
	// create iframe html code that uses spotifySongListChain to dynamically create an iframe, store it in a widgetCode variable, and....
	var widgetCode = `<i class="fa fa-times-circle" aria-hidden="true"></i><iframe class="spotify" src="https://embed.spotify.com/?uri=spotify:trackset:DineAloneRecords:${spotifySongListChain}" width="300" height="400" frameborder="0" allowtransparency="true"></iframe>`;
	// insert it into the spotifyContainer in the html using the widgetCode
	$('.spotifyContainer').html(widgetCode);
};

// Animation function for transition of splash page to search input
app.splashHideFormLoad = function() {
	$('.splash img').hide("slow", "swing");
	setTimeout(function(){
		$('.splash').addClass('shrinkSplash');
		setTimeout(function(){
			$('.splash').hide("fast", "swing");
			setTimeout(function(){
				$('.searchForm').show("slow", "swing");
				$('.info-icon').fadeIn();
			},100);
		},250);
	},1000);
};

// Function to hide search input and show artist container
app.hideSearchForm = function() {
	$('.searchForm').hide("slow", "swing");
	$('.artistsContainer').addClass("showArtistContainer");
};

// Function to close artist container and re show search input
app.closeArtistContainerListener = function() {
	$('.artistsContainer').on('click', '.add-another-artist', function(){
		app.showSearchForm();
	});
};

// Timed function that will show the searchForm
app.showSearchForm = function() {
	$('.searchForm').show("fast", "swing");
	$('.artistsContainer').removeClass("showArtistContainer");
	$('.artistsContainer').empty();
};

// Function to close spotify container
app.closeSpotifyContainerListener = function(){
	$('.spotifyContainer').on('click', '.fa-times-circle', function(){
		location.reload();
	});
};

// Function to remove artist from added artist on click of image
app.littleImageListener = function(){
	$('.addedArtistsContainer').on('click', '.removeImg', function(e){
		var thisArtist = $(this).closest('.addedArtistsCard').data();
		var thisArtistId = thisArtist.addedartist;
		for (var i = 0; i < app.addedArtists.length; i++){
			if (app.addedArtists[i] === thisArtistId){
				app.addedArtists.splice(i,1);
			}
		}
		$(this).closest('.addedArtistsCard').remove();
		app.showSearchForm();
	});
};

// Function to close added artists container
app.closeAddedArtistContainer = function () {
	$('.closeAddedArtistsButton').on('click', function () {
		$('.addedArtistsContainer').removeClass('show');
	});	
};

// Function for info icon
app.infoMessage = function () {
	$('.info-icon').on('click', function () {
		$('.info-container').toggle();
		$(this).toggleClass('fa-times-circle');
		$(this).toggleClass('fa-info-circle');
	});
};

// Function to close artist limit message
app.maxArtistsMessage = function() {
	$('.artistsContainer').on('click', '.fa-times-circle', function(){
		app.showSearchForm();
	});
};

