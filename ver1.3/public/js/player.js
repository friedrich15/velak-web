function play_track(obj) {
  var player = document.getElementById('audio');
  var track = $(obj).data('track');
  var artist = track.artist;
  var title = track.title;
  var url = '/uploads/audio/'+track.name;

  $('#title').text(title);
  $('#artist').text(artist);
  $('#audio').prop('src',url);
  $('#audio').trigger('play');
}
