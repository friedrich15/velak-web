var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post  = mongoose.model('Post');
var Doc  = mongoose.model('Doc');
var multer = require('multer');

var uploaddocs = multer({dest:'uploads/docs/'});

router.get('/', function(req, res, next) {
  Post.find().sort('position').exec( function ( err, posts, count ){
    res.render('admin/docs', {
      title: 'velak | docs',
      posts: posts
    });
  });
});

router.post('/add_post', function(req, res, next) {
  var name = req.body.name;
  console.log(name);
  if (name !== undefined){
    new Post({
      name: name
    }).save(function(){
      res.redirect('/admin/docs');
    });
  };

});

router.post('/doc_upload/:id', uploaddocs.array('files'), function(req, res, next) {
  Post.findById(req.params.id, function(err, post){
    var files = req.files;
    console.log(files);
    // if (!post.docs){post.docs = [];}
    for (i=0; i<files.length; i++) {
      var file = files[i];
      console.log(file);
      post.docs.push(new Doc({
        name : file.filename,
        originalName : file.originalname,
        fileType : file.mimetype,
        fileSize : file.filesize
      }));


    };
    post.save(function(){
      res.render('admin/docs', {
        title: 'velak | docs',
        post: post
      })
    });
  });
});

module.exports = router;
