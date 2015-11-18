function saveColor(e) {
  var obj = e.target.closest('tr');
  var id = $(obj).data('userid');
  console.log(id);
  var color = e.color.toHex();
  var data = {
    'id': id,
    'color' : color
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
  })
}
