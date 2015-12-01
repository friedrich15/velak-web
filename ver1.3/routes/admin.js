var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Project  = mongoose.model('Project');
var marked = require('marked');
var fs = require('fs');
var JSZip = require("jszip");
var moment = require('moment');
var Message = mongoose.model('Message');
var Post  = mongoose.model('Post');
var Doc  = mongoose.model('Doc');

marked.setOptions({
  sanitize: true
});
// *********************************** LOGIN, USER etc. *******************************
router.get('/users', function(req, res, next) {
  Account.find().exec(function(err, accounts) {
    res.render('admin/users', {
      title: 'velak',
      user: req.user,
      users: accounts
    });
  });
});

router.post('/update_user_color', function(req, res, next) {
  Account.findById(req.body.id, function(err, account){
    account.color = req.body.color;
    account.colorLight = req.body.colorlight;
    account.save(function(err){
      if (!err) {
        res.send(req.body.colorlight + ' saved!');
      }
    })
  });
})

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

router.get('/is_name_unique/:name', function(req, res) {
  Account.find({username : req.params.name}, function(err, user){
    if (user.length) {
      res.send(false);
    }
    else res.send(true);
  })
})

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('admin/register', { account : account, user: req.user });
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

// ***************************************** PROJECT INFORMATION *************************

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
  var cat = 'gala';
  if (req.body.name == 'homepage'){
    cat = 'homepage';
  }
  new Project({
    name: req.body.name,
    title: req.body.name,
    description: '',
    category: cat,
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
  var date = moment(req.body.date).valueOf();
  var dateHtml = moment(date).format('MMMM Do YYYY');
  if (req.body.name == 'homepage'){
    var category = 'homepage';
  }
  else { var category = req.body.category}
  console.log(dateHtml);
  Project.findById(req.body.id, function(err, project) {
    project.name              = req.body.name;
    project.title             = req.body.title;
    project.dateInput         = req.body.date;
    project.dateHtml          = dateHtml;
    project.date              = date;
    project.time              = req.body.time;
    project.description       = marked(req.body.description);
    project.descriptionSource = req.body.description;
    project.category          = category;
    project.visible           = req.body.visible;
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

// ***************************************** PROJECT PHOTOS ******************************

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
// ****************************************** DOCS

// *********************************** see admindocs.js


// ****************************************** TRASH **********************************

router.get('/trash', function(req, res, next) {
  var del_projects = [];
  var del_photos = [];
  var del_photo_ids = [];
  var del_docPosts = [];
  Post.find().exec(function(err, posts) {
    posts.forEach(function(post) {
      if (post.deleted == true) {
        del_docPosts.push(post);
      }
    })
  });

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
      photo_ids: del_photo_ids,
      posts: del_docPosts
    });
  });
});

router.get('/retrieve/:item/:id', function(req, res, next) {
  if (req.params.item == 'project') {
    Project.findById(req.params.id, function(err, project) {
      project.deleted = false;
      project.save(function(err){
        if (!err){
          res.redirect('/admin/trash');
        }
      });
    });
  }
  if (req.params.item == 'post') {
    Post.findById(req.params.id, function(err, post) {
      post.deleted = false;
      post.save(function(err){
        if (!err){
          res.redirect('/admin/trash');
        }
      });
    });
  }
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
    });
  });
});

function fileExists(filePath){
  try
  {
    return fs.statSync(filePath).isFile();
  }
  catch (err)
  {
    console.log(err);
    return false;
  }
}

function delete_photo(id, cb) {

  Project.findOne({'photo._id': ObjectId(id)}, function(err, project){
    if (fileExists(project.photo.id(id).filePath)){
      fs.unlinkSync(project.photo.id(id).filePath);
    }
    if (fileExists('public/uploads/small/small'+project.photo.id(id).name)){

      fs.unlinkSync('public/uploads/small/small'+project.photo.id(id).name);
    }
    project.photo.id(id).remove(function(err){
      console.log(err);
      cb('deleted');
    });


  });
}



router.get('/empty_del/:items', function(req, res, next) {
  if (req.params.items == 'projects') {
    Project.find({deleted: true}, function(err, projects) {
      for (var i in projects) {
        for (var j in projects[i].photo.toObject()) {
          if (fileExists(projects[i].photo[j].filePath)){
            fs.unlinkSync(projects[i].photo[j].filePath);
          }
          if (fileExists('public/uploads/small/small'+projects[i].photo[j].name)){
            fs.unlinkSync('public/uploads/small/small'+projects[i].photo[j].name);
          }
        }
        projects[i].remove();
      }
      res.redirect('/admin/trash')
    })
  };
  if (req.params.items == 'posts') {
    Post.find({deleted: true}, function(err, posts){
      for (var i in posts) {
        for (var j in posts[i].docs.toObject()) {
          if (fileExists(posts[i].docs[j].filePath)) {
            fs.unlinkSync(posts[i].docs[j].filePath);
          }
        }
        posts[i].remove();
      }
      res.redirect('/admin/trash')
      // if (!err) {
      //   res.redirect('/admin/trash');
      // }
    });
  };
});

router.get('/empty_del_photos/:id', function(req, res, next) {
  var id = req.params.id;
  delete_photo(id, function() {
    res.send(id);
  })

});


module.exports = router;
