function load_content(obj, i) {
  if ($(obj).hasClass('active')==false){
    $(".active").removeClass("active");
    $(obj).addClass("active");
    $("#content-container").hide();
    window.history.replaceState(null, null, "/site/"+i);
    $.ajax({
      type: "POST",
      url: "/site/"+i,
      data: {"contentType": i}
    }).done(function(data){
      var projects = data.projects;
      $("#project-list").html("");
      for (j = 0; j < projects.length; j++){
        var project = projects[j];
        if (project.deleted !== true && project.category == data.cat){
          $("#project-list").append("<li>"+project.title+"</li>");
        }
      };
      document.title = data.title;
      $("#content-container").fadeIn(300);
    });
  }
}
