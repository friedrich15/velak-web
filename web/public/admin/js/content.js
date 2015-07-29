$(document).on({
    ajaxStart: function() { $('body').addClass('loading');    },
     ajaxStop: function() { $('body').removeClass('loading'); }
});

                                                // ** Projects (adding, removing, saving, ...)
function saveProject(name) {
  $.ajax({
    type: 'POST',
    url: '/admin/save_project',
    data: {'name': name}
  }).done(function(data){
    $('.temp').removeClass('temp').attr('id', data.id);
    $('.all-new').removeClass('all-new').attr('name', data.id);
  });
}

function loadProject(li_element) {
  var id = $(li_element).attr('name');
  $.ajax({
    type: 'POST',
    url: '/admin/load_project',
    data: {'id': id}
  }).done(function(project){
    $('#input-title').val(project.title);
    $('#input-name').val(project.name);
    $('#input-description').val(project.description);
    $('#category-selector').val(project.category);
    $('#project-visible').prop('checked', project.visible);
    $('.active-link').removeClass('active-link');
    $(li_element).addClass('active-link');
    $('#info-container').show();
  });
}

function updateProject() {
  var title = $('#input-title').val();
  var name = $('#input-name').val();
  var description = $('#input-description').val();
  var id = $('.active-link').attr('name');
  var category = $( '#category-selector option:selected' ).text();
  var visible = $('#project-visible').is(':checked');
  console.log(visible);
  $.ajax({
    type: 'POST',
    url: '/admin/update_project',
    data: {
      'id': id,
      'title': title,
      'name': name,
      'description': description,
      'category': category,
      'visible': visible
    }
  }).done(function(){
    showAlert('success', 'Saving of "' + title + '" successful!');
  })

}

// #TODO:0 hide info-form after deleteProject

function deleteProject(id, obj){
  var name = $(obj).prev().text();

  if(confirm('Really remove ' + name + '?')){
    $.ajax({
      type: 'POST',
      url: '/admin/delete_project',
      data: {'id': id}
    }).done(function(project){
      $(obj).closest('li').remove();
      showAlert('success', name+' successfully removed!')
    }).fail(function(obj, i, err){
      showAlert('danger', 'Removing was not possible: ' + err)
    });
  }

}

function addProject() {
  var p_name = $('#new-project-input').val();
  var name_exists = false;
  $('.li-project').each(function(){
    if (p_name == $(this).children('.pLink').text()){
      name_exists = true;
    };
  })
  if (p_name !== '' && name_exists == false){
    // $('#project-list').append('<li class='li-project'><a href='#' class='pLink'>'+p_name+'</a><a onclick='deleteProject(this)' class='deleteLink'><span class='glyphicon glyphicon-remove-circle'></li>');
    var p = $('.li-project:first').clone();
    p.children('.pLink').text(p_name);
    p.children('.deleteLink').removeAttr('id');
    p.children('.deleteLink').addClass('temp')
    p.addClass('all-new');
    $('#project-list').append(p);
    append_hover();
    $('#new-project-input').val('');
    saveProject(p_name);
  }
  else if (name_exists == true) {
    showAlert('danger', 'Projectname "' + p_name + '" already exists!');
    $('#new-project-input').val('');
  }
}



function checkKey(e){         // ** check if Enter is pressed on inputfield
  console.log(e.charCode);
  if(e.charCode == 13) {
    addProject();
  }
}

function showAlert(type, alert_text) {        // ** trigger Alert
  $('<div/>', {
    class: 'my-alert noselect alert alert-'+type,
    html: alert_text
  }).appendTo('#alert-container').fadeIn(500).delay(3000).fadeOut(1000);
}
