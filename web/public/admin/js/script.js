$(function(){
  append_hover();

  // $('#tab-menu a').click(function (e) {
  //   // e.preventDefault();
  //   $(this).tab('show');
  // });
});



function append_hover() {
  $( "li.li-project" ).hover(
    function() {
      $( this ).children(".deleteLink").show();
    }, function() {
      $( this ).children(".deleteLink").hide();
    }
  );

}

function deleteProject(obj) {
  // alert('ahuiui')
}
