var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express - Roster Scheduler Home Page' });
});

//add any more routes that must be used by all eg- login, logout

//specific model routes go in that model's file
router.use('/example',require('./example'));

module.exports = router;
