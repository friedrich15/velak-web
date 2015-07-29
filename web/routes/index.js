var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');


/* GET home page. */
router.get('/', function(req, res, next) {
  Project.find().sort('position').exec(function(err, projects){
    res.render('index', {
      title: 'velak',
      projects: projects
    });
  ;})
});

router.get('/site/:i', function(req, res, next) {
  var content = '';
  var title = 'velak'
  var i = req.params.i;
  if (i=='gala' || i=='export' || i=='other'){
    Project.find().sort('position').exec(function(err, projects){
      res.render('index', {
        title: 'velak | ' + i,
        projects: projects,
        cat: i
      });
    });
  }
  else {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  }
  console.log(title, content);

});

router.get('/site/:cat/:id', function(req, res, next) {
  Project.find().sort('position').exec(function(err, projects){
    for (p = 0; p < projects.length; p++) {
      
      if (projects[p]._id == req.params.id){
        var currentProject = projects[p];
        res.render('index', {
          title: 'velak | ' + req.params.cat,
          projects: projects,
          currentProject: currentProject,
          cat: req.params.cat
        });
      }
    }
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);

  });
});

router.post('/site/:i', function(req, res, next) {
  var i = req.params.i
  Project.find().sort('position').exec(function(err, projects){
    var data = {
      'title': 'velak | ' + i,
      'projects': projects,
      'cat': i
    }
    if (err) {res.send(err)}
    res.send(data);
  });

})

router.post('/load_project', function(req, res, next) {
  Project.findById(req.body.id, function(err, project){
    if (err) {res.send(err)}
    res.send(project);
  })
})

module.exports = router;
