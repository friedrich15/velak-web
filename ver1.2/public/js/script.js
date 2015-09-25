$(document).ready(function(){
  sort_it();
});

function sort_it() {
  $("#photo-list li").sort(sort_li) // sort elements
    .appendTo('#photo-list'); // append again to the list
                  // sort function callback
    function sort_li(a, b){
      return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
    }

}
