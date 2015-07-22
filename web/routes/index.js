var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'velak' });
});

router.get('/site/:i', function(req, res, next) {
  var content = "";
  var title = "velak"
  var i = req.params.i;
  if (i!=null){
    content = "this is the content of "+ req.params.i;
    title = "velak | " + i
  }
  console.log(title, content);
  res.render('index', {
    title: title,
    content: content,
    i: i
  });
})

router.post('/site/:i', function(req, res, next) {
  var i = req.params.i
  var data = {
    "title": "velak | " + i,
    "content": "this is the content of " + i
  }
  res.send(data);
})


module.exports = router;
