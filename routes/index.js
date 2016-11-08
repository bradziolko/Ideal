var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var User = require('../models/user');
var user = new User();

var smtpConfig = {
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'idealelectoral@gmail.com',
		pass: 'verify12'
	}
};
var transporter = nodemailer.createTransport(smtpConfig);
var mailOptions = {
	from: '"Ideal Electoral Registration" <idealelectoral@gmail>',
	to: 'idealelectoral@gmail.com',
	subject: 'Confirm registration',
	text: 'test'
};
transporter.sendMail(mailOptions, function(error, info) {
	if (error){
		return console.log(error)
	}
	console.log('Message sent: ' + info.response);
});

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
  
  res.render('index', { title: 'Ideal' });
});

module.exports = router;
