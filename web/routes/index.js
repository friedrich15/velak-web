var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res, next) {
  Project.find().sort("position").exec(function(err, projects){
    res.render('index', {
      title: 'velak',
      projects: projects
    });
  ;})
});

router.get('/site/:i', function(req, res, next) {
  var content = "";
  var title = "velak"
  var i = req.params.i;
  if (i!=null){
    Project.find().sort("position").exec(function(err, projects){
      res.render('index', {
        title: "velak | " + i,
        projects: projects,
        cat: i
      });
    });
  }
  console.log(title, content);

})

router.post('/site/:i', function(req, res, next) {
  var i = req.params.i
  Project.find().sort("position").exec(function(err, projects){
    var data = {
      "title": "velak | " + i,
      "projects": projects,
      "cat": i
    }
    console.log(data);
    res.send(data);
  });

})


module.exports = router;
