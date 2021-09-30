var express = require('express');
var router = express.Router();
var consultantController = require('../controllers/consultantController');
var consultantValidator = require('../controllers/validators/consultant');


const ifLoggedIn = require('../middleware/SessionCheck').ifLoggedIn;
const isConsultant = require('../middleware/SessionCheck').isConsultant;

/* GET localhost/example page */
router.get('/', function(req, res, next) {
  res.send('respond with a resouurce');
});


//GET routes
router.get('/create',ifLoggedIn, isConsultant, consultantController.createWardPage);
router.get('/add/:wid',ifLoggedIn, isConsultant, consultantController.addDoctorPage);
router.get('/edit/:wid',ifLoggedIn, isConsultant, consultantController.changeParamsPage);
router.get('/ward/:wid',ifLoggedIn, isConsultant,consultantController.wardPage);
router.get('/reports',ifLoggedIn,isConsultant, consultantController.reportMsgPage);
router.get('/wards',ifLoggedIn, isConsultant, consultantController.allWardsPage);
router.get('/leaves',ifLoggedIn, isConsultant, consultantController.leaveAppPage);
router.get('/roster/:wid',ifLoggedIn, isConsultant, consultantController.rosterPage);

//POST routes
router.post('/create',ifLoggedIn, isConsultant,consultantValidator.checkCreateWard(), consultantController.createWard);
router.post('/add',ifLoggedIn, isConsultant,consultantController.addDoctor);
router.post('/edit',ifLoggedIn, isConsultant, consultantValidator.checkEditParams(), consultantController.editParams);
router.post('/reports',ifLoggedIn,isConsultant, consultantController.resolveIssue);
//router.post('/leaves',ifLoggedIn,isConsultant, consultantController.updateLeave);

module.exports = router;