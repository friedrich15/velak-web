$(document).ready(function(){
  // sort_it();
  getFutureProjects();

});

function getFutureProjects(){
  console.log(moment().valueOf());
  $.ajax({
    url: '/futureprojects',
    type: 'post'
  }).done(function(content){
    console.log(content);
    $('#future-projects').html(content)
  });
};
