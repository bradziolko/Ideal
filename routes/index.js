var express = require('express');
var router = express.Router();

var User = require('../models/user');
var user = new User();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ideal' });
});

router.post('/', function(req, res) {
  console.log(req.body);
  var result = user.getUser(req.body.username, req.body.password);
  console.log("Result from getUser: " + result);
  res.render('home/user', { title: "Ideal: User Home" });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Ideal: Register' });
});

router.post('/register', function(req, res) {
  res.render('index', { title: 'Ideal' });
});

module.exports = router;
