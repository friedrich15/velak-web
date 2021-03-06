$(document).ready(function(){

  $('.colorpick').colorpicker({format: 'hex'}).on('hidePicker.colorpicker', function(e){saveColor(e)});

  make_tabs_loadable();
  check_filters_onload();
  append_hover();
  sort_it_out();
  make_sortable();

  $('#audioupload').on('queuecomplete', function(){
    location.reload();
  })


});

function make_sortable(){
  $('#project-list').on('sortupdate', function(event, ui){
    var ul = ui.item.parent();
    var dataObj = { };
    var projectId;
    ul.children('li').each(function(i) {
      var li = $(this);
      projectId = li.data('projectId');
      dataObj['position' + projectId] = i;
    });
    $.ajax({
      url: '/admin/projectsort',
      type: 'post',
      data: dataObj
    }).done(function() {
      // location.reload();
    });
  });
  $('#audio-list').sortable({ cancel: '.li-header' });
  $('#audio-list').on('sortupdate', function(event, ui){
    var ul = ui.item.parent();
    var dataObj = { };
    var trackId;
    ul.children('.list-child').each(function(i) {
      var li = $(this);
      trackId = li.data('trackId');
      dataObj['position' + trackId] = i;
    });
    $.ajax({
      url: '/admin/tracksort',
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
    var photoId;
    dataObj['id'] = id;
    ul.children('li').each(function(i) {
      var li = $(this);
      photoId = li.data('photoId');
      dataObj['position' + photoId] = i;
    });
    $.ajax({
      url: '/admin/photosort',
      type: 'post',
      data: dataObj
    }).done(function() {
      // location.reload();
    });
  });
}

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

function make_tabs_loadable(){
  if (location.hash !== '') $('a[href="' + location.hash + '"]').tab('show');
  return $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    return location.hash = $(e.target).attr('href').substr(1);
  });
}

function check_filters_onload(reload) {
  if (location.hash.indexOf('?')){
    var hash = window.location.hash.substring(1);
    var info = (location.hash.indexOf('info-container')>=0)?'info-container':'';
    var photo = (location.hash.indexOf('photo-container')>=0)?'photo-container':'';
    var hashArray = hash.split('&no-');
    location.hash = info + photo;
    for (var i=0; i < hashArray.length; i++) {

      if (hashArray[i] != '' && hashArray[i] != 'info-container' && hashArray[i] != 'photo-container') {
        $('#'+hashArray[i]+'-checkbox').prop('checked', false);
        filterItems(hashArray[i]);
      }
    }
  }
}

function filterItems(category, reload) {
  var items = $('.is-in-'+category);
  var hash = '&no-'+category;
  items.toggle();
  if (!$('#'+category+'-checkbox').is(':checked')){
    window.location.hash += hash;
  }
  else {
    var newhash = window.location.hash.replace(hash, '');
    window.location.hash = newhash;
  }
  if (reload) {
    location.reload();
  }
}

function updateProject() {

  var title = $('#input-title').val();
  var name = $('#input-name').val();
  var date = $('#input-date').val();
  var imgdescription = $('#input-imgdescription').val();
  var description = $('#input-description').val();
  var id = $('.active-link').attr('name');
  var category = $( '#category-selector option:selected' ).text();
  var visible = $('#project-visible').is(':checked');
  console.log(imgdescription);
  if (name == '') {
    showAlert('danger', 'Cannot save: Set a NAME!');
    $('#input-name').parent().addClass('has-error');
  }
  if (date == '') {
    showAlert('danger', 'Cannot save: Set a DATE!');
    $('#input-date').parent().addClass('has-error');
  }
  if (name != '' && date != ''){
    $.ajax({
      type: 'POST',
      url: '/admin/update_project',
      data: {
        'id': id,
        'title': title,
        'name': name,
        'date': date,
        'imgdescription': imgdescription,
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
    // $('#downloadLink').attr('disabled', true);
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
      showAlert('info', data.name + ' moved to trash.');
    });
  }
}

function deleteSelected(pid) {
  if (confirm('Really delete all selected images?')){
    var confirmed = true;
    $('.imgCheck:checked').each(function() {
      var iid = $(this).closest('.img-item').attr('id');
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
var upload_error = false;
var error_message;
Dropzone.options.photoUpload = {

  init: function() {
    this.on('error', function(file, res){
      upload_error = true;
      error_message = res;

    });
    this.on(
      "success", function(file, res) {
        showAlert('success', file.name + ' has been uploaded successfully!')
      });
    this.on(
      "queuecomplete", function(file, res) {
        if (upload_error == false){
          document.location.reload(true);
        }
        else {
          showAlert('danger', 'Something went wrong: ' + error_message);
        }
      });
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
