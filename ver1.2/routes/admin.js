var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Project  = mongoose.model('Project');
var fs = require('fs');
var JSZip = require("jszip");

router.get('/users', function(req, res, next) {
  Account.find().exec(function(err, accounts) {
    res.render('admin/users', {
      title: 'velak',
      user: req.user,
      users: accounts
    });
  });
});

router.get('/delete_user/:id', function(req, res, next) {
  Account.remove({_id: req.params.id}, function(err, account) {

    if (!err) res.redirect('/admin/users');

  });
});

router.get('/register', function(req, res) {
  res.render('admin/register', {
    title: 'velak',
    user: req.user
  });
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('admin/register', { account : account });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/admin/projects');
    });
  });
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/projects', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    res.render('admin/projects', {
      title: 'velak',
      user: req.user,
      projects: projects
    });
  });
});

router.get('/docs', function(req, res, next) {
  res.render('admin/docs', {
    title: 'velak',
    user: req.user
  });
});

router.get('/project/:id', function(req, res, next) {
  Project.find().sort('position').exec( function ( err, projects, count ){
    Project.findById(req.params.id, function(err, project){
      res.render('admin/project_view', {
        title: 'velak',
        user: req.user,
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
    category: 'gala',
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
  console.log(req.body.date);
  Project.findById(req.body.id, function(err, project) {
    project.name        = req.body.name;
    project.title       = req.body.title;
    project.date        = req.body.date;
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
    project.save(function(err){
      res.send('success');
    });
  })

})

router.get('/trash', function(req, res, next) {
  var del_projects = [];
  var del_photos = [];
  var del_photo_ids = [];

  Project.find().exec(function(err, projects){
    projects.forEach(function(project) {
      if (project.deleted==true) {
        del_projects.push(project);
      }
      else {
        for (var i in project.photo) {
          if (project.photo[i].deleted==true) {
            del_photos.push(project.photo[i]);
            del_photo_ids.push(project.photo[i].id);
          }
        }
      }
    });
    res.render('admin/trash', {
      title: 'velak',
      user: req.user,
      projects: del_projects,
      photos: del_photos,
      photo_ids: del_photo_ids
    });
  });
});

router.get('/retrieve_project/:id', function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {
    project.deleted = false;
    project.save(function(err){
      if (!err){
        res.redirect('/admin/trash');
      }
    });
  });
});

router.get('/retrieve_photo/:project_id/:photo_id', function(req, res, next) {
  Project.findById(req.params.project_id, function(err, project){
    console.log(project.photo.id(req.params.photo_id));
    var photo = project.photo.id(req.params.photo_id);
    photo.deleted = false;
    project.save(function(err){
      if (!err){
        res.redirect('/admin/trash');
      }
    })
  })
})

router.get('/empty_del_projects', function(req, res, next) {
  Project.remove({deleted: true}, function(err, projects){
    if (!err) {
      res.redirect('/admin/trash');
    }
  });
});

router.get('/empty_del_photos/:id', function(req, res, next) {
  var id = req.params.id;

  Project.findOne({'photo._id': ObjectId(id)}, function(err, project){

    project.photo.id(id).remove();
    project.save(function(err){
      if (err) res.send('err');
      if (!err) {
        res.send(id);
        // console.log(id);
      }
    })
  })
});


module.exports = router;
