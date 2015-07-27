function load_content(obj, i) {
  if ($(obj).hasClass('active')==false){
    $('.active').removeClass('active');
    $(obj).addClass('active');
    $('#content-container').hide();
    window.history.replaceState(null, null, '/site/'+i);
    $.ajax({
      type: 'POST',
      url: '/site/'+i
    }).done(function(data){
      var projects = data.projects;
      $('#project-list').html('');
      $('#project-title').text('');
      $('#project-description').text('');
      for (j = 0; j < projects.length; j++){
        var project = projects[j];
        if (project.deleted !== true && project.visible == true && project.category == data.cat){
          $('#project-list').append('<li onclick=\'load_project("'+project._id+'", "'+data.cat+'")\'>'+project.title+'</li>');
        }
      };
      document.title = data.title;
      $('#content-container').fadeIn(300);
    });
  }
}

function load_project(id, cat) {
  window.history.replaceState(null, null, '/site/'+cat+'/'+id);
  $.ajax({
    type: 'POST',
    url: '/load_project',
    data: {
      'id': id,
      'cat': cat
    }
  }).done(function(project){
    $("#project-title").text(project.name);
    $("#project-description").text(project.description);
  })
}
