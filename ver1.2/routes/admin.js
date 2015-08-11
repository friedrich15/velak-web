var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/projects', function(req, res, next) {
  res.render('admin/projects', {
    title: 'velak | projects'
  });
});

router.get('/docs', function(req, res, next) {
  res.render('admin/docs', {
    title: 'velak | documents'
  });
});



module.exports = router;
