function sendChatMsg() {
  var msg = $('#chat-msg').val();
  var id = $('#chat-msg').data('user');
  var data = {
    'id': id,
    'msg': msg
  }
  console.log(data);
  $.ajax({
    type: 'POST',
    url: '/admin/save_chat_msg',
    data: data
  }).done(function(res){
    $('#chat-text').html(res);
    $('#chat-msg').val('');
  })
}

function chat_checkKey(e) {
  console.log('e');
  if(e.charCode == 13) {
    sendChatMsg();
    console.log('13');
  }
}

function removeMsg(id, o) {
  if(confirm('really delete?')){
    var obj = $(o).closest('li');
    $.get('/admin/delete_msg/'+id, function(res){
      if (res == 'success'){
        $(obj).remove();
      }
    });
  }
}
