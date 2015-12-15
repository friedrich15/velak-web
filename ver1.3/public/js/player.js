var next;

if (window.location.hash == '#ext') {
  $('#player-container').append("<link rel='stylesheet' href='/css/player-desktop.css'></link>")
  $('#player-container').addClass('external');
}
else {
  $('#player-container').append( "<link rel='stylesheet' media='(max-width: 599px)' href='/css/player-mobile.css'></link><link rel='stylesheet' media='(min-width: 600px)' href='/css/player-desktop.css'></link>")
}

function play_track(obj) {
  var player = document.getElementById('audio');
  var track = $(obj).data('track');
  var artist = track.artist;
  var title = track.title;
  var originalName = track.originalName;
  var url = '/uploads/audio/'+track.name;


  next = $(obj).next();
  $('.active-track').removeClass('active-track');
  $(obj).addClass('active-track');
  if (title){
    $('#title').text(title);
  }
  else $('#title').text(originalName);

  $('#artist').text(artist);
  $('#audio').prop('src',url);
  $('#audio').trigger('play');
}

$('#audio').bind('ended', function(){
  console.log(next);
  if (!next) {
    next = $('#track-list').children().eq(1);
    console.log(next);
  }
  play_track(next);
})
