const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController')

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const isAdmin = require('../middleware/SessionCheck').isAdmin;

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});


//GET routes
router.get('/add/:wid', adminController.addDoctorPage);
router.get('/ward/:wid',adminController.wardPage);
router.get('/allwards',ifLoggedIn,isAdmin, adminController.allWardsPage);
router.get('/issue',ifLoggedIn,isAdmin, adminController.issuePage);
router.get('/register',ifLoggedIn,isAdmin, adminController.newRegPage);

//POST routes
// router.post('/create',adminController.createWard);
// router.post('/add',adminController.addDoctor);
router.post('/add', adminController.addDoctor);
router.post('/remove', adminController.removeDoctor);
router.post('/issue',ifLoggedIn,isAdmin, adminController.solveDoctorIssue);
router.post('/register',ifLoggedIn,isAdmin, adminController.solveRegistration);
router.post('/reject',ifLoggedIn,isAdmin, adminController.rejectRegistration);

module.exports = router;




