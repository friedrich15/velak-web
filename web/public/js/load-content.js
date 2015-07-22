function load_content(obj, i) {
  if ($(obj).hasClass('active')==false){
    $(".active").removeClass("active");
    $(obj).addClass("active");
    $("#content-container").hide();
    window.history.replaceState(null, null, "/site/"+i);
    $.ajax({
      type: "POST",
      url: "/site/"+i,
      data: {"contentType": i},

    }).done(function(data){
      $("#content-container > p").text(data.content);
      document.title = data.title;
      $("#content-container").fadeIn(300);
    });
  }
}
