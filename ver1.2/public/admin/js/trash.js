function hit_masonry() {
  var $container = $('#trash-grid');
  $container.imagesLoaded( function(){
    console.log('nau!');
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
  this_id = ids.splice(0,1);
  console.log(this_id);
  $.ajax({
    type: 'GET',
    url: '/admin/empty_del_photos/' + this_id
  }).done(function(res){
    if (res != 'err') {

      if (ids.length!=0){
        $('#'+ res).fadeOut(100);
        empty_photo_trash(ids);
        console.log(res);
      }
      else {
        $('#'+ res).hide(function(){
          $('#photo-trash-empty').removeClass('hidden');
        });

        $('#empty_photo_btn').hide();
      }

      // if (obj_count <= 0) {

      // }
    }
  });
}

function prepare_to_remove(obj) {
  var ids = $(obj).data('photos');
  if (confirm('Are you sure you want to permanently remove those photos?')) {
    empty_photo_trash(ids);
  }
}