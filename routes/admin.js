var express = require('express');
var router = express.Router();

router.get('/managerinitial', function(req, res) {
  res.render('managerinitial', { title: 'Ideal Manager Creation Page' }); 
});

router.get('/createcandidate', function(req, res) {
  res.render('createcandidate', { title: 'Ideal Candidate Creation Page' }); 
});

module.exports = router;

