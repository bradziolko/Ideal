var express = require('express');
var router = express.Router();

var Candidate = require('../models/candidate');
var candidate = new Candidate();

var Election = require('../models/election');
var election = new Election();

var Zip = require('../models/zip');
var zipCode = new Zip();

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
});

router.post('/createelection', function(req, res) {
  var candidates = req.body.candidates;
  var zip = req.body.zip.split(",");
  console.log("Zip object");
  console.log(zip);
  console.log("In create election post.");
  console.log(req.body);
  election.create(req.body.electionName, req.body.startDate, req.body.endDate, function (result) {
    console.log("Result from election.create: " + result);
    if (result != -1 && candidates != undefined) {
      for (var i = 0; i < candidates.length; i++) {
        var cand = candidates[i];
        candidate.setElection(cand, result);
        election.initializeResult(cand);
      }
    }

    if (result != -1 && zip != undefined) {
      for (var i = 0; i < zip.length; i++) {
        var z = zip[i];
        zipCode.create(z, result);
      }
    }

    res.redirect("/home/admin");
  });
});

router.get('/viewResults', function(req, res) {
  var elections = [];
  var end = 0;

  function assignCandidates(result, i) {
    elections[i].candidates = result;
    end++;
    
    console.log(end);
   
    if (end == elections.length) {
      console.log("Elections:");
      console.log(elections);
      res.render('home/viewResults', { title: 'Ideal Election Results Page', elections: elections });
    }
  }

  election.getAll(function (result) {
    elections = result;
    console.log("Results from election.getAll");
    console.log(result);

    for (var i = 0; i < result.length; i++) {
      candidate.getCandidatesFromElection(result[i].electionId, i, assignCandidates); 
    }
  });
});


router.post('/createcandidate',function(req, res) {
   user.createCandidate(req.body, function(result) {
     console.log("Result from registerUser: " + result);
     res.redirect('/home/admin');
   });
});

module.exports = router;

