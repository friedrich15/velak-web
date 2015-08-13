$(document).ready(function(){
  append_hover();

});

var $container = jQuery('.grid');

$container.masonry({

  columnWidth: 200,
  itemSelector: '.grid-item'

});


function append_hover() {
  $( "li.li-project" ).hover(
    function() {
      $( this ).children(".deleteLink").show();
    }, function() {
      $( this ).children(".deleteLink").hide();
    }
  );

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
  }).done(function(project){
    var messageText = 'Saving of "' + project.name + '" successful!';
    var message = {
      type : 'success',
      text : messageText
    }
    openPage('/admin/project/'+ project.id, message)
  })

}

function saveProject(name) {
  $.ajax({
    type: 'POST',
    url: '/admin/save_project',
    data: {'name': name}
  }).done(function(data){
    $('.temp').removeClass('temp').attr('id', data.id);
    $('.all-new').removeClass('all-new').attr('name', data.id);
    openPage('/admin/project/' + data.id);
  });
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

function deleteProject(id, obj){
  var name = $(obj).prev().text();

  if(confirm('Really remove ' + name + '?')){
    $.ajax({
      type: 'POST',
      url: '/admin/delete_project',
      data: {'id': id}
    }).done(function(data){
      var messageText = 'Project "' + data.project.name + '" succesfully moved to bin.';
      var message = {
        type: 'info',
        text: messageText
      };
      openPage('/admin/projects', message)
    }).fail(function(obj, i, err){
      showAlert('danger', 'Removing was not possible: ' + err)
    });
  }
}

function createDownloadLink(id) {

  $.get( '/admin/create_link/' + id, function(){

  });
}

function selectAll(obj) {
  var isChecked = $(obj).is(':checked');
  $('.imgCheck').prop('checked', isChecked);
}

function handleSelected(pid) {
  var action = $('#action-selection').val();
  switch(action) {
    case 'delete':
      deleteSelected(pid);
      break;
    case 'public':
      $('.imgCheck:checked').each(function(){
        var obj = $(this).siblings('.img-caption').children('.public-checkbox');
        var iid = $(this).closest('.img-item').attr('id');
        publicState(obj, pid, iid, true);
      });
      break;
    case 'notpublic':
      $('.imgCheck:checked').each(function(){
        var obj = $(this).siblings('.img-caption').children('.public-checkbox');
        console.log(obj);
        var iid = $(this).closest('.img-item').attr('id');
        publicState(obj, pid, iid, false);
      });
      break;
  }
}

function publicState(obj, pid, iid, isChecked) {
  if (isChecked==undefined){
    isChecked = $(obj).is(':checked');
  }
  $.get('/admin/public_state/'+pid+'/'+iid+'/'+isChecked, function(data){
    $(obj).prop('checked', isChecked);
    console.log('heute, ', isChecked);
  })
}

function deleteImg(projectId, imgId, confirmed) {

  if (!confirmed){
    confirmed = confirm('Delete image?');
    deleteImg(projectId, imgId, confirmed);
  }
  else {
    $.get('/admin/delete_img/' + projectId + '/' + imgId, function(data){
      $('#' + data.id).hide();
      showAlert('info', data.name + ' moved to bin.');
    });
  }
}

function deleteSelected(pid) {
  if (confirm('Really delete all selected images?')){
    var confirmed = true;
    $('.imgCheck:checked').each(function() {
      var iid = $(this).closest('.grid-item').attr('id');
      deleteImg(pid, iid, confirmed);
      $('#checkbox-selectAll').prop('checked', false);
    });
  }
}

function toggleView() {
  $('#img-gallery').toggleClass('list-view grid');
  $('.img-item').toggleClass('grid-item');
  $('.img-thumb').toggleClass('thumbnail form-inline');
  $('.img-thumb').children('*').toggleClass('form-group');
  $('.img-caption').toggleClass('caption form-inline');
  $('.img-caption').children('*').toggleClass('form-group');
}

function checkKey(e){         // ** check if Enter is pressed on inputfield
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
