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
