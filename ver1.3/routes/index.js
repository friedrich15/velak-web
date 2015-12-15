var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var Account = require('../models/account');
var Project  = mongoose.model('Project');
var Track  = mongoose.model('Track');
var fs = require('fs');
var JSZip = require("jszip");
var moment = require('moment');


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
  Project.find({category: 'home'}, function(err, projects){
    Project.findOne({name: 'homepage'}, function(err, homepage){
      res.render('index', {
        title: 'velak',
        homepage: homepage,
        projects: projects
      });
    })

  });
});

router.post('/futureprojects', function(req, res, next) {
  var now = moment().valueOf();
  console.log(now);
  Project.find({'date': {$gt: now}}).sort('date').exec(function(err, projects){
    console.log(projects);
    res.render('future-projects', {
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

router.get('/audio', function(req, res, next){
  Project.find({$and: [{category: 'home'}, {visible: true}, {deleted: false}]}, function(err, links){
    res.render('audio', {
      title: 'velak',
      links: links
    });
  })
})

router.get('/audio/player', function(req, res, next) {
  console.log('audioplayer');
  Track.find({deleted: false}).sort('position').exec(function(err, tracks) {
    console.log(tracks);
    res.render('player', {
      title: 'velak player',
      tracks: tracks
    })
  })
})

router.get('/site/:cat', function(req, res, next) {
  var cat = req.params.cat;
  var home = [];
  if (cat == 'program') {
    Project.find({$and: [{visible: true}, {deleted: false}], $or: [{category: 'gala'}, {category: 'export'}, {category:'other'}]}).sort('-date').exec(function(err, projects){
      if (projects.length<1) res.send(cat + ' does not exist.');
      else {
        Project.find({$and: [{category: 'home'}, {visible: true}, {deleted: false}]}, function(err, links){
          res.render('program', {
            title: 'velak',
            site: cat,
            projects: projects,
            links: links
          });
        })

      }
    });
  }
  else {
    Project.find({$and: [{category: 'home'}, {visible: true}, {deleted: false}]}, function(err, links){
      for (var i in links) {
        if (links[i].name == cat) {
          var currentProject = links[i];
        }
      }
      res.render('site', {
        title: 'velak',
        currentProject: currentProject,
        links: links,
        site: cat
      });
    })
  }
});

router.get('/site/:cat/:id', function(req, res, next) {
  var cat = req.params.cat;
  var id = req.params.id;
  if (cat == 'program') {
    Project.find({$and: [{visible: true}, {deleted: false}], $or: [{category: 'gala'}, {category: 'export'}, {category:'other'}]}).sort('-date').exec(function(err, projects){
      if (projects.length<1) res.send(cat + ' does not exist.');
      else {
        for (var i in projects) {
          if (projects[i]._id == id) {
            var currentProject = projects[i];
          };
        };
        Project.find({$and: [{category: 'home'}, {visible: true}, {deleted: false}]}, function(err, links){
          console.log(currentProject.name);
          res.render('project', {
            title: 'velak',
            site: cat,
            links: links,
            currentProject: currentProject,
            projects: projects
          });
        });
      }

    });
  }

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
