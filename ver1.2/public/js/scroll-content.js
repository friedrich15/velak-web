function letItScroll(){

  var lastScrollTop = 0,
      scrollDirection,
      scrollTop,
      positionList = new Array(),
      projectArray = new Array,
      project = {},
      currentProject;

  $('.li-side').each(function(i, e){
    var id = $(e).data('project-id');
    project[id] = true;

  });


  $('.project-container').imagesLoaded(function(){
    if ($('.project-container').height()<= $(window).height()){
      if ($('.li-side.now-last').is(':last-child')){
        console.log('last');
      }
      else {
        var projectId = $('.li-side.now-last').next().data('project-id');
        loadmore(projectId);
        console.log('hihi');
      }
    }
    positionList.push(Array(0, $('.project-container').height(), $('.project-container').attr('id')));
    console.log(positionList);
    $('.photo-list').addClass('visible');
  });

  function pushToList(id) {
    $('#'+id).imagesLoaded(function(){
      $('#'+id + ' .photo-list').addClass('visible');
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
    });
  }

  $(window).scroll(function() {
    scrollTop = $(window).scrollTop();
    getScrollDirection();
    makeLiActive(scrollDirection);
    if(scrollTop == $(document).height() - $(window).height()) {
      if ($('.li-side.now-last').is(':last-child')){
        $('#goToTop').fadeIn(300);
      }
      else {
        var projectId = $('.li-side.now-last').next().data('project-id');

        if (project[projectId]==true){
          project[projectId] = false;
          loadmore(projectId);
        }

      }
    }
    if(scrollTop == 0) {
      if ($('#li'+currentProject).hasClass('initial')){
        console.log(currentProject, positionList);
      }
      else {
        // var projectId = $('.li-side.now-last').next().data('project-id');
        //
        // if (project[projectId]==true){
        //   project[projectId] = false;
        //   loadmore(projectId);
        // }

      }
    }
  });
}
