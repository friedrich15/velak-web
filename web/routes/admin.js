var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');
var Photo  = mongoose.model('Photo');
var Audio = mongoose.model('Audio');
var multer = require('multer');

var upload = multer({dest:'uploads/'});

// var multer = require('multer');
//
// var upload = multer({dest:'./uploads/'});
//
// var cpUpload = upload.single('file');
//
// router.post('/upload_photo', cpUpload, function(req,res){
//
//   console.log(req.file);
//
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    res.render('admin/index', {
      title: 'velak | admin',
      projects: projects
    });
  });

  console.log('admin ist da');
});

router.post('/load_project', function(req, res, next) {
  Project.findById(req.body.id, function(err, project) {
    res.send(project);
  });
});

router.post('/update_project', function(req, res, next) {
  console.log(req.body.id)
  Project.findById(req.body.id, function(err, project){
    project.title = req.body.title;
    project.name = req.body.name;
    project.description = req.body.description;
    project.category = req.body.category;
    project.visible = req.body.visible;
    project.save(function(err, project){
      console.log('hallo ' + project);
      if(err){res.send(err)}
      else{res.send(project)}
    });
  });
});

router.post('/delete_project', function(req, res, next) {
  Project.findById(req.body.id, function(err, project) {
    project.deleted = true;
    project.save(function(err, project){
      if(err){res.send(err)}
      else{res.send(project)}
    });
  });
});

// save project INITIALLY
router.post('/save_project', function(req, res, next){
  new Project({
    title: req.body.name,
    name: req.body.name,
    description: '',
    photo: [],
    audio: [],
    visible: false,
    deleted: false
  }).save(function(err, project){
    if (err) {res.send(err)}
    else {
      console.log(project._id);
      res.send({
        id: project._id
      }
    )}
  })
})

router.post('/photo_upload', upload.single('file'), function (req, res, next) {
  console.log(req.file);
});


module.exports = router;
