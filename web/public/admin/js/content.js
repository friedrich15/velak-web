
                                                    // ** Projects (adding, removing, saving, ...)
function saveProject(name) {
  $.ajax({
    type: "POST",
    url: "/admin/save_project",
    data: {"name": name}
  }).done(function(data){
    $(".temp").removeClass("temp").attr("id", data.id);
  })
}
function deleteProject(id, obj){
  var name = $(obj).prev().text();
  // console.log(name);
  // if($(obj).parent('li').hasClass("all-new")){
  //   if(confirm("Really remove " + name + "?")){
  //     $(obj).closest('li').remove();
  //     showAlert("success", name+" successfully removed!")
  //   }
  // }
  // else{

  if(confirm("Really remove " + name + "?")){
    $.ajax({
      type: "POST",
      url: "/admin/delete_project",
      data: {"id": id}
    }).done(function(project){
      $(obj).closest('li').remove();
      showAlert("success", name+" successfully removed!")
    }).fail(function(obj, i, err){
      showAlert("danger", "Removing was not possible: " + err)
    });
  }

}

function addProject() {
  var p_name = $("#new-project-input").val();
  var name_exists = false;
  $(".li-project").each(function(){
    if (p_name == $(this).children(".pLink").text()){
      name_exists = true;
    };
  })
  if (p_name !== "" && name_exists == false){
    // $("#project-list").append("<li class='li-project'><a href='#' class='pLink'>"+p_name+"</a><a onclick='deleteProject(this)' class='deleteLink'><span class='glyphicon glyphicon-remove-circle'></li>");
    var p = $(".li-project:first").clone();
    console.log(p);
    p.children(".pLink").text(p_name);
    p.children(".deleteLink").removeAttr("id");
    p.children(".deleteLink").addClass("temp")
    p.addClass("all-new");
    $("#project-list").append(p);
    append_hover();
    $("#new-project-input").val("");
    saveProject(p_name);
  }
  else if (name_exists == true) {
    showAlert("danger", "Projectname '" + p_name + "' already exists!");
    $("#new-project-input").val("");
  }
}



function checkKey(e){         // ** check if Enter is pressed on inputfield
  console.log(e.charCode);
  if(e.charCode == 13) {
    addProject();
  }
}

function showAlert(type, alert_text) {        // ** trigger Alert
  $("<div/>", {
    class: "my-alert noselect alert alert-"+type,
    html: alert_text
  }).appendTo("#alert-container").fadeIn(500).delay(5000).fadeOut(1000);
}
