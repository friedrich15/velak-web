var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');
var fs = require('fs');
var JSZip = require("jszip");


router.get('/projects', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    res.render('admin/projects', {
      title: 'velak | projects',
      projects: projects
    });
  });
});

router.get('/docs', function(req, res, next) {
  res.render('admin/docs', {
    title: 'velak | documents'
  });
});

router.get('/project/:id', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    Project.findById(req.params.id, function(err, project){
      res.render('admin/project_view', {
        title: 'velak | projects',
        projects: projects,
        currentProject: project,
        photos: project.photo
      });
    });
  });
});

router.post('/save_project', function(req, res, next){
  new Project({
    name: req.body.name,
    title: req.body.name,
    description: '',
    photo: [],
    audio: [],
    visible: true,
    deleted: false
  }).save(function(err, project){
    if (err) {res.send(err)}
    else {
      res.send({
        id: project._id
      }
    )}
  });
});

router.post('/update_project', function(req, res, next) {
  Project.findById(req.body.id, function(err, project) {
    project.name        = req.body.name;
    project.title       = req.body.title;
    project.description = req.body.description;
    project.category    = req.body.category;
    project.visible     = req.body.visible;
    project.save(function(err, project){
      if (err) {res.send(err)}
      else {
        res.send({
          id: project._id,
          name: project.name
        });
      }
    });
  });
});

router.post('/delete_project', function(req, res, next) {
  Project.findById(req.body.id, function(err, project) {
    project.deleted = true;
    project.save(function(err, project){
      if(err){res.send(err)}
      else{res.send({project: project})}
    });
  });
});

function makeZipFile(foldername, photos) {
  var zip = new JSZip;

  var photoZip = zip.folder(foldername);
// this call will create photos/README
  photoZip.file(photos[0].originalName, 'public/uploads/'+photos[0].name);
  console.log(photos[0].name);
  // for (i=0; i<photos.length; i++){
  //   photoZip.file('public/uploads/'+photos[i].name);
  //   console.log(photos[i].name);
  // }

  var buffer = photoZip.generate({type:"nodebuffer"});
  var filename = new Date() + '.zip';
  fs.writeFile(filename, buffer, function(err) {
    if (err) throw err;
  });
}

router.get('/create_link/:id', function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {
    var photos = project.photo;
    var foldername = project.title;
    makeZipFile(foldername, photos);
  });
})

module.exports = router;
