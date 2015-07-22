$(function(){
  append_hover();
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
