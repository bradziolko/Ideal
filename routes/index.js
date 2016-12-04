var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var User = require('../models/user');
var user = new User();

var Config = require("../config");
var config = new Config();
var emailConfig = config.email();

var verificationNumber = 0;

var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: emailConfig.email,
		pass: emailConfig.password
	}
};
var transporter = nodemailer.createTransport(smtpConfig);
var mailOptions = {
	from: '"Ideal Electoral Registration"	<' + emailConfig.email + '>',
	to: '',
	subject: 'Confirm registration',
	text: ''
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ideal' });
});

// POST Login from home page
router.post('/', function(req, res) {
  console.log(req.body.login_type)
  if (req.body.login_type == 1) {
  user.validateUser(req.body.username, req.body.password, function (result) {
    console.log("Result from validateUser: " + result);
    if (result == 1) {
      res.redirect("/home/user");
    }
    else if (result == 0) {
      res.redirect("verify");
    }
    else {
      res.render("index", { error: "Login Failed" });
    }
  });
  }
  
  if (req.body.login_type == 2){
    console.log("Manager login")
    user.validateManager(req.body.username, req.body.password, function (result) {
      console.log("This is the result value")
      console.log(result)
      if (result == 1) {
        console.log("Inside required if")
        res.redirect("/home/manager");
    }
    else {
      res.render("index", { error: "Login Failed" });
    }
    });
  }
  
  
  if (req.body.login_type == 0){
    console.log("Admin login")
    user.validateAdmin(req.body.username, req.body.password, function (result) {
      console.log("This is the result value")
      console.log(result)
      if (result == 1) {
        console.log("Inside required if")
        res.redirect("/home/admin");
    }
    else {
      res.render("index", { error: "Login Failed" });
    }
    });
  }
  

  if (req.body.checkverification == verificationNumber) {
	  console.log("Email verification sucessful, verification #:" + req.body.checkverification);
  }
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Ideal: Register' });
});

router.get('/admin', function(req, res) {
  res.render('admin', { title: 'Ideal: Admin Login' });
});

router.post('/managerinitial', function(req, res) {
   if (req.body.email) {
    console.log ("------------------------In the initial manager creation -------------------------------")
    console.log("Email = " + req.body.email);
    mailOptions.to = req.body.email;
    var verificationNumber = Math.floor(Math.random() * 8999999 + 1000000);
    mailOptions.text = "Your verification number is: " + verificationNumber;
    transporter.sendMail(mailOptions, function(error, info) {
	  if (error){
  		return console.log(error);
	  }
	  console.log('Message sent: ' + info.response);
	  res.redirect('/home/admin')
    });
  } 
//  user.registerManager(req.body, verificationNUmber, function (result)) {
//    console.log("Result from registerManager: " + result);
//  });
});

router.post('/createcandidate',function(req, res) {
   user.createCandidate(req.body, function(result) {
     console.log("Result from registerUser: " + result);
   });
});

router.post('/register', function(req, res) {
  if (req.body.email) {
    console.log("Email = " + req.body.email);
    mailOptions.to = req.body.email;
    var verificationNumber = Math.floor(Math.random() * 8999999 + 1000000);
    mailOptions.text = "Your verification number is: " + verificationNumber;
    transporter.sendMail(mailOptions, function(error, info) {
	  if (error){
  		return console.log(error);
	  }
	  console.log('Message sent: ' + info.response);
    });
  }
  
  user.registerUser(req.body, verificationNumber, function (result) {
    console.log("Result from registerUser: " + result);
  });
  res.redirect('verify');
});

router.get('/verify', function(req, res) {
	res.render('verify', { title: 'Ideal' });
});

router.post('/verify', function(req, res) {
  user.verifyEmail(req.body.email, req.body.verification, function (result) {
    console.log("Result from verifyEmail: " + result);
    if (result) {
      user.setVerified(req.body.email, function (result) {
        if (result) {
          res.redirect('/');
        }
        else {
          res.render('verify', { title: 'Ideal', error: 'Verification Set Failed!' });
        }
      });
    }
    else {
      res.render('verify', { title: 'Ideal', error: 'Verification Failed!' });
    }
  });
});

router.get('/home/user', function(req, res) {
  res.render('home/user', { title: 'Ideal Home Page' });
});

router.get('/home/admin', function(req, res) {
  res.render('home/admin', { title: 'Ideal Admin Home Page' });
});

router.get('/home/manager', function(req, res) {
  res.render('home/manager', { title: 'Ideal Manager Home Page' });
});

router.get('/managerinitial', function(req, res) {
  res.render('managerinitial', { title: 'Ideal Manager Creation Page' }); 
});

router.get('/createcandidate', function(req, res) {
  res.render('createcandidate', { title: 'Ideal Candidate Creation Page' }); 
});



module.exports = router;
