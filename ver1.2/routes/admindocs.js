var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Account = require('../models/account');
var Post  = mongoose.model('Post');
var Doc  = mongoose.model('Doc');
var multer = require('multer');
var moment = require('moment');
var Message = mongoose.model('Message');

var uploaddocs = multer({dest:'public/admin/uploads/docs/'});

// router.get('/', function(req, res, next) {
//   Post.find().sort('position').exec( function ( err, posts, count ){
//     res.render('admin/docs', {
//       title: 'velak | docs',
//       posts: posts
//     });
//   });
// });

router.get('/', function(req, res, next) {
  Post.find().sort('-timestamp').exec(function(err, posts){
    res.render('admin/docs', {
      title: 'velak',
      posts: posts,
      // messages: messages,
      user: req.user
    });
  });

});

function load_messages(callback) {
  var result;
  Message.find().sort('timestamp').exec(function(err, messages){
    result = messages;
    callback(result);
  });
}
                                          //  CHAT
router.get('/get_chat_msgs', function(req, res, next) {
  var messages;
  load_messages(function(result){
    messages = result
    res.render('admin/messages', {
      messages: messages,
      user: req.user
    })
  })

})

router.post('/save_chat_msg', function(req, res, next) {
  var timestamp = moment().valueOf();
  var timeHtml = moment().format('MMMM Do YYYY, h:mm:ss a');

  Account.findById(req.body.id, function(err, account) {

    new Message({
      text : req.body.msg,
      timestamp : timestamp,
      timeHtml : timeHtml,
      byUser : account.username,
      byUserId : account._id,
      byUserColor : account.color,
      byUserColorLight : account.colorLight
    }).save(function(err) {

      if (!err) {
        var messages;
        load_messages(function(result){

          messages = result
          res.render('admin/messages', {
            messages: messages,
            user: req.user
          })
        })
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

                                        //  POSTS

router.post('/add_post', function(req, res, next) {
  var name = req.body.name;
  var timestamp = moment().valueOf();
  var timeHtml = moment().format('MMMM Do YYYY, h:mm:ss a');
  if (name !== undefined){
    new Post({
      name: name,
      timestamp : timestamp,
      timeHtml : timeHtml,
    }).save(function(){
      res.redirect('/admin/docs');
    });
  };

});

router.post('/doc_upload/:id', uploaddocs.array('files'), function(req, res, next) {
  Post.find().sort('position').exec( function ( err, posts, count ){
    Post.findById(req.params.id, function(err, post){
      var files = req.files;

      console.log(files);
      // if (!post.docs){post.docs = [];}
      for (i=0; i<files.length; i++) {
        var file = files[i];
        var extension = file.originalname.split('.').pop();
        console.log(extension);
        post.docs.push(new Doc({
          name : file.filename,
          originalName :  file.originalname,
          fileType :      file.mimetype,
          fileExtension:  extension,
          fileSize :      file.filesize,
          filePath :      file.path
        }));
      };
      post.save(function(){
        res.redirect('/admin/docs');
      });
    });
  });
});

router.get('/delete_post/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    post.deleted=true
    post.save(function(){
      res.redirect('/admin/docs');
    })
  })
})

module.exports = router;
