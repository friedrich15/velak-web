var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Project  = mongoose.model('Project');
var Photo  = mongoose.model('Photo');
var multer = require('multer');
var upload = multer({dest: 'public/uploads/'});
var fs = require('fs');
var mkdirp = require('mkdirp')
var sizeOf = require('image-size');
var im = require('imagemagick');




router.post('/photo_upload/:id', upload.single('file'), function(req, res, next) {
  Project.findById(req.params.id, function(err, project) {

    var file = req.file;
    var actualFile = 'public/uploads/'+file.filename;
    var dimensions = sizeOf(actualFile);
    var width;
    var height;
    if (dimensions.width >= dimensions.height){
      if (dimensions.width <= 800) {width = dimensions.width; height = dimensions.height} else
      if (dimensions.width > 800) {width = 800; height = Math.round(dimensions.height / (dimensions.width/width))}

    } else
    if (dimensions.height > dimensions.width){
      if (dimensions.height <= 800) {height = dimensions.height; width = dimensions.width} else
      if (dimensions.height > 800) {height = 800; width = Math.round(dimensions.width / (dimensions.height/height))}
    }
    console.log(height, width);

    im.resize({
      srcPath: actualFile,
      dstPath: 'public/uploads/small/small' + file.filename,
      width: width,
      height: height
    }, function(err, stdout, stderr){
      if (err) throw err;
      console.log('resized kittens.jpg to fit within 256x256px');
    });


    project.photo.push( new Photo({
      name          : file.filename,
      originalName  : file.originalname,
      fileSize      : file.size,
      filePath      : file.path,
      relativeWidth     : width,
      relativeHeight    : height,
      inProject     : req.params.id,
      filePublic    : true,
      deleted       : false
    }));
    project.save(function(err){
      if (err)res.send(err);
      if (!err)res.send(Photo);
    });

  });
  res.redirect('/admin/projects');
});



module.exports = router;
