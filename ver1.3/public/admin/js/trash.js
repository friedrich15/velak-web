function hit_masonry() {
  var $container = $('#trash-grid');
  $container.imagesLoaded( function(){
    $container.masonry({
      // options
      itemSelector: '.trash-item'
    });
    $('.image').addClass('image-visible');
  });
}
$(document).ready(function(){
  hit_masonry();
});

function empty_photo_trash(ids) {
  var this_id = ids.splice(0,1);
  $.ajax({
    type: 'GET',
    url: '/admin/empty_del_photos/' + this_id
  }).done(function(res){

    if (res != 'err') {
      if (ids.length!=0){
        $('#'+ res).fadeOut(100);
        empty_photo_trash(ids);
      }
      else {
        $('#'+ res).hide(function(){
          $('#photo-trash-empty').removeClass('hidden');
        });
        $('.photo-trash').css('height', '100px');
        $('#empty_photo_btn').hide();
      }

      // if (obj_count <= 0) {

      // }
    }
    else {
      empty_photo_trash(ids);
    }
  });
}

function empty_trash(kind, ids) {

  $.ajax({
    type: 'post',
    url: '/admin/empty_trash/'+kind,
    data: {'ids': JSON.stringify(ids)}
  }).done(function(){
    $('.trash-photo').each(function(){
      $(this).hide(400);
    });
    $('#photo-trash-empty').removeClass('hidden');
    $('#empty_photo_btn').hide();

  })
  // $.get('/admin/empty_trash/'+kind, function(res){
  //   if (res=='success') {
  //     $('.trash-photo').each(function(){
  //       $(this).hide(400);
  //     });
  //     $('#photo-trash-empty').removeClass('hidden');
  //     $('#empty_photo_btn').hide();
  //   }
  // })
}

function prepare_to_remove(obj) {
  var ids = $(obj).data('photos');

  if (confirm('Are you sure you want to permanently remove those photos?')) {
    empty_photo_trash(ids);
  }
}
