$(document).ready(function(){
  append_hover();
  sort_it_out();

  $('#project-list').on('sortupdate', function(event, ui){
    var ul = ui.item.parent();
    var dataObj = { };
    ul.children('li').each(function(i) {
      var li = $(this);
      projectId = li.data('projectId');
      dataObj['position' + projectId] = i;
    });
    console.log(dataObj);
    $.ajax({
      url: '/admin/projectsort',
      type: 'post',
      data: dataObj
    }).done(function() {
      location.reload();
    });
  });
  $('.gutter-sizer').on('sortupdate', function(event, ui){
    var ul = ui.item.parent();
    var id = ul.data('projectId')
    var dataObj = { };
    dataObj['id'] = id;
    ul.children('li').each(function(i) {
      var li = $(this);
      console.log(li.data('photoId'));
      photoId = li.data('photoId');
      dataObj['position' + photoId] = i;
    });
    $.ajax({
      url: '/admin/photosort',
      type: 'post',
      data: dataObj
    }).done(function() {
      // console.log('don');
      // location.reload();
    });
  });
});

var $container = jQuery('.grid');

$container.masonry({

  columnWidth: 200,
  itemSelector: '.grid-item'

});

function sort_it_out() {
  $('.sortable').sortable();
  $('.sortable').disableSelection();
  $(".gutter-sizer li").sort(sort_li) // sort elements
    .appendTo('.gutter-sizer'); // append again to the list
                  // sort function callback
    function sort_li(a, b){
      return ($(b).data('position')) < ($(a).data('position')) ? 1 : -1;
    }

}

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
  var date = $('#input-date').val();
  var description = $('#input-description').val();
  var id = $('.active-link').attr('name');
  var category = $( '#category-selector option:selected' ).text();
  var visible = $('#project-visible').is(':checked');
  console.log(date);
  $.ajax({
    type: 'POST',
    url: '/admin/update_project',
    data: {
      'id': id,
      'title': title,
      'name': name,
      'date': date,
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

  $.get( '/admin/create_link/' + id, function(data){
    $('.photolink').attr('href', data.link).text(data.link).show();
    $('#downloadLink').attr('disabled', true);
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
    if (confirmed==true){
      deleteImg(projectId, imgId, confirmed);
    }
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
      var iid = $(this).closest('.img-item').attr('id');
      console.log(iid);
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
  $('.toggle-view').toggleClass('glyphicon-th-list glyphicon-th-large')
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

Dropzone.options.photoUpload = {
  init: function() {
    this.on(
      "queuecomplete", function(file, res) {
        showAlert('success', 'All files uploaded successfully! Please reload page to see them!')
      }),
      "totaluploadprogress", function(uploadprogress) {
        console.log(uploadprogress);
      };
  }
};

// - var iid = '"'+ photo._id +'"'
// - var iname = '"' + photo.originalName + '"'
// li.grid-item(id=photo._id).img-item
//   .thumbnail.img-thumb
//     input(id='check'+photo._id, name='imgDelete', type='checkbox').imgCheck
//     .div-img
//       img(src= '../../uploads/small/small'+ photo.name)
//     .caption.img-caption
//       .div-photo-name
//         p= photo.originalName
//
//       input(id= 'public'+photo._id, name='imgPublic', type='checkbox', onclick='publicState(this,#{pid},#{iid})', checked=photo.filePublic).public-checkbox
//       label(for='public'+photo._id, title='public').glyphicon.glyphicon-eye-open
//       button(onclick='deleteImg(#{pid},#{iid})').form-control.btn.btn-default delete
