var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ideal' });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Ideal: Register' });
});

router.post('/', function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  res.render('home/user', { title: "Ideal: User Home" });
});

module.exports = router;
