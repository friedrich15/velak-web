

$(document).ready(function(){
  // sort_it();
  getFutureProjects();
  // onImagesLoaded();

});

function getFutureProjects(){
  $.ajax({
    url: '/futureprojects',
    type: 'post'
  }).done(function(content){
    $('#future-projects').html(content)
  });
};
