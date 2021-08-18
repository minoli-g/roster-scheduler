var express = require('express');
var router = express.Router();

const UserController = require('../controllers/UserController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express - Roster Scheduler Home Page' });
});

//add any more routes that must be used by all eg- login, logout
//GET routes
router.get('/login', UserController.loginPage);
router.get('/home', UserController.homePage);
router.get('/logout', UserController.logout);


//POST routes
router.post('/login',UserController.login);

//specific model routes go in that model's file
router.use('/example',require('./example'));

module.exports = router;
