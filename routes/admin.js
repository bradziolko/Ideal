var express = require('express');
var router = express.Router();

var Candidate = require('../models/candidate');
var candidate = new Candidate();

router.get('/createmanager', function(req, res) {
  res.render('home/createmanager', { title: 'Ideal Manager Creation Page' }); 
});

router.get('/createcandidate', function(req, res) {
  res.render('home/createcandidate', { title: 'Ideal Candidate Creation Page' }); 
});

router.get('/createelection', function(req, res) {
  candidate.getAll(function (result) {
    console.log("Result from candidate.getAll: ");
    console.log(result);
    if (result.length > 0) { console.log(result[0]); }

    res.render('home/createelection', { title: 'Ideal Election Creation Page', candidates: result }); 
  });

  //res.render('home/createelection', { title: 'Ideal Election Creation Page' }); 
});

module.exports = router;

