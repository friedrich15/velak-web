(function(){

  var lastScrollTop = 0,
      scrollDirection,
      scrollTop,
      positionList = new Array(),
      currentProject;

  $(window).load(function(){
    positionList.push(Array(0, $('.project-container').height(), $('.project-container').attr('id')));
    console.log(positionList);
  });

  function pushToList(id) {
    $('#'+id).imagesLoaded(function(){
      positionList.push(Array(
        $('#'+id).position().top,
        $('#'+id).position().top + $('#'+id).height(),
        id
      ));
    });
  }


  function loadmore(id) {
    $('#loadmore').show();
    $.ajax({
      url: '/loadmore/' + id,
      type: 'get'
    }).done(function(content) {
      $('#project-content').append(content);
      $('.li-side.now-last').removeClass('now-last');
      $('#li'+id).addClass('now-last');
      pushToList(id);
      $('#loadmore').hide();
    });
  }

  function getScrollDirection() {
    var st = $(window).scrollTop();
    if (st > lastScrollTop) {
      scrollDirection = 'down';
    }
    else if (st < lastScrollTop) {
      scrollDirection = 'up';
    }
    lastScrollTop = st;
  }

  function makeLiActive() {
    $.each(positionList, function(index, value){
      if (scrollTop >= positionList[index][0] - 200 && scrollTop <= positionList[index][1]){
        if (currentProject!=positionList[index][2]) {
          currentProject=positionList[index][2];
          $('.li-side.active').removeClass('active');
          $('#li'+currentProject).addClass('active');

        }

      }
    })


  }

  $(window).scroll(function() {
    scrollTop = $(window).scrollTop();
    getScrollDirection();
    makeLiActive(scrollDirection);
    if(scrollTop == $(document).height() - $(window).height()) {
      if ($('.li-side.now-last').is(':last-child')){
        console.log('last');
      }
      else {
        var projectId = $('.li-side.now-last').next().data('project-id');
        loadmore(projectId);
      }
    }
  });

})();
