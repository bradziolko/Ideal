var express = require('express');
var router = express.Router();

router.get('/createmanager', function(req, res) {
  res.render('home/createmanager', { title: 'Ideal Manager Creation Page' }); 
});

router.get('/createcandidate', function(req, res) {
  res.render('home/createcandidate', { title: 'Ideal Candidate Creation Page' }); 
});

module.exports = router;

