var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');


router.get('/projects', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    console.log(projects);
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
        currentProject: project
      });
    });
  });
});

router.post('/save_project', function(req, res, next){
  console.log(req.body.name);
  new Project({
    name: req.body.name,
    title: req.body.name,
    description: '',
    photo: [],
    audio: [],
    visible: true,
    deleted: false
  }).save(function(err, project){
    console.log(err);
    if (err) {res.send(err)}
    else {
      console.log(project._id);
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
        console.log(project._id);
        res.send({
          id: project._id,
          name: project.name
        });
      }
    });
  });
});

module.exports = router;
