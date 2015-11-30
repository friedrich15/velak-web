function saveColor(e) {
  var obj = e.target.closest('tr');
  var id = $(obj).data('userid');
  var colorhex = e.color.toHex();
  e.color.setSaturation(.1);
  var colorLight = e.color.toHex();
  console.log(colorLight);
  var data = {
    'id': id,
    'color' : colorhex,
    'colorlight' : colorLight
  };
  $.ajax({
    type: 'POST',
    url: '/admin/update_user_color',
    data: data
  }).done(function(res){
    $(e.target).closest('tr').addClass('save-success');
    setTimeout(function(){
      $(e.target).closest('tr').removeClass('save-success');
    }, 500);
    console.log(res);
  })
}

function isNameUnique(callback) {
  var name = $('#username').val();
  $.get('/admin/is_name_unique/'+name, function(res) {
    // console.log(res);
    callback(res);

  });
}

$(document).on('submit', '#register-form', function(event) {
  event.preventDefault();
  var obj = this;
  isNameUnique(function(result){
    if (result===true){
      obj.submit();
    }
    else {
      $('#username').addClass('name-error')
      $('.name-exists').show();
    }
  })
})

function removeTag(obj) {
  console.log('asd');
  $(obj).removeClass('name-error');
  $('.name-exists').hide();
}
