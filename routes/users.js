var express = require('express');
var router = express.Router();
var User = require('../models/user');
var user = new User();

var Candidate = require('../models/candidate');
var candidate = new Candidate();

/* GET users listing. */

router.get('/ballot',function(req, res, next) {
    console.log("calling post function on ballot button")
	var elections = [];
	var end = 0;

	function assignCandidates(result, i) {
    	elections[i].candidates = result;
    	console.log(result);
    	end++;
    
    console.log(end);
   
    if (end == elections.length) {
      console.log("Elections:");
      console.log(elections);
      res.render('home/ballotvoting', { title: 'Ideal Election Results Page', elections: elections });
    }
  }

  user.getDetails(function (result) {
    elections = result;
    console.log("Results from election.getAll");
    console.log(result);

    for (var i = 0; i < result.length; i++) {
      candidate.getCandidatesFromElection(result[i].electionId, i, assignCandidates); 
    }
  });
});
		  
	//	  console.log(candidates)
	//	  res.render('home/ballotvoting', { title: 'Ballot Voting', candidates: result });

router.get('/home/ballotvoting', function(req, res) {
  res.render('home/ballotvoting', { title: 'Ideal Manager Home Page' });
});

router.post('/ballot', function(req, res) {
	console.log("Inside ballot post");
	console.log(req.body);
	Object.keys(req.body).forEach(function (key) {
		console.log("bfbej");
		candidate.updateCount(req.body[key]);
	});
  
  res.redirect('/home/user');
});

router.post('/users/ballot', function(req, res) {
	console.log("Inside  users ballot post");
	console.log(req.body);
	console.log("butts");
	
	var selected = req.body;
	
	for (var key in selected) {
		if (Object.prototype.hasOwnProperty.call(selected, key)) {
			var val = selected[key];
			console.log(val);
		}
	}
	console.log("fuck");
	for (var key in req.body) {
		console.log(key);
		console.log(req.body[key]);
	}
	
	Object.keys(req.body).forEach(function (key) {
		console.log("bfbej");
		console.log(req.boy[key]);
	});
});

module.exports = router;
