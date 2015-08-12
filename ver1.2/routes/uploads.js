var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');
var Photo  = mongoose.model('Photo');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var fs = require('fs');
var gm = require('gm');

function resizeImage(file, img, width) {
  width = width/2;
  gm(img)
  .resize(width)
  .write('public/uploads/small/small'+file.filename, function(err){
    if (err) console.log(err);
  });
}

router.post('/photo_upload/:id', upload.single('file'), function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {
    var file = req.file;
    var actualFile = 'public/uploads/'+file.filename;
    gm('public/uploads/'+file.filename)
    .size(function (err, size) {
      if (!err) {
        resizeImage(file, actualFile, size.width);
      }


    });


    project.photo.push( new Photo({
      name          : file.filename,
      originalName  : file.originalname,
      fileSize      : file.size,
      filePath      : file.path,
      filePublic    : true,
      deleted       : false
    }));
    project.save();
  });
  res.redirect('/admin/projects');
});

module.exports = router;
