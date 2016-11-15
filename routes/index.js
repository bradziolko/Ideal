var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var User = require('../models/user');
var user = new User();

var Email = require('../email');
var Email = new Email();

var verificationNumber = 0;

var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: Email.getUsername(),
		pass: Email.getPassword()
	}
};
var transporter = nodemailer.createTransport(smtpConfig);
var mailOptions = {
	from: '"Ideal Electoral Registration"	<' + Email.getUsername() + '>',
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
  user.validateUser(req.body.username, req.body.password, function (result) {
    console.log("Result from validateUser: " + result);
    if (result == true) {
      res.redirect("/home/user");
    }
    else {
      res.render("index", { loginError: "Login Failed" });
    }
  });

  if (req.body.checkverification == verificationNumber) {
	  console.log("Email verification sucessful, verification #:" + req.body.checkverification);
  }
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Ideal: Register' });
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
  res.redirect('verify');
});

router.get('/verify', function(req, res) {
	res.render('verify', { title: 'Ideal' });
});

router.post('/verify', function(req, res) {
	res.redirect('/');
});

router.get('/home/user', function(req, res) {
  res.render('home/user', { title: 'Ideal Home Page' });
});

module.exports = router;
