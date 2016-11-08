var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var User = require('../models/user');
var user = new User();

var Email = require('../email');
var Email = new Email();

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

router.post('/', function(req, res) {
  var result = user.getUser(req.body.username, req.body.password);
  console.log(result);
  res.render('home/user', { title: "Ideal: User Home" });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Ideal: Register' });
});

router.post('/register', function(req, res) {
  console.log("Email = " + req.body.email);
  if (req.body.email) {
    mailOptions.to = req.body.email;
  }
  var verificationNumber = Math.floor(Math.random() * 8999999 + 1000000)
  mailOptions.text = "Your verification number is: " + verificationNumber;
  transporter.sendMail(mailOptions, function(error, info) {
	if (error){
		return console.log(error)
	}
	console.log('Message sent: ' + info.response);
  });
  res.render('index', { title: 'Ideal', verification: verificationNumber});
});

module.exports = router;
