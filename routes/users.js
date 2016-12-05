var express = require('express');
var router = express.Router();
var User = require('../models/user');
var user = new User();

var Candidate = require('../models/candidate');
var candidate = new Candidate();

/* GET users listing. */

router.get('/ballot',function(req, res, next) {
    console.log("calling post function on ballot button")
    var candidates = [];
    user.getDetails(function (resultcheck){
		 //   console.log(resultcheck.length)
		//	election.append (resultcheck)
		    
		    for (var i =0; i< resultcheck.length; i++){
		      candidate.getCandidateDetails(resultcheck[i].electionId,function(resultcandidate){
		        console.log(typeof(resultcandidate));
		        candidates.push(resultcandidate);
		      });
		    }
		  });
		  console.log("WORK FUCKING WORK");
		  console.log(candidates)
	//	  console.log(candidates)
	//	  res.render('home/ballotvoting', { title: 'Ballot Voting', candidates: result });
});

module.exports = router;
