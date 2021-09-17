var express = require('express');
var router = express.Router();
var consultantController = require('../controllers/consultantController');

const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const isConsultant = require('../middleware/SessionCheck').isConsultant;

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});


//GET routes
router.get('/create',ifLoggedIn, isConsultant, consultantController.createWardPage);
router.get('/add/:wid',consultantController.addDoctorPage);
router.get('/edit/:wid',consultantController.changeParamsPage);
router.get('/ward/:wid',ifLoggedIn, isConsultant,consultantController.wardPage);

//POST routes
router.post('/create',ifLoggedIn, isConsultant,consultantController.createWard);
router.post('/add',consultantController.addDoctor);
router.post('/edit',consultantController.editParams);

module.exports = router;