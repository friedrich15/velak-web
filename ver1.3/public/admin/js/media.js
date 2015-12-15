var timer;

function saveDescription(obj, projectID, photoName) {
  var text = $(obj).val();
  var data = {'id': projectID, 'text': text, 'photo': photoName};
  $.ajax({
    method: "POST",
    url: "/admin/save_photo_description",
    data: data
  })
    .done(function( msg ) {
      console.log( "Data Saved: " + msg );
      $(obj).addClass('save-success');
      setTimeout(function(){
        $(obj).removeClass('save-success');
      }, 100);
    });
}

function savePhotoDescription(obj, projectID, photoName) {

  clearTimeout(timer);
  timer = setTimeout(function(){
    saveDescription(obj, projectID, photoName);
  }, 1000);
}
