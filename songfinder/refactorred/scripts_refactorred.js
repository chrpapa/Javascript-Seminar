$(document).ready(function(){

var $songInput = $("#songInput");
var $submitBtn = $("#submitBtn");
$("#loading").hide(); 

function Song(title,artist, img, playUrl){
  this.title = title;
  this.artist = artist;
  this.img = img;
  this.play = playUrl || "#"; 

  this.render = function(templateSource, templateLocation){
    var $songTemplate = _.template( $(templateSource).html() );
    var $songLocation = $(templateLocation);
    $songLocation.append($songTemplate(this) );
  }
}

function PlayableSong(song){
  this.title = song.title;
  this.artist = song.artist;
  this.img = song.img;
  this.play = song.play || "#"; 
  var playUrl = this.play;

  this.render = function(templateSource, templateLocation){
    var $songTemplate = _.template( $(templateSource).html() );
    var $songLocation = $(templateLocation);
    $songLocation.append($songTemplate(this) );
    //show audio controls and play song
    var audio = document.getElementById("songAudio");
    audio.setAttribute("controls","controls");
    document.getElementById("spotifySong").src = playUrl;
    audio.play(playUrl); 
  }
}

//calls web service to search for a song
function SongWS() {
    this.getSong = function(songInput) {
      var url = 'https://api.spotify.com/v1/search?q='+ songInput + '&type=track';
      var response = undefined;
     //TODO: refactor - sync ajax call is deprecated
     $.ajax({
        url: url,
        success: function(data) {
          response = data;
        },
        async:false
     });
     return response;
    };
}

var songcache = {};
//caches frequently requested songs. If a song is not already cached 
function SongProxy() {
  var songws = new SongWS();
  return {
      getSong: function(songInput) {
          if (!songcache[songInput]) //cache miss -> add to cache
              songcache[songInput] = songws.getSong(songInput);
          return songcache[songInput]; 
      },
      getCount: function() {
          var count = 0;
          for (var song in songcache) { count++; }
          return songcache.count;
      }
  };
};

var decorators = {};
function getSongObj(songObj){
   var songImg = undefined;
   if (songObj.album.images.length) songImg = songObj.album.images[2].url;
   else songImg = "none";
   return new Song(songObj.name, songObj.artists[0].name, songImg, songObj.preview_url);
}

function SongView(data) {
    this.data = data;
    this.decorator;
    this.render = function(){
      if(this.decorator) {
        decorators[this.decorator].render(this.data);//if decorator used render with decorated view 
        return;
      }

      var playableSong = new PlayableSong(getSongObj(data.tracks.items[0]))
      playableSong.render("#song-template", "#song-container");//since its a playablesong instance it will start immediately to play
    }

    this.decorate = function(decorator){
      this.decorator = decorator;
    }
}

//create decorator for multiple songs view
decorators.songsView = {
    render: function(data) {
       _.each(data.tracks.items, function(songObj, index){
         getSongObj(songObj).render("#song-template", "#song-container");
      })
}

};  

// global display to distin
var display = function(response) {
  if (!response.tracks) {
     $('#song-container').append("<div class='errorInput text-center'>Err0r enter a real song</div>");
       return;
  } 
  if (response.tracks.items.length == 1) { // If song found and TODO: playback url exists
    var songView = new SongView(response);
    songView.render(); //play song
  }
  else if (response.tracks.items.length > 1) { // If multiple potential songs found display song list
    var songView = new SongView(response);
    songView.decorate('songsView');
    songView.render();
  }       
  else {
     $('#song-container').append("<div class='errorInput text-center'>unknown error</div>");
  }
};



$('form').on('submit', function(){
  event.preventDefault();
  $("#song-container").empty();
  //create a songProxy instance to search song in cache and redirect if necessary
  var songproxy = new SongProxy();
  // execute songproxy request and store result
  var response = songproxy.getSong($songInput.val());
  //display response
  display(response);
  $songInput.on("focusin", function(){
    $("#song-container div").remove();
  })
  $(document).ajaxStart(function () {
    $("#loading").show();
    }).ajaxStop(function () {
    $("#loading").hide();
  });
 });

});
