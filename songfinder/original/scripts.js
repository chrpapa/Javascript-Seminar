$(document).ready(function(){


var $songInput = $("#songInput");
var $submitBtn = $("#submitBtn");
$("#loading").hide(); 

function Song(title,artist, img, playUrl){
  this.title = title;
  this.artist = artist;
  this.img = img;
  this.play = playUrl || "#"; 
}
Song.prototype.renderTemplate = function(templateSource, templateLocation){
    var $songTemplate = _.template( $(templateSource).html() );
    var $songLocation = $(templateLocation);
    $songLocation.append($songTemplate(this) );

}

function getSongArray(data){
  return data.tracks.items
}

function createSongsObj(songArray, SongFunc){ 
  var songObjArray = [];
  var song = {};
  _.each(songArray, function(songObj, index){
   var artists = songObj.artists[0].name;
   var title = songObj.name;
   console.log(songObj.album );

   console.log(songObj.album.images );
   //console.log(songObj.album.images[2].url );
   
   if (songObj.album.images.length){
    var songImg = songObj.album.images[2].url;
    console.log(songObj.album.images[2].url )
   } else{
    var songImg = "none";
   }
   var songPrev = songObj.preview_url;
   song[index] = new SongFunc(title, artists, songImg, songPrev);

   songObjArray.push(song[index]);
  });
  return songObjArray;
}

function display(songArray){
  _.each(songArray, function(song, index){
    console.log(song, song.title, song.artist, song.img)
    song.renderTemplate("#song-template", "#song-container");
  });

}


$('form').on('submit', function(){
  event.preventDefault();
  $("#song-container").empty();
  //$("form").append($("<img src='loading.gif' alt='loading' >") );

  //console.log("I was clicked");
  //console.log("songInputVal-" +songInput.val());
   $.get('https://api.spotify.com/v1/search?q='+ $songInput.val() + '&type=track', function(data) {
     console.log(data.tracks.total);
     if(data.tracks.total){
      //console.log(getSongArray(data) );
      //console.log(createSongsObj(getSongArray(data), Song));
      display(createSongsObj(getSongArray(data), Song) );
    }else{
      $('#song-container').append("<div class='errorInput text-center'>Err0r enter a real song</div>");
      //$('#song-container').addClass("error");
    }

   });
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