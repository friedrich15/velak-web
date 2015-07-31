var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post  = mongoose.model('Post');
var Doc  = mongoose.model('Doc');
var multer = require('multer');


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

router.post('/doc_upload', function(req, res, next) {
  console.log(req.body);
})

module.exports = router;
