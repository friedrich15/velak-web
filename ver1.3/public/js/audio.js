$(document).ready(function(){
  $.ajax({
    url: '/audio/player',
    type: 'get'
  }).done(function(data) {
    $('#audio-player').html(data)
  });
})
