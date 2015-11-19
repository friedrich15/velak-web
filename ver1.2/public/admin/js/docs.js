$(window).load(function(){
  chatScrollToBottom();
  getChatMsgs();
});


function chatScrollToBottom() {
  var elem = document.getElementById('chat-text');
  elem.scrollTop = elem.scrollHeight;
}

function getChatMsgs() {
  $.get('/admin/docs/get_chat_msgs', function(res){
    $('#chat-text').html(res);
  });
}

function sendChatMsg() {
  if ($('#chat-msg').val()!='') {
    var msg = $('#chat-msg').val();
    var id = $('#chat-msg').data('user');
    var data = {
      'id': id,
      'msg': msg
    }
    console.log(data);
    $.ajax({
      type: 'POST',
      url: '/admin/docs/save_chat_msg',
      data: data
    }).done(function(res){
      $('#chat-text').html(res);
      $('#chat-msg').val('');
      chatScrollToBottom();
    })
  }
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
    $.get('/admin/docs/delete_msg/'+id, function(res){
      if (res == 'success'){
        $(obj).remove();
      }
    });
  }
}
