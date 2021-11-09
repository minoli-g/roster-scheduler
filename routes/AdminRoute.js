const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController')

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const ifNotLoggedIn = require('../middleware/SessionCheck').ifNotLoggedIn;
const isAdmin = require('../middleware/SessionCheck').isAdmin;

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});


//GET routes
router.get('/add/:wid',ifLoggedIn,isAdmin, adminController.addDoctorPage);
router.get('/ward/:wid',ifLoggedIn,isAdmin,adminController.wardPage);
router.get('/allwards',ifLoggedIn,isAdmin, adminController.allWardsPage);
router.get('/issue',ifLoggedIn,isAdmin, adminController.issuePage);
router.get('/register',ifLoggedIn,isAdmin, adminController.newRegPage);
router.get('/roster/:wid',ifLoggedIn,isAdmin,adminController.allRostersPage);
router.get('/roster/:wid/:y/:m',ifLoggedIn,isAdmin,adminController.viewRoster);
router.get('/ghost',ifNotLoggedIn, adminController.ghostSignupPage);
//router.get('/testing',ifLoggedIn,isAdmin,adminController.createRoster);

//POST routes
// router.post('/create',adminController.createWard);
// router.post('/add',adminController.addDoctor);
router.post('/add',ifLoggedIn,isAdmin, adminController.addDoctor);
router.post('/remove',ifLoggedIn,isAdmin, adminController.removeDoctor);
router.post('/issue',ifLoggedIn,isAdmin, adminController.solveDoctorIssue);
router.post('/register',ifLoggedIn,isAdmin, adminController.solveRegistration);
router.post('/reject',ifLoggedIn,isAdmin, adminController.rejectRegistration);
router.post('/roster',ifLoggedIn,isAdmin,adminController.createRoster);
router.post('/ghost',ifNotLoggedIn, adminController.ghostSignup);



module.exports = router;