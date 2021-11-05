var express = require('express');
var router = express.Router();

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const ifNotLoggedIn = require('../middleware/SessionCheck').ifNotLoggedIn;

const UserController = require('../controllers/UserController');
const userValidator = require('../controllers/validators/user');

/* GET home page. */
router.get('/', ifNotLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Express - Roster Scheduler Home Page' });
});

//add any more routes that must be used by all eg- login, logout
//GET routes
router.get('/login', ifNotLoggedIn, UserController.loginPage);
router.get('/home', ifLoggedIn, UserController.homePage);
router.get('/logout', ifLoggedIn, UserController.logout);
router.get('/signup',ifNotLoggedIn, UserController.signupPage);


//POST routes
router.post('/login',ifNotLoggedIn, UserController.login);
router.post('/signup',ifNotLoggedIn, userValidator.registrationReq(),UserController.signup);

//specific model routes go in that model's file
router.use('/example',require('./example'));

router.use('/consultant',require('./consultant'));
router.use('/admin',require('./AdminRoute'));
router.use('/doctor', require('./doctorRoutes'));


module.exports = router;
