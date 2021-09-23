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
router.get('/add/:wid',adminController.addDoctorPage);
router.get('/remove/:wid',adminController.removeDoctorPage);
router.get('/ward/:wid',adminController.wardPage);
router.get('/issue',adminController.acceptRegistration);


//POST routes
// router.post('/create',adminController.createWard);
router.post('/add',adminController.addDoctor);

module.exports = router;




