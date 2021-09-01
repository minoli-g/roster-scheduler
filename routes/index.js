var express = require('express');
var router = express.Router();

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const ifNotLoggedIn = require('../middleware/SessionCheck').ifNotLoggedIn;

const UserController = require('../controllers/UserController');
const ConsultantController = require('../controllers/ConsultantController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express - Roster Scheduler Home Page' });
});

//add any more routes that must be used by all eg- login, logout
//GET routes
router.get('/login', ifNotLoggedIn, UserController.loginPage);
router.get('/home', ifLoggedIn, UserController.homePage);
router.get('/logout', ifLoggedIn, UserController.logout);


//POST routes
router.post('/login',ifNotLoggedIn, UserController.login);

//specific model routes go in that model's file
router.use('/example',require('./example'));

router.use('/consultant',require('./consultant'));

module.exports = router;
