const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController')

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const isAdmin = require('../middleware/SessionCheck').isAdmin;

/* GET localhost/example page */
router.get('/home', function(req, res, next) {
  res.send('respond with a resouurce');
});


//GET routes
router.get('/add/:wid',adminController.addDoctorPage);
router.get('/remove/:wid',adminController.removeDoctorPage);
router.get('/ward/:wid',adminController.wardPage);
router.get('/allwards',adminController.allWardsPage);
router.get('/issue',adminController.issuePage);
router.get('/register',adminController.newRegPage);

//POST routes
// router.post('/create',adminController.createWard);
// router.post('/add',adminController.addDoctor);
router.post('/issue',adminController.solveDoctorIssue);
router.post('/register',adminController.solveRegistration);
router.post('/reject',adminController.rejectRegistration);

module.exports = router;




