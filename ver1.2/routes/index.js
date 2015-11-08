var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var Project  = mongoose.model('Project');
var fs = require('fs');
var JSZip = require("jszip");


router.get('/login', function(req, res) {
  res.render('login', {
    title: 'velak',
    user : req.user
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/admin/projects');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  Project.find().sort('position').exec(function(err, projects){
    res.render('index', {
      title: 'velak',
      projects: projects
    });
  });
});

router.get('/loadmore/:id', function(req, res, next){
  Project.findById(req.params.id, function(err, project){
    console.log(project);
    res.render('project-content', {
      project: project
    });
  })
})

router.get('/site/:cat', function(req, res, next) {
  var cat = req.params.cat;
  Project.find({$and: [{category: cat}, {visible: true}, {deleted: false}]}).sort('position').exec(function(err, projects){
    if (projects.length<1) res.send(cat + ' does not exist.');
    else {
      res.render('site', {
        title: 'velak',
        site: cat,
        projects: projects
      });
    }
  });
});

router.get('/site/:cat/:id', function(req, res, next) {
  var cat = req.params.cat;
  var id = req.params.id;
  Project.find({$and: [{category: cat}, {visible: true}, {deleted: false}]}).sort('position').exec(function(err, projects){
    if (projects.length<1) res.send(cat + ' does not exist.');
    else {
      for (var i in projects) {
        if (projects[i]._id == id) {
          var currentProject = projects[i];
        };
      };
      console.log(currentProject.name);
      res.render('project', {
        title: 'velak',
        site: cat,

        currentProject: currentProject,
        projects: projects
      });
    }
  });
});


// router.get('/gala', function(req, res, next) {
//   Project.find({category: 'gala'}).sort('position').exec(function(err, projects){
//     res.render('project', {
//       title: 'velak',
//       site: 'gala',
//       projects: projects
//     });
//   });
// });
// router.get('/gala/:id', function(req, res, next) {
//   console.log(req.params.id);
//   Project.find({category: 'gala'}).sort('position').exec(function(err, projects){
//     res.render('site', {
//       title: 'velak',
//       site: 'gala',
//       pId: req.params.id,
//       projects: projects
//     });
//   });
// });
//
// router.get('/export', function(req, res, next) {
//   console.log('export');
//   Project.find({category: 'export'}).sort('position').exec(function(err, projects){
//     res.render('site', {
//       title: 'velak',
//       site: 'export',
//       projects: projects
//     });
//   });
// });
//
// router.get('/other', function(req, res, next) {
//   console.log('other');
//   Project.find({category: 'other'}).sort('position').exec(function(err, projects){
//     res.render('other', {
//       title: 'velak',
//       projects: projects
//     });
//   });
// });


// PHOTOLINK
router.get('/photolink/:id/:rndm', function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {

    res.render('photoview', {
      title: project.name + ' | Photos',
      project: project,
      photos: project.photo
    });
  });
});

module.exports = router;
