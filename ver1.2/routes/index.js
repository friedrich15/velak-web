var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/photolink/:id/:rndm', function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {

    res.render('photoview', {
      title: project.name + ' | Photos',
      photos: project.photo
    });
  });
});

module.exports = router;
