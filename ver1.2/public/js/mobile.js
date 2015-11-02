function showSideMenu() {
  $('#side-menu ul').toggleClass('show-menu mobile-hidden');
  $('#mobile-menu').toggleClass('isactive notactive');
}

function hideSideMenu() {
  $('.isactive').addClass('notactive').removeClass('isactive');
  $('.show-menu').addClass('mobile-hidden').removeClass('show-menu');
}
