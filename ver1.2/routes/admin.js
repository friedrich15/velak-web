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
var Message = mongoose.model('Message')

marked.setOptions({
  sanitize: true
});

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
  var date = moment(req.body.date).valueOf();
  var dateHtml = moment(date).format('MMMM Do YYYY');
  if (req.body.name == 'homepage'){
    var category = 'home';
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
                                          // DOCS

router.get('/docs', function(req, res, next) {
  Message.find().sort('timestamp').exec(function(err, messages){
    res.render('admin/docs', {
      title: 'velak',
      messages: messages,
      user: req.user
    });
  });

});

router.post('/save_chat_msg', function(req, res, next) {
  var timestamp = moment().valueOf();
  var timeHtml = moment().format('MMMM Do YYYY, h:mm:ss a');

  Account.findById(req.body.id, function(err, account) {
    console.log(req.body.msg);
    new Message({
      text : req.body.msg,
      timestamp : timestamp,
      timeHtml : timeHtml,
      byUser : account.username,
      byUserId : account._id,
      byUserColor : account.color,
      byUserColorLight : account.colorLight
    }).save(function(err) {
      console.log(err);
      if (!err) {
        Message.find().sort('timestamp').exec(function(err, messages){
          console.log(messages);
          res.render('admin/messages', {messages: messages, user: req.user})
        });
      }
    });
  });
});

router.get('/delete_msg/:id', function(req, res, next) {
  Message.findById(req.params.id, function(err, message) {
    message.remove(function(){
      res.send('success');
    })
  })
})

                                          // TRASH

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
