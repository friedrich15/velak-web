
$(document).ready(function(){
  var $container = $('.grid');
  $container.imagesLoaded( function(){
    console.log('nau!');
    $container.masonry({
      // options
      itemSelector: '.grid-item'
    });
    $('.image').addClass('image-visible');
  });
});
