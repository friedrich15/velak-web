$(document).ready(function(){

  convertLinks();
});
function convertLinks(documentRoot) {
  if (!documentRoot) documentRoot = document;

  // Get all links
  var links = documentRoot.querySelectorAll("a.pjax");
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var href = $(link).attr('href') + location.hash;
    if (href.indexOf('http://') !== 0) {


      (function(href){

        $(link).on('click', function(e){

          if (e.metaKey || e.ctrlKey) return;

          e.preventDefault();

          openPage(href);

        });
      })(href);
    };
  }
}

window.onpopstate = function(event) {
  var href = event.state.href;
  loadPage(href);
};

function openPage(href, bonus) {
  history.pushState({ href: href }, href, href);
  loadPage(href, bonus);
}

function loadPage(href, bonus) {
  for (var i = 0; i < $('.pjax').length; i++) {
    var link = $('.pjax').eq(i);

    if (link.attr('href')==href) {
      link.parent().addClass('active')
      link.parent().siblings().removeClass('active')
      link.closest('ul').siblings().children().removeClass('active')
    }
  }

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if(xmlhttp.status == 200) {

        finishedLoading(xmlhttp.response, bonus);


      }
      else { console.log("something else other than 200 was returned"); }
    }
  }
  console.log(href);
  $('main').addClass('loading');
  xmlhttp.open("GET", href, true);

  // Tells the browser to retrieve the response as a HTML document
  xmlhttp.responseType = "document";

  xmlhttp.send();


  // $.ajax({
  //   type: 'GET',
  //   url: href,
  //   dataType: 'document'
  // }).done(function(e){
  //   console.log(e)
  // })
}

function finishedLoading(responseHtml, bonus) {
  var newHTML = responseHtml.querySelector("main").innerHTML;
  var mainElement = document.querySelector("main");
  mainElement.innerHTML = responseHtml.querySelector("main").innerHTML;

  convertLinks(mainElement);
  make_tabs_loadable();
  check_filters_onload();
  hit_masonry();
  append_hover();
  sort_it_out();
  make_sortable();
  $('.colorpick').colorpicker({format: 'hex'}).on('hidePicker.colorpicker', function(e){saveColor(e)});

  if ($('#docs-content')) {
    getChatMsgs();
  }

  $('main').removeClass('loading');
  $('.dropzone').dropzone();

  if (bonus!==undefined) {
    showAlert(bonus.type, bonus.text);
  }

}
