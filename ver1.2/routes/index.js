var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res, next) {
  Project.find().sort('position').exec(function(err, projects){
    res.render('index', {
      title: 'velak',
      projects: projects
    });
  ;});
});
router.get('/gala/:id*?', function(req, res, next) {
  console.log('gala');
  Project.find({category: 'gala'}).sort('position').exec(function(err, projects){
    res.render('site', {
      title: 'velak',
      site: 'gala',
      pId: req.params.id,
      projects: projects
    });
  ;});
});

router.get('/export', function(req, res, next) {
  console.log('export');
  Project.find({category: 'export'}).sort('position').exec(function(err, projects){
    res.render('site', {
      title: 'velak',
      site: 'export',
      projects: projects
    });
  ;});
});

router.get('/other', function(req, res, next) {
  console.log('other');
  Project.find({category: 'other'}).sort('position').exec(function(err, projects){
    res.render('other', {
      title: 'velak',
      projects: projects
    });
  ;});
});


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
