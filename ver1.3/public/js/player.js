var next;

$(document).ready(function() {
  $('#audio-player').removeClass('loading');
  $('#player-container').fadeIn(600);
})

if (window.location.hash == '#ext') {
  $('#player-container').append("<link rel='stylesheet' href='/css/player-desktop.css'></link>")
  $('#player-container').addClass('external');
}
else {
  $('#player-container').append( "<link rel='stylesheet' media='(max-width: 599px)' href='/css/player-mobile.css'></link><link rel='stylesheet' media='(min-width: 600px)' href='/css/player-desktop.css'></link>")
}

function play_track(obj) {
  var player = document.getElementById('audio');
  // var track = $(obj).data('track');
  var artist = $(obj).data('artist');
  var title = $(obj).data('title');
  var originalName = $(obj).data('oname');
  var url = '/uploads/audio/'+$(obj).data('name');


  next = $(obj).next();
  $('.active-track').removeClass('active-track playing');
  $(obj).addClass('active-track playing');
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
