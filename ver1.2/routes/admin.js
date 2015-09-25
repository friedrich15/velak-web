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

// function makeZipFile(foldername, photos) {
//   var zip = new JSZip;
//
//   var photoZip = zip.folder(foldername);
// // this call will create photos/README
//   photoZip.file(photos[0].originalName, 'public/uploads/'+photos[0].name);
//   console.log(photos[0].name);
//   // for (i=0; i<photos.length; i++){
//   //   photoZip.file('public/uploads/'+photos[i].name);
//   //   console.log(photos[i].name);
//   // }
//
//   var buffer = photoZip.generate({type:"nodebuffer"});
//   var filename = new Date() + '.zip';
//   fs.writeFile(filename, buffer, function(err) {
//     if (err) throw err;
//   });
// }

router.get('/create_link/:id', function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {
    var rndm = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 8);
    var link = '/photolink/'+ req.params.id + '/' + rndm;
    project.photoLink = link;
    project.save(function(err){
      res.send({link: link});
    })
  });
});


router.get('/delete_img/:pid/:iid', function(req, res, next) {
  Project.findById(req.params.pid, function(err, project) {
    var photos = project.photo;
    var iname;
    for (i=0; i<photos.length; i++) {
      if (photos[i].name == req.params.iid) {
        console.log(photos[i].name)
        iname = photos[i].originalName;
        photos[i].deleted = true;
      }
    }
    project.save(function(){
      res.send({id: req.params.iid, name: iname});
    });
  });
});

router.get('/public_state/:pid/:iid/:state', function(req, res, next) {
  Project.findById(req.params.pid, function(err, project) {
    var photos = project.photo;
    var iname;
    for (i=0; i<photos.length; i++) {
      if (photos[i].name == req.params.iid) {
        console.log(photos[i]);
        photos[i].filePublic = req.params.state;
        console.log(photos[i]);
      }
    }
    project.save(function(){
      res.send('public = ' + req.params.state);
    });
  });
});

router.post('/save_photo_description', function(req, res, next){
  Project.findById(req.body.id, function(err, project) {
    var photo;
    for (var i in project.photo){
      if (project.photo[i].name == req.body.photo){
        photo = project.photo[i];
      }
    }
    console.log(photo);
    photo.description = req.body.text;
    project.save(function(err){
      if (err) console.log(err);
      res.send('success');
    });
  });
});

router.post('/projectsort', function ( req, res, next) {
  Project.find().exec(function (err, projects){
    projects.forEach(function(project){

      project.position = req.body['position' + project.id];
      project.save();
      console.log(project.position);
    });
    res.send("success");
  });
});

router.post('/photosort', function (req, res, next) {
  Project.findById(req.body.id, function(err, project) {
    for (var i in project.photo) {
      if (project.photo[i].deleted == false){
        project.photo[i].position = req.body['position' + project.photo[i].name];
        console.log(project.photo[i]);
      }

    }
    project.save();
  })
})

module.exports = router;
